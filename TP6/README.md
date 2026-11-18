# TP6 — API des demandes

## Objectif

Implémenter la création, la lecture et la validation d'une demande de stage avec :

- des requêtes préparées dans `DemandeRepository` ;
- une table de transitions refusant les changements interdits avec `409` ;
- une authentification par mot de passe haché et session ;
- une transaction pour écrire le statut et l'historique ensemble ;
- des codes HTTP cohérents et testables avec Postman.

## Ce qui est livré

| Élément | Emplacement |
|---|---|
| Dépôt des demandes (`findById`, `findByStudent`, `create`, `updateStatus`) | `src/Repositories/DemandeRepository.php` |
| Transitions, validation et transactions | `src/Services/DemandeService.php` |
| Authentification et session | `src/Services/AuthService.php` |
| Comptes de connexion | `src/Repositories/UtilisateurRepository.php` |
| Contrôleurs HTTP | `src/Controllers/` |
| Table `utilisateur` et table `historique_demande` | `TP6/001_schema_tp6.sql` |
| Comptes et historique fictifs | `TP6/002_seed_tp6.sql` |
| Collection Postman | `TP6/postman/TP6_API.postman_collection.json` |
| Preuves des six cas HTTP | `TP6/preuves_tests.md` |

## Modèle ajouté

`utilisateur` contient les comptes : email unique, hash du mot de passe, rôle, lien
éventuel vers `etudiant`, et indicateur `actif`. Le mot de passe n'est jamais stocké en clair.

`historique_demande` trace chaque changement de statut : ancien statut, nouveau statut,
motif éventuel, auteur et date. La validation écrit le statut et cette ligne dans la même
transaction ; si l'insertion échoue, le `ROLLBACK` annule la mise à jour.

## Installation locale

Depuis la racine du dépôt, avec une base `stages` déjà créée :

```bash
mariadb -u stages -p stages < TP3/001_schema.sql
mariadb -u stages -p stages < TP3/002_seed.sql
mariadb -u stages -p stages < TP6/001_schema_tp6.sql
mariadb -u stages -p stages < TP6/002_seed_tp6.sql
mariadb -u stages -p stages < TP6/003_verification.sql
```

Pour rejouer le jeu d'essai sur une base qui contient déjà le TP6 :

```bash
mariadb -u stages -p stages < TP6/000_reset_tp6.sql
mariadb -u stages -p stages < TP3/001_schema.sql
mariadb -u stages -p stages < TP3/002_seed.sql
mariadb -u stages -p stages < TP6/001_schema_tp6.sql
mariadb -u stages -p stages < TP6/002_seed_tp6.sql
```

Lancer le serveur :

```bash
php -S 127.0.0.1:8000 -t public
```

## Comptes fictifs

| Email | Mot de passe | Rôle | Étudiant lié |
|---|---|---|---|
| `etudiant1@univ.test` | `etudiant123` | `ETUDIANT` | 1 — ADJOVI Koffi |
| `etudiant2@univ.test` | `etudiant123` | `ETUDIANT` | 2 — BELLO Aicha |
| `etudiant3@univ.test` | `etudiant123` | `ETUDIANT` | 3 — DOSSOU Marc |
| `responsable@univ.test` | `responsable123` | `RESPONSABLE` | — |
| `admin@univ.test` | `admin123` | `ADMINISTRATEUR` | — |
| `developpeur@univ.test` | `developpeur123` | `DEVELOPPEUR` | — |

Ces comptes sont strictement fictifs et destinés au serveur local.

## Routes

| Méthode | Chemin | Rôle autorisé | Succès | Erreurs |
|---|---|---|---|---|
| `GET` | `/api/sante` | public | `200` | `503` |
| `POST` | `/api/connexion` | public | `200` | `400`, `401` |
| `POST` | `/api/deconnexion` | session | `200` | — |
| `GET` | `/api/moi` | session | `200` | `401` |
| `GET` | `/api/demandes` | Responsable, Administrateur | `200` | `400`, `401`, `403` |
| `GET` | `/api/demandes/mes-demandes` | Étudiant | `200` | `401`, `403` |
| `POST` | `/api/demandes` | Étudiant | `201` | `400`, `401`, `403` |
| `PATCH` | `/api/demandes/{id}/statut` | Responsable, Administrateur | `200` | `400`, `401`, `403`, `404`, `409` |

`GET /api/demandes` accepte les paramètres optionnels `statut` et `q`.

## Authentification

Le navigateur ou Postman reçoit un cookie de session `STAGES_SESSION` après une connexion
réussie. Le cookie est `HttpOnly`, `SameSite=Lax`, et `Secure` lorsque HTTPS est actif.

```bash
curl -i -c cookies.txt \
  -H 'Content-Type: application/json' \
  -d '{"email":"etudiant1@univ.test","mot_de_passe":"etudiant123"}' \
  http://127.0.0.1:8000/api/connexion
```

Réponse :

```json
{
  "utilisateur": {
    "id": 1,
    "email": "etudiant1@univ.test",
    "role": "ETUDIANT",
    "etudiant_id": 1,
    "nom": "ADJOVI",
    "prenom": "Koffi"
  }
}
```

Les requêtes suivantes réutilisent le cookie :

```bash
curl -b cookies.txt http://127.0.0.1:8000/api/moi
curl -b cookies.txt http://127.0.0.1:8000/api/demandes/mes-demandes
```

Le message d'échec est identique pour un compte inconnu et un mot de passe faux :
`{"erreur":"Identifiants invalides."}` avec le code `401`.

## Exemple de validation

```bash
curl -b cookies-responsable.txt \
  -X PATCH \
  -H 'Content-Type: application/json' \
  -d '{"decision":"VALIDEE"}' \
  http://127.0.0.1:8000/api/demandes/2/statut
```

```json
{
  "id": 2,
  "statut": "VALIDEE",
  "motif_refus": null,
  "date_decision": "2026-11-18 16:00:00"
}
```

Règles :

- une demande `SOUMISE` peut passer à `VALIDEE` ou `REFUSEE` ;
- un refus exige un `motif` non vide (255 caractères maximum) ;
- une validation n'accepte pas de motif ;
- toute autre transition renvoie `409` ;
- une demande inexistante renvoie `404`.

## Tester avec Postman

1. Importer `TP6/postman/TP6_API.postman_collection.json`.
2. Vérifier la variable `base_url` : `http://127.0.0.1:8000`.
3. Lancer d'abord le dossier **Scénario étudiant**, puis **Scénario responsable**.
4. Postman conserve automatiquement le cookie de session entre les requêtes.

La variable `demande_id` est renseignée par la requête **Créer une demande**. Si vous lancez
uniquement le scénario responsable, la valeur par défaut `2` est utilisée ; la demande 2 doit
alors être au statut `SOUMISE` (état du jeu d'essai).

Les requêtes attendues couvrent : `200`, `201`, `400`, `401`, `403`, `404` et `409`.

## Tests automatiques

```bash
php tests/test_transitions.php
BASE_URL=http://127.0.0.1:8000 ./tests/test_api_tp6.sh
```

`test_transitions.php` ne touche pas la base. `test_api_tp6.sh` suppose une base rechargée
avec le jeu d'essai TP6 et un serveur actif.

Les sorties attendues sont consignées dans [`preuves_tests.md`](preuves_tests.md).

## Architecture

```text
public/index.php          routeur, session, réponse JSON
src/Container.php         fabrique de dépendances sans framework
src/Controllers/          traduction HTTP -> services
src/Services/             règles métier, transitions, transactions, auth
src/Repositories/         seul endroit où se trouve le SQL
src/Exceptions/           HttpException avec code HTTP
src/Http/Json.php         lecture du corps JSON
```
