# TP8 — Plan de tests et audit de sécurité

## Objectif

Vérifier l'application avec une matrice de tests reliée aux exigences, exécuter les cas limites
demandés et contrôler les points de sécurité du chapitre 8 :

- autorisation serveur : l'étudiant B ne lit pas le dossier de l'étudiant A (`403` sans donnée) ;
- injection SQL : `1 OR 1=1` reste une valeur, pas du SQL ;
- mots de passe hachés dans la base ;
- jeton CSRF sur les écritures ;
- revue de code avec quatre remarques classées.

## Livrables

| Livrable | Fichier |
|---|---|
| Matrice de tests renseignée (19 lignes) | [`matrice_tests.md`](matrice_tests.md) |
| Sortie complète des tests TP8 | [`preuves/tests_tp8.txt`](preuves/tests_tp8.txt) |
| Preuve des mots de passe hachés | [`preuves/mots_de_passe.txt`](preuves/mots_de_passe.txt) |
| Capture d'accès interdit (étudiant B) | [`preuves/etudiant-b-acces-interdit.png`](preuves/etudiant-b-acces-interdit.png) |
| Fiche de revue de code | [`fiche_revue_code.md`](fiche_revue_code.md) |
| Fiche de recette (5 scénarios) | [`fiche_recette.md`](fiche_recette.md) |
| Script exécutable | [`../tests/test_api_tp8.sh`](../tests/test_api_tp8.sh) |

## Ce qui a été ajouté au code

| Élément | Fichier | Rôle |
|---|---|---|
| Jeton CSRF synchronisé | `src/Security/Csrf.php` | génère le jeton, vérifie `X-CSRF-Token` |
| Route `GET /api/csrf` | `src/Controllers/AuthController.php`, `public/index.php` | fournit le jeton à la session |
| Lecture d'un dossier | `DemandeController::detail`, `DemandeService::trouver` | contrôle de propriété serveur, `403` pour un autre étudiant |
| Programmation d'une soutenance | `src/Controllers/SoutenanceController.php`, `src/Services/SoutenanceService.php`, `src/Repositories/SoutenanceRepository.php` | route minimale EF-05, validation de date et de créneau |
| Tests TP8 | `tests/test_api_tp8.sh` | cas limites, autorisation, injection, CSRF |

La route `POST /api/soutenances` a été ajoutée pour que le cas limite « date de soutenance
invalide » soit vérifié au niveau HTTP avec un vrai `400`. Elle ne dispose pas encore d'écran
dédié : la programmation se teste par l'API. L'affectation d'un encadreur (EF-04) reste hors du
périmètre de ce TP.

## Protection CSRF retenue

Le projet utilise un **jeton synchronisé stocké en session** :

1. le serveur génère un jeton aléatoire de 32 octets par session (`bin2hex(random_bytes(32))`) ;
2. le client le récupère avec `GET /api/csrf` ;
3. le frontend l'envoie dans l'en-tête `X-CSRF-Token` pour toute écriture ;
4. le serveur compare avec `hash_equals()` et répond `403` si le jeton est absent ou faux.

Toutes les écritures exigent le jeton, y compris `POST /api/connexion` : le formulaire de connexion
récupère d'abord le jeton, puis le renvoie. Un site tiers ne peut ni lire le jeton (Same-Origin
Policy), ni le placer dans un en-tête personnalisé sans preflight CORS. Les écritures sans session
autres que la connexion laissent l'authentification répondre `401`.

## Pourquoi les requêtes préparées bloquent l'injection

Le dépôt utilise systématiquement `PDO::prepare()` puis `execute()` avec des paramètres nommés, et
la connexion désactive l'émulation :

```php
PDO::ATTR_EMULATE_PREPARES => false
```

Avec une vraie requête préparée, le serveur MySQL reçoit d'abord la structure SQL, dans laquelle
les valeurs sont remplacées par des marqueurs (`:id`, `:q1`, etc.). Il analyse et prépare cette
structure avant de recevoir les valeurs. Celles-ci sont ensuite transmises séparément comme
données typées : la chaîne `1 OR 1=1` reste une valeur, elle ne peut pas devenir un opérateur ou
une clause SQL. Sans préparation, une concaténation produirait au contraire
`WHERE id = 1 OR 1=1`, donc toujours vrai.

Le test T-07 envoie `q=1 OR 1=1` dans un `LIKE :q1` : la recherche retourne `[]`, pas toute la
table. Le test T-06 envoie `1 OR 1=1` comme identifiant : la route refuse un identifiant non
numérique (`404`). Les seuls fragments SQL construits dynamiquement sont des extraits fixes et
maîtrisés (`d.statut = :statut`, `LIKE :q1`) ; aucune valeur utilisateur n'est concaténée.

## Rejouer les tests

```bash
# 1. Recharger le jeu d'essai
mariadb --socket=/run/mysqld/mysqld.sock -u stages -pmotdepasse stages < TP6/000_reset_tp6.sql
mariadb --socket=/run/mysqld/mysqld.sock -u stages -pmotdepasse stages < TP3/001_schema.sql
mariadb --socket=/run/mysqld/mysqld.sock -u stages -pmotdepasse stages < TP3/002_seed.sql
mariadb --socket=/run/mysqld/mysqld.sock -u stages -pmotdepasse stages < TP6/001_schema_tp6.sql
mariadb --socket=/run/mysqld/mysqld.sock -u stages -pmotdepasse stages < TP6/002_seed_tp6.sql

# 2. Lancer le serveur
php -S 127.0.0.1:8010 -t public

# 3. Exécuter les tests dans un second terminal
BASE_URL=http://127.0.0.1:8010 ./tests/test_api_tp8.sh
```

Le script crée une demande supplémentaire, la valide et programme une soutenance : il faut donc
recharger le jeu d'essai avant de le rejouer, ou accepter les identifiants supplémentaires.

## Résultat

Les 19 tests de la matrice passent (38 assertions) :

- 4 cas limites demandés : demande inexistante `404`, refus sans motif `400`, validation répétée
  `409`, date invalide `400` ;
- autorisation : dossier d'un autre étudiant `403` sans donnée ;
- injection : identifiant `1 OR 1=1` refusé par la route, recherche préparée sans résultat ;
- CSRF : connexion sans jeton `403`, écriture sans jeton `403`, jeton invalide `403`,
  jeton valide `201` ;
- mots de passe : 6 comptes en bcrypt `$2y$12$`, `password_verify()` vrai, 0 mot de passe en clair.

## Dette technique connue

- pas de limitation des tentatives de connexion (ENF-05, priorité Should) ;
- `strlen()` compte les octets et non les caractères pour le motif de refus : la limite de 255
  octets est plus stricte que la colonne `VARCHAR(255)` et ne crée pas de faille, mais elle
  pénalise les accents ;
- pas encore d'écran de programmation de soutenance ni d'affectation d'encadreur ;
- la recette utilisateur doit encore être signée par l'encadreur jouant le rôle du client.
