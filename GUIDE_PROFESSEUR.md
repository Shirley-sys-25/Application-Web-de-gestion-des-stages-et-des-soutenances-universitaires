# Guide d'installation et de test pour le professeur

Ce guide permet de récupérer le projet depuis GitHub et de le lancer sur un poste
Windows, Linux ou macOS, sans Composer et sans npm.

Le dépôt est public :

<https://github.com/Shirley-sys-25/Application-Web-de-gestion-des-stages-et-des-soutenances-universitaires>

> Les données sont fictives. Les comptes de démonstration et les mots de passe sont
> uniquement destinés à un serveur local.

## 1. Récupérer le projet

### Avec Git

```bash
git clone https://github.com/Shirley-sys-25/Application-Web-de-gestion-des-stages-et-des-soutenances-universitaires.git
cd Application-Web-de-gestion-des-stages-et-des-soutenances-universitaires
```

### Sans Git

1. Ouvrir la page GitHub du dépôt.
2. Cliquer sur **Code** puis **Download ZIP**.
3. Décompresser l'archive.
4. Ouvrir un terminal dans le dossier obtenu.

## 2. Prérequis

| Outil | Version minimale | Vérification |
|---|---|---|
| PHP | 8.1 | `php -v` |
| Extension `pdo_mysql` | activée | `php -m` |
| MySQL ou MariaDB | MySQL 8 / MariaDB 10.6 | `mysql --version` ou `mariadb --version` |
| Git | facultatif | `git --version` |

Sous Windows, XAMPP ou WAMP conviennent : ils fournissent PHP et MariaDB.
Vérifier que l'extension `pdo_mysql` est active dans `php.ini`.

```bash
# Linux / macOS
php -m | grep -i pdo_mysql

# Windows (cmd)
php -m | findstr /i pdo_mysql
```

## 3. Créer la base et l'utilisateur SQL

Le projet utilise une base nommée `stages`.

### Option A — ligne de commande

```bash
mysql -u root -p
```

Puis exécuter :

```sql
CREATE DATABASE IF NOT EXISTS stages
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'stages'@'localhost' IDENTIFIED BY 'change_me';
CREATE USER IF NOT EXISTS 'stages'@'127.0.0.1' IDENTIFIED BY 'change_me';

GRANT ALL PRIVILEGES ON stages.* TO 'stages'@'localhost';
GRANT ALL PRIVILEGES ON stages.* TO 'stages'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;
```

Remplacer `change_me` par un mot de passe local, puis reporter la même valeur
dans `.env`.

Sous Linux, si le compte `root` de MariaDB utilise l'authentification
`unix_socket`, utiliser `sudo mysql` au lieu de `mysql -u root -p`.

### Option B — phpMyAdmin (Windows)

1. Démarrer Apache et MySQL dans XAMPP/WAMP.
2. Ouvrir <http://localhost/phpmyadmin>.
3. Créer la base `stages` avec l'encodage `utf8mb4_unicode_ci`.
4. Onglet **Importer** : importer les quatre fichiers SQL dans l'ordre indiqué
   à la section 5.

Pour un simple test local, il est aussi possible d'utiliser directement le compte
`root` de XAMPP dans `.env` (`DB_USER=root`, `DB_PASS=`), mais un utilisateur
dédié est préférable.

## 4. Configurer `.env`

À la racine du projet :

```bash
cp .env.example .env
```

Sous Windows, créer une copie de `.env.example` et la renommer `.env`.

Exemple :

```dotenv
APP_ENV=local
APP_DEBUG=true

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=stages
DB_USER=stages
DB_PASS=change_me

# Connexion par socket Unix, optionnelle et prioritaire sur DB_HOST/DB_PORT
# DB_SOCKET=/run/mysqld/mysqld.sock
```

Points à vérifier :

- `DB_PASS` doit correspondre au mot de passe créé à l'étape 3.
- Si MySQL écoute sur un autre port (par exemple `3307` avec XAMPP), modifier
  `DB_PORT`.
- Sur Linux, si la connexion TCP est refusée, utiliser le socket :
  `DB_SOCKET=/run/mysqld/mysqld.sock`.
- Le fichier `.env` n'est jamais versionné et ne doit pas être publié.

## 5. Importer les scripts SQL

Depuis la racine du projet, dans cet ordre :

```bash
mysql -u stages -p stages < TP3/001_schema.sql
mysql -u stages -p stages < TP3/002_seed.sql
mysql -u stages -p stages < TP6/001_schema_tp6.sql
mysql -u stages -p stages < TP6/002_seed_tp6.sql
```

Remplacer `mysql` par `mariadb` si votre installation utilise ce nom.

Vérification rapide :

```bash
mysql -u stages -p -t stages < TP6/003_verification.sql
```

Pour rejouer complètement le jeu d'essai après des tests, exécuter d'abord le
script de remise à zéro, puis les quatre scripts :

```bash
mysql -u stages -p stages < TP6/000_reset_tp6.sql
mysql -u stages -p stages < TP3/001_schema.sql
mysql -u stages -p stages < TP3/002_seed.sql
mysql -u stages -p stages < TP6/001_schema_tp6.sql
mysql -u stages -p stages < TP6/002_seed_tp6.sql
```

> L'ordre est important : `TP6/000_reset_tp6.sql` supprime les tables
> `utilisateur` et `historique_demande`, qui dépendent de la table `etudiant`.

## 6. Lancer l'application

Depuis la racine du projet :

```bash
php -S 127.0.0.1:8000 -t public
```

Sous Windows, si `php` n'est pas dans le `PATH`, utiliser par exemple :

```bat
C:\xampp\php\php.exe -S 127.0.0.1:8000 -t public
```

Ouvrir ensuite :

- application : <http://127.0.0.1:8000/>
- état de l'API : <http://127.0.0.1:8000/api/sante>

Le serveur PHP intégré doit rester ouvert pendant les tests. Il ne faut pas ouvrir
directement `public/index.html` avec `file://` : les appels API ne fonctionneraient
pas.

## 7. Comptes fictifs

| Email | Mot de passe | Rôle | Étudiant lié |
|---|---|---|---|
| `etudiant1@univ.test` | `etudiant123` | Étudiant | 1 — ADJOVI Koffi |
| `etudiant2@univ.test` | `etudiant123` | Étudiant | 2 — BELLO Aicha |
| `etudiant3@univ.test` | `etudiant123` | Étudiant | 3 — DOSSOU Marc |
| `responsable@univ.test` | `responsable123` | Responsable | — |
| `admin@univ.test` | `admin123` | Administrateur | — |
| `developpeur@univ.test` | `developpeur123` | Développeur | — |

Les mots de passe sont stockés en bcrypt dans la base. Ils sont fictifs.

## 8. Scénario de test recommandé

Ce parcours montre les fonctions principales et la sécurité.

### Étape 1 — Étudiant A consulte son dossier refusé

1. Se connecter avec `etudiant1@univ.test` / `etudiant123`.
2. Ouvrir **Mes demandes**.
3. Ouvrir la demande **#4**.
4. Constater qu'elle est **Refusée** et que le motif est affiché.

### Étape 2 — Étudiant B tente d'ouvrir le dossier de A

1. Se déconnecter.
2. Se connecter avec `etudiant2@univ.test` / `etudiant123`.
3. Forcer l'URL suivante dans le navigateur :

```text
http://127.0.0.1:8000/#/etudiant/demandes/4
```

4. Résultat attendu : **« Accès interdit à ce dossier. »**

Ce résultat est volontaire. C'est le test **T-05 / ENF-01** du TP8 : le serveur
répond `403` et ne renvoie aucune donnée du dossier de l'étudiant A. Le contrôle
d'autorisation est fait côté backend, pas seulement masqué dans l'interface.

5. Ouvrir ensuite son propre dossier **#2** : l'accès doit fonctionner.

### Étape 3 — Responsable valide une demande

1. Se déconnecter.
2. Se connecter avec `responsable@univ.test` / `responsable123`.
3. Ouvrir **Demandes à traiter**.
4. Ouvrir la demande **#2** de BELLO Aicha.
5. Choisir **Valider**, puis confirmer.
6. Montrer l'écran de confirmation.

### Étape 4 — L'étudiante B voit le nouveau statut

1. Se déconnecter.
2. Se reconnecter avec `etudiant2@univ.test` / `etudiant123`.
3. Ouvrir **Mes demandes**.
4. La demande **#2** doit maintenant être **Validée**.

## 9. Tests automatisés

Les tests PHP ne nécessitent pas le serveur :

```bash
php tests/test_connexion.php
php tests/test_transitions.php
```

Les tests HTTP nécessitent le serveur lancé :

```bash
BASE_URL=http://127.0.0.1:8000 ./tests/test_api_tp6.sh
BASE_URL=http://127.0.0.1:8000 ./tests/test_api_tp8.sh
```

Sous Windows, exécuter ces scripts avec **Git Bash** ou **WSL**, ou utiliser la
collection Postman fournie dans `TP6/postman/`.

Les scripts HTTP créent des données supplémentaires. Pour revenir au jeu d'essai,
relancer la procédure de remise à zéro de la section 5.

Résultats attendus :

- `test_connexion.php` : connexion PDO valide ;
- `test_transitions.php` : 7/7 transitions conformes ;
- `test_api_tp6.sh` : 12/12 cas ;
- `test_api_tp8.sh` : 19 tests, 38 assertions.

## 10. Preuves consultables sans installation

Si l'installation n'est pas souhaitée, les livrables et les preuves sont
directement consultables sur GitHub :

| Élément | Emplacement |
|---|---|
| Matrice de tests TP8 | `TP8/matrice_tests.md` |
| Sortie complète TP8 | `TP8/preuves/tests_tp8.txt` |
| Capture du 403 | `TP8/preuves/etudiant-b-acces-interdit.png` |
| Preuve des mots de passe hachés | `TP8/preuves/mots_de_passe.txt` |
| Revue de code | `TP8/fiche_revue_code.md` |
| Recette utilisateur | `TP8/fiche_recette.md` |
| Preuves du frontend TP7 | `TP7/preuves/` |
| Maquettes TP7 | `TP7/maquettes/` |
| Rapport TP7 | `TP7/preuves/rapport_tests.md` |

## 11. Périmètre réellement implémenté

| Fonction | État |
|---|---|
| Connexion, session et rôles | Implémenté |
| Dépôt d'une demande par un étudiant | Implémenté |
| Liste des demandes de l'étudiant | Implémenté |
| Détail d'une demande avec contrôle de propriété | Implémenté |
| Validation ou refus motivé par le responsable | Implémenté |
| Historique des décisions | Implémenté côté base et API |
| CSRF sur les écritures | Implémenté |
| Programmation d'une soutenance | API minimale, sans écran dédié |
| Affectation d'un encadreur (EF-04) | Non implémentée |
| Gestion des comptes et rôles (EF-10) | Non implémentée |
| HTTPS, limitation des tentatives, sauvegarde/restauration | Non implémentés dans le socle TP1-TP8 |

Le projet s'arrête au TP8. Le TP9 (second poste, sauvegarde et restauration) et
le TP10 (dossier de livraison et soutenance) ne sont pas encore produits.

## 12. Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| `Connexion à la base de données impossible` | MariaDB arrêté, `.env` incorrect ou extension absente | Démarrer MySQL, vérifier `DB_*`, activer `pdo_mysql` |
| `SQLSTATE[HY000] [2002]` | Mauvais hôte, port ou socket | Vérifier `DB_HOST`, `DB_PORT` ou `DB_SOCKET` |
| `403 Jeton CSRF invalide ou absent` | Appel API direct sans jeton | Utiliser le frontend ou `GET /api/csrf` puis `X-CSRF-Token` |
| `404` sur `/api/...` | Serveur lancé au mauvais endroit | Lancer `php -S 127.0.0.1:8000 -t public` depuis la racine |
| Page blanche ou `500` | Erreur PHP ou base non importée | Mettre `APP_DEBUG=true`, vérifier les journaux PHP, rejouer les SQL |
| `Address already in use` | Port 8000 occupé | Utiliser `php -S 127.0.0.1:8010 -t public` et adapter `BASE_URL` |
| « Accès interdit à ce dossier » sur `#4` | L'étudiant connecté n'est pas le propriétaire | Résultat attendu du test T-05 ; se connecter avec `etudiant1` |
| Les scripts `.sh` ne démarrent pas sous Windows | Pas de shell Bash | Utiliser Git Bash, WSL ou Postman |

## 13. Remarque de sécurité

Le projet est prévu pour une démonstration locale. Avant un déploiement réel, il
faudrait au minimum :

- servir l'application en HTTPS et activer `Secure` sur le cookie de session ;
- limiter les tentatives de connexion ;
- utiliser un utilisateur SQL dédié avec des droits minimaux ;
- mettre en place une sauvegarde et une restauration testées ;
- ne jamais versionner `.env`.
