# TP8 — Matrice de tests

**Date d'exécution :** 19 novembre 2026  
**Environnement :** PHP 8.5.4, MariaDB locale, base `stages`, serveur `php -S 127.0.0.1:8010 -t public`  
**Principe :** l'attendu a été écrit avant l'exécution ; l'observé est reporté après exécution.  
**Preuve principale :** [`preuves/tests_tp8.txt`](preuves/tests_tp8.txt)

| Test | Exigence | Données | Attendu | Observé | Preuve |
|---|---|---|---|---|---|
| T-01 | EF-03 / ENF-02 | `PATCH /api/demandes/999/statut`, responsable, `{"decision":"VALIDEE"}` | `404` | `404`, `{"erreur":"Demande introuvable."}` | `tests_tp8.txt` §T-01 |
| T-02 | EF-03 / ENF-02 | `PATCH /api/demandes/2/statut`, responsable, `{"decision":"REFUSEE"}` sans `motif` | `400`, demande 2 toujours `SOUMISE` | `400`, motif obligatoire ; statut inchangé | `tests_tp8.txt` §T-02 |
| T-03 | EF-03 | `PATCH /api/demandes/3/statut`, demande déjà `VALIDEE`, `{"decision":"VALIDEE"}` | `409`, statut inchangé | `409`, demande 3 toujours `VALIDEE` | `tests_tp8.txt` §T-03 |
| T-04 | EF-05 / ENF-02 | `POST /api/soutenances` avec `date_heure="2026-02-30 10:00:00"` | `400` | `400`, `{"erreur":"Date de soutenance invalide."}` | `tests_tp8.txt` §T-04 |
| T-05 | ENF-01 | Étudiant B connecté, `GET /api/demandes/4` (dossier de l'étudiant A) | `403` sans aucune donnée du dossier | `403`, corps sans `ADJOVI` ni objet `etudiant` | `tests_tp8.txt` §T-05 |
| T-06 | ENF-02 / sécurité | `GET /api/demandes/1%20OR%201=1`, étudiant A | `404` (identifiant non numérique) | `404` | `tests_tp8.txt` §T-06 |
| T-07 | ENF-02 / injection SQL | `GET /api/demandes?q=1%20OR%201=1`, responsable | `200` avec liste vide, pas toute la table | `200`, `[]` | `tests_tp8.txt` §T-06 |
| T-08 | Sécurité TP8 / CSRF | `POST /api/demandes`, étudiant A connecté, sans `X-CSRF-Token` | `403` | `403`, `{"erreur":"Jeton CSRF invalide ou absent."}` | `tests_tp8.txt` §T-07 |
| T-09 | Sécurité TP8 / CSRF | Même requête avec `X-CSRF-Token: jeton-invalide` | `403` | `403` | `tests_tp8.txt` §T-07 |
| T-10 | EF-02 / CSRF | Même requête avec le jeton valide de la session | `201` | `201`, demande créée en `SOUMISE` | `tests_tp8.txt` §T-07 |
| T-11 | EF-01 / sécurité | `SELECT` des 6 comptes, `password_verify()` avec les mots de passe de démonstration | 6 hashes bcrypt, vérification vraie, 0 mot de passe en clair | 6 préfixes `$2y$12$`, 6 vérifications vraies, 0 en clair | `preuves/mots_de_passe.txt` |
| T-12 | EF-01 / autorisation | `GET /api/demandes`, étudiant A | `403` | `403`, `{"erreur":"Accès interdit."}` | `tests_tp8.txt` §Autorisations |
| T-13 | EF-01 / autorisation | `GET /api/entreprises`, responsable | `403` | `403`, `{"erreur":"Accès interdit."}` | `tests_tp8.txt` §Autorisations |
| T-14 | EF-02 / ENF-02 | `POST /api/demandes` sans cookie de session | `401` | `401`, `{"erreur":"Authentification requise."}` | `tests_tp8.txt` §Sans session |
| T-15 | EF-05 | `POST /api/soutenances` avec `demande_id` validée, `date_heure="2027-04-10 09:30:00"`, salle libre | `201` | `201`, soutenance créée | `tests_tp8.txt` §EF-05 |
| T-16 | EF-05 | Deuxième `POST /api/soutenances` pour la même demande | `409` | `409`, `{"erreur":"Cette demande a déjà une soutenance."}` | `tests_tp8.txt` §EF-05 |
| T-17 | ENF-02 / cas limite | `PATCH /api/demandes/-1/statut`, responsable | `404` (route à identifiant positif) | `404` | `tests_tp8.txt` §Identifiant négatif |
| T-18 | EF-06 / ENF-01 | Étudiant A connecté, `GET /api/demandes/4` (son propre dossier) | `200` avec ses données | `200`, dossier `ADJOVI` | `tests_tp8.txt` §T-05 |
| T-19 | Sécurité TP8 / CSRF | `POST /api/connexion` sans jeton, sans session | `403` | `403`, `{"erreur":"Jeton CSRF invalide ou absent."}` | `tests_tp8.txt` §Jetons CSRF |

## Synthèse

- **19 tests exécutés, 19 conformes.**
- Les quatre cas limites imposés sont couverts : T-01, T-02, T-03 et T-04.
- L'autorisation et l'injection sont couvertes par T-05 à T-07 et T-18.
- Les mots de passe et le CSRF sont couverts par T-08 à T-11 et T-19.
- T-15 et T-16 vérifient la programmation d'une soutenance et l'unicité par demande (EF-05).

## Lecture des preuves

Le script `tests/test_api_tp8.sh` affiche pour chaque contrôle :

```text
[OK] nom du contrôle -> HTTP code
corps JSON de la réponse
```

Les sections sont repérées par les libellés `T-01` à `T-07`, `EF-05`, `Autorisations` et
`Sans session`. La preuve des mots de passe est une sortie SQL + PHP séparée, car elle ne passe
pas par HTTP.
