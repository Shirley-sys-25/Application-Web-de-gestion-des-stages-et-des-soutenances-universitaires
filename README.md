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

## Branches

`main` reste toujours exécutable. Le travail se fait sur des branches courtes
(`tp1`, `tp2`, …) fusionnées après relecture du diff.

| Branche | Contenu |
|---|---|
| `main` | Squelette du dépôt : `README.md`, `.gitignore`, `.gitattributes` |
| `tp1` | Fiche de cadrage du projet |
| `tp2` | Exigences fonctionnelles et non fonctionnelles, matrice de traçabilité |
| `tp3` | Modèle UML, scripts SQL, jeu d'essai vérifié et rapport |

## Périmètre retenu (v1)

**Inclus** : authentification et rôles, dépôt d'une demande de stage, validation ou refus motivé,
affectation d'un encadreur, consultation de l'état des demandes, programmation des soutenances,
journal des décisions.

**Exclus** (reportés en v2) : paiement en ligne, notifications SMS, portail entreprise,
convention signée électroniquement, messagerie interne.

## Diagrammes : sources PlantUML

Les diagrammes sont du texte compilé, pas des dessins à la souris. Chaque diagramme existe en
`.puml` (versionné) et en `.png` (produit). Le jar officiel n'est pas versionné.

Le TP3 contient cinq diagrammes : cas d'usage, classes, schéma relationnel, séquence et activité
du scénario « Valider une demande ».

```bash
curl -L -o plantuml.jar \
  https://repo1.maven.org/maven2/net/sourceforge/plantuml/plantuml/1.2024.7/plantuml-1.2024.7.jar
cd TP3
java -jar ../plantuml.jar -tpng -charset UTF-8 *.puml
```

## Reproduire la base

```bash
mariadb -u root -e "CREATE DATABASE stages CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
mariadb -u root stages < TP3/001_schema.sql
mariadb -u root stages < TP3/002_seed.sql
mariadb -u root -t stages < TP3/003_verification.sql
mariadb -u root --force stages < TP3/004_tests_contraintes.sql
```

Les sorties de référence sont dans `TP3/sorties/` (MariaDB 11.8.6, base vide).

## État d'avancement

| TP | Livrable | Statut |
|---|---|---|
| TP1 | Fiche de cadrage (2 pages) | Fait |
| TP2 | Exigences (EF, ENF) et matrice de traçabilité | Fait |
| TP3 | Diagrammes UML, schéma SQL, jeu d'essai et rapport | Fait |
| TP4 à TP10 | — | À venir |
