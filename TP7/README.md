# TP7 — Pages Web, preuves et scénario de bout en bout

Ce dossier ne contient pas le code de l'application : il contient les maquettes,
le scénario de test et les preuves demandées par le TP.

## Où est le code ?

| Élément | Chemin |
|---|---|
| Coquille HTML servie sur `GET /` | `public/index.html` |
| Styles (glassmorphism, responsive, accessibilité) | `public/style.css` |
| Application frontend (routes, formulaires, appels API) | `public/app.js` |
| Point d'entrée HTTP et routeur API | `public/index.php` |
| Backend PHP (contrôleurs, services, dépôts) | `src/` |
| Maquettes (images uniquement) | `TP7/maquettes/` |
| Scénario de bout en bout | `TP7/scenario_bout_en_bout.md` |
| Preuves et captures | `TP7/preuves/` |

Le code est volontairement resté dans `public/` et `src/`, pas dans `TP7/` :
`TP7/maquettes/` doit rester un dossier d'images, conformément à la consigne.

## Lancer l'application en local

Depuis la racine du dépôt :

```bash
php -S 127.0.0.1:8000 -t public
```

Puis ouvrir :

```text
http://127.0.0.1:8000/
```

La base MariaDB doit être chargée avec les scripts du projet (TP3 + TP6) et le
fichier `.env` doit contenir les paramètres de connexion. La procédure complète
est décrite dans le `README.md` à la racine du dépôt.

### Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Étudiant | `etudiant1@univ.test` | `etudiant123` |
| Responsable pédagogique | `responsable@univ.test` | `responsable123` |
| Administrateur (hors parcours TP7) | `admin@univ.test` | `admin123` |

## Parcours couverts

### Étudiant

1. Connexion.
2. Consultation de « Mes demandes ».
3. Création d'une nouvelle demande.
4. Consultation du détail et du statut d'une demande.

### Responsable pédagogique

1. Connexion.
2. Consultation des demandes à traiter.
3. Ouverture d'un dossier.
4. Validation ou refus motivé.
5. Écran de confirmation de la décision.

## Correspondance écrans / API

| Écran | Requête |
|---|---|
| Connexion | `POST /api/connexion` |
| Mes demandes (étudiant) | `GET /api/demandes/mes-demandes` |
| Nouvelle demande — entreprises | `GET /api/entreprises` |
| Nouvelle demande — envoi | `POST /api/demandes` |
| Détail étudiant | `GET /api/demandes/{id}` (route ajoutée au TP8 ; le TP7 filtrait la liste) |
| Demandes à traiter (responsable) | `GET /api/demandes` |
| Décision | `PATCH /api/demandes/{id}/statut` |

## Preuves fournies

| Preuve | Fichier |
|---|---|
| Scénario pas à pas, résultats attendus et observés | `scenario_bout_en_bout.md` |
| Captures des écrans du parcours | `preuves/captures/` |
| Rapport de tests (statique, API, E2E, XSS) | `preuves/rapport_tests.md` |
| Validation des balises HTML | `preuves/validation_html.md` |
| DOM rendu utilisé pour la validation | `preuves/html/` |
| Rapports bruts W3C Nu | `preuves/w3c/` |
| Sortie des tests HTTP | `preuves/api_tp7.txt` |

## Points de contrôle

- 14 pages rendues validées par le validateur W3C Nu : 0 erreur, 0 avertissement.
- 14 pages rendues validées par `html-validate` : 0 erreur.
- Tests HTTP TP6 + TP7 : tous les cas passent (`200`, `201`, `400`, `401`, `403`,
  `404`, `409`).
- Parcours navigateur : aucune erreur JavaScript.
- Test XSS : la charge utile est affichée comme texte, aucun élément injecté.
- Une seule action primaire par zone, formulaires étiquetés, messages d'erreur
  lisibles et focus clavier géré.

## Remarque technique

L'application reste un monolithe PHP 8 sans framework, sans Composer et sans npm.
Playwright, Chrome, `html-validate` et le validateur W3C Nu ont uniquement servi
à produire les preuves de test ; ils ne sont pas des dépendances de l'application.
