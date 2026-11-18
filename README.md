# Projet informatique 2 — Gestion des stages et des soutenances

Application web de gestion des stages universitaires : dépôt des dossiers par les étudiants,
validation ou refus motivé, affectation d'un encadreur, programmation des soutenances.

| | |
|---|---|
| **Cours** | Projet informatique 2 — L3 SIL (10 chapitres, 25 h, 10 TP) |
| **Groupe** | ANAGO Shirley, DAGNON Christie, KARIMOU NARO Sabalimath (groupe de 3) |
| **Dépôt** | <https://github.com/Shirley-sys-25/Application-Web-de-gestion-des-stages-et-des-soutenances-universitaires> |
| **Environnement** | PHP 8, MySQL ou MariaDB, Git, PlantUML — données fictives uniquement |

## Organisation du dépôt

| Dossier | Contenu |
|---|---|
| `TP1/` | Fiche de cadrage |
| `TP2/` | Exigences fonctionnelles et non fonctionnelles, matrice de traçabilité |
| `TP3/` | Diagrammes UML (`.puml` + `.png`), rapport `.docx`, scripts SQL, jeu d'essai et sorties de vérification |
| `TP4/` | Contrat d'API initial, ADR-001 et procédure de vérification locale |
| `TP6/` | Scripts SQL (`utilisateur`, `historique_demande`), collection Postman et preuves de tests |
| `public/` | Point d'entrée HTTP (`index.php`) et ressources frontend |
| `src/` | Contrôleurs, services, dépôts, exceptions HTTP et connexion PDO |
| `config/` | Chargement de la configuration depuis `.env` |
| `tests/` | Tests de connexion, transitions et scénarios HTTP de l'API |

## Branches

`main` reste toujours exécutable. Le travail se fait sur des branches courtes
(`tp1`, `tp2`, …) fusionnées après relecture du diff.

| Branche | Contenu |
|---|---|
| `main` | Squelette du dépôt : `README.md`, `.gitignore`, `.gitattributes` |
| `tp1` | Fiche de cadrage du projet |
| `tp2` | Exigences fonctionnelles et non fonctionnelles, matrice de traçabilité |
| `tp3` | Modèle UML, scripts SQL, jeu d'essai vérifié et rapport |
| `tp4` | Squelette technique, contrat d'API, route `/api/sante` et ADR-001 |
| `tp6` | API des demandes, authentification, transactions et preuves de tests |

## Périmètre retenu (v1)

**Inclus** : authentification et rôles, dépôt d'une demande de stage, validation ou refus motivé,
affectation d'un encadreur, consultation de l'état des demandes, programmation des soutenances,
journal des décisions.

**Exclus** (reportés en v2) : paiement en ligne, notifications SMS, portail entreprise,
convention signée électroniquement, messagerie interne.

## Lancer l'application (TP6)

Prérequis : PHP 8.1 ou plus, extension `pdo_mysql`, MySQL ou MariaDB.

```bash
cp .env.example .env
# Modifier DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS (ou DB_SOCKET) dans .env

# Base de données
mariadb -u stages -p stages < TP3/001_schema.sql
mariadb -u stages -p stages < TP3/002_seed.sql
mariadb -u stages -p stages < TP6/001_schema_tp6.sql
mariadb -u stages -p stages < TP6/002_seed_tp6.sql

# Vérifications
php tests/test_connexion.php
php tests/test_transitions.php

# Serveur
php -S 127.0.0.1:8000 -t public
```

L'API implémente l'authentification par session, la création, la lecture et la validation/refus
des demandes avec contrôles (`400`, `401`, `403`, `404`, `409`). Les tests API peuvent être faits
avec Postman en important [`TP6/postman/TP6_API.postman_collection.json`](TP6/postman/TP6_API.postman_collection.json).

Comptes fictifs locaux : `etudiant1@univ.test` / `etudiant123`,
`responsable@univ.test` / `responsable123`, `admin@univ.test` / `admin123`.

- Documentation TP6 : [`TP6/README.md`](TP6/README.md)
- Preuves des tests : [`TP6/preuves_tests.md`](TP6/preuves_tests.md)
- Contrat initial et ADR : [`TP4/contrat_api.md`](TP4/contrat_api.md), [`TP4/ADR-001-monolithe-modulaire.md`](TP4/ADR-001-monolithe-modulaire.md)

## Diagrammes : sources PlantUML

Les diagrammes sont du texte compilé, pas des dessins à la souris. Chaque diagramme existe en
`.puml` (versionné) et en `.png` (produit). Le jar officiel n'est pas versionné.

Le TP3 contient cinq diagrammes : cas d'usage, classes, schéma relationnel, séquence de connexion
et activité de validation d'une demande. Le diagramme de cas d'usage a été corrigé d'après la
version de terrain : quatre acteurs (étudiant, responsable, administrateur et développeur),
suppression du secrétariat (ses tâches — affectation d'un encadreur et recherche d'un dossier —
sont rattachées au responsable), gestion du compte étudiant, et administrateur héritant des droits
du responsable. Le diagramme de séquence reproduit la connexion dessinée au tableau blanc.

```bash
curl -L -o plantuml.jar \
  https://repo1.maven.org/maven2/net/sourceforge/plantuml/plantuml/1.2024.7/plantuml-1.2024.7.jar
cd TP3
java -jar ../plantuml.jar -tpng -charset UTF-8 *.puml
```

Les diagrammes structurels (cas d'usage, classes, schéma relationnel) nécessitent Graphviz :
le binaire `dot` doit être installé. Sans lui, PlantUML ne génère que les diagrammes de séquence.
Sous Ubuntu/Debian : `sudo apt install graphviz`.

## Reproduire la base

```bash
mariadb -u root -e "CREATE DATABASE stages CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"

# TP3 : schéma métier et jeu d'essai
mariadb -u root stages < TP3/001_schema.sql
mariadb -u root stages < TP3/002_seed.sql
mariadb -u root -t stages < TP3/003_verification.sql
mariadb -u root --force stages < TP3/004_tests_contraintes.sql

# TP6 : authentification et historique
mariadb -u root stages < TP6/001_schema_tp6.sql
mariadb -u root stages < TP6/002_seed_tp6.sql
mariadb -u root -t stages < TP6/003_verification.sql
```

Pour rejouer après des tests TP6 : `TP6/000_reset_tp6.sql` puis les scripts TP3 et TP6.
Les sorties de référence TP3 sont dans `TP3/sorties/` (MariaDB 11.8.6, base vide).

## État d'avancement

| TP | Livrable | Statut |
|---|---|---|
| TP1 | Fiche de cadrage (2 pages) | Fait |
| TP2 | Exigences (EF, ENF) et matrice de traçabilité | Fait |
| TP3 | Diagrammes UML, schéma SQL, jeu d'essai et rapport | Fait |
| TP4 | Squelette PHP, contrat d'API, route `/api/sante` et ADR-001 | Fait |
| TP5 | Organisation du travail avec Git | Intégré aux TPs suivants |
| TP6 | API des demandes (auth, transitions, transaction, tests HTTP) | Fait |
| TP7 à TP10 | — | À venir |
