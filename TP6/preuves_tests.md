# TP6 — Preuves des tests

Les tests ont été exécutés en local sur **PHP 8.5.4** avec **MariaDB** (socket `/run/mysqld/mysqld.sock`, base `stages`).

Procédure :

```bash
# Rechargement du jeu d'essai
mariadb --socket=/run/mysqld/mysqld.sock -u stages -pmotdepasse stages < TP6/000_reset_tp6.sql
mariadb --socket=/run/mysqld/mysqld.sock -u stages -pmotdepasse stages < TP3/001_schema.sql
mariadb --socket=/run/mysqld/mysqld.sock -u stages -pmotdepasse stages < TP3/002_seed.sql
mariadb --socket=/run/mysqld/mysqld.sock -u stages -pmotdepasse stages < TP6/001_schema_tp6.sql
mariadb --socket=/run/mysqld/mysqld.sock -u stages -pmotdepasse stages < TP6/002_seed_tp6.sql

# Serveur
php -S 127.0.0.1:8010 -t public

# Tests automatiques
php tests/test_transitions.php
BASE_URL=http://127.0.0.1:8010 ./tests/test_api_tp6.sh
```

## 1. Transitions (`php tests/test_transitions.php`)

```text
[OK] SOUMISE -> VALIDEE : attendu true, obtenu true
[OK] SOUMISE -> REFUSEE : attendu true, obtenu true
[OK] BROUILLON -> SOUMISE : attendu true, obtenu true
[OK] REFUSEE -> BROUILLON : attendu true, obtenu true
[OK] VALIDEE -> REFUSEE : attendu false, obtenu false
[OK] BROUILLON -> VALIDEE : attendu false, obtenu false
[OK] SOUMISE -> INCONNU : attendu false, obtenu false
Toutes les transitions sont conformes.
```

## 2. Six cas HTTP (`tests/test_api_tp6.sh`)

| Cas | Requête | Code attendu | Résultat observé |
|---|---|---:|---|
| Succès | `POST /api/demandes` (étudiant connecté, `entreprise_id=1`) | 201 | 201, demande créée en `SOUMISE` |
| 400 | `POST /api/demandes` (`entreprise_id=999`) | 400 | `{"erreur":"Entreprise inexistante."}` |
| 401 | `POST /api/demandes` sans cookie de session | 401 | `{"erreur":"Authentification requise."}` |
| 403 | `GET /api/demandes` avec un compte étudiant | 403 | `{"erreur":"Accès interdit."}` |
| 404 | `PATCH /api/demandes/999/statut` (responsable) | 404 | `{"erreur":"Demande introuvable."}` |
| 409 | `PATCH /api/demandes/{id}/statut` deux fois (`VALIDEE`) | 409 | `{"erreur":"Transition de statut interdite."}` |

Sortie du script :

```text
=== Connexion étudiant ===
[OK] Connexion étudiant -> HTTP 200
{"utilisateur":{"id":1,"email":"etudiant1@univ.test","role":"ETUDIANT","etudiant_id":1,"nom":"ADJOVI","prenom":"Koffi"}}

=== Cas 1 : succès de création ===
[OK] POST /api/demandes (entreprise 1) -> HTTP 201
{"id":5,"statut":"SOUMISE","date_depot":"2026-11-18 16:28:04"}

=== Cas 2 : 400 entreprise inexistante ===
[OK] POST /api/demandes (entreprise 999) -> HTTP 400
{"erreur":"Entreprise inexistante."}

=== Cas 3 : 401 sans session ===
[OK] POST /api/demandes sans cookie -> HTTP 401
{"erreur":"Authentification requise."}

=== Cas 4 : 403 étudiant sur la liste responsable ===
[OK] GET /api/demandes en tant qu’étudiant -> HTTP 403
{"erreur":"Accès interdit."}

=== Connexion responsable ===
[OK] Connexion responsable -> HTTP 200
{"utilisateur":{"id":4,"email":"responsable@univ.test","role":"RESPONSABLE","etudiant_id":null,"nom":null,"prenom":null}}

=== Cas 5 : 404 demande inexistante ===
[OK] PATCH /api/demandes/999/statut -> HTTP 404
{"erreur":"Demande introuvable."}

=== Validation de la demande créée (succès 200) ===
[OK] PATCH /api/demandes/5/statut -> HTTP 200
{"id":5,"statut":"VALIDEE","motif_refus":null,"date_decision":"2026-11-18 15:28:04"}

=== Cas 6 : 409 validation répétée ===
[OK] PATCH /api/demandes/5/statut (répétition) -> HTTP 409
{"erreur":"Transition de statut interdite."}

Tous les cas HTTP du TP6 sont conformes.
```

## 3. Contrôles complémentaires

- `GET /api/demandes?statut=SOUMISE` : retourne uniquement les demandes au statut `SOUMISE`.
- `GET /api/demandes?q=BELLO` : retourne la demande de l'étudiante BELLO.
- `GET /api/demandes?statut=INCONNU` : `400 {"erreur":"Statut inconnu."}`.
- `PATCH /api/demandes/2/statut` avec `{"decision":"REFUSEE"}` sans motif : `400 {"erreur":"Le motif est obligatoire pour un refus."}`.
- Refus valide : `200 {"id":2,"statut":"REFUSEE","motif_refus":"Convention manquante.",...}`.
- Administrateur (`admin@univ.test`) : `GET /api/demandes` -> `200`.
- Développeur (`developpeur@univ.test`) : `GET /api/demandes` -> `403 {"erreur":"Accès interdit."}`.
- `POST /api/deconnexion` puis `GET /api/moi` : `401`.

## 4. Transaction (statut + historique)

Vérification en base après validation de la demande 5 :

```sql
SELECT id,demande_id,ancien_statut,nouveau_statut,motif,utilisateur_id,date_evenement
FROM historique_demande WHERE demande_id=5 ORDER BY id;
SELECT id,statut,motif_refus,date_decision FROM demande_stage WHERE id=5;
```

```text
id  demande_id  ancien_statut  nouveau_statut  motif  utilisateur_id  date_evenement
10  5           NULL           SOUMISE         NULL   1               2026-11-18 16:28:04
11  5           SOUMISE        VALIDEE         NULL   4               2026-11-18 16:28:04

id  statut   motif_refus  date_decision
5   VALIDEE  NULL         2026-11-18 15:28:04
```

Test de rollback : la table `historique_demande` a été temporairement renommée, puis
`PATCH /api/demandes/2/statut {"decision":"VALIDEE"}` a renvoyé `500` sans exposer le détail SQL.
Après restauration de la table, la demande 2 est restée `SOUMISE` :

```text
HTTP 500
{"erreur":"Erreur interne du serveur."}

id  statut   date_decision
2   SOUMISE  NULL
```

Cela confirme que l'`UPDATE` du statut et l'`INSERT` d'historique sont exécutés dans la même
transaction.
