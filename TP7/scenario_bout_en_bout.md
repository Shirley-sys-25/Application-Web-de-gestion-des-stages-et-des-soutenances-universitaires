# Scénario de bout en bout — TP7

## Objectif

Démontrer, avec des captures et des résultats HTTP, le parcours complet suivant :

```text
Étudiant : connexion → mes demandes → nouvelle demande → détail
Responsable : connexion → demandes à traiter → décision → confirmation
Étudiant : reconnexion → statut mis à jour
```

Deux décisions sont couvertes : une validation et un refus motivé.

## Environnement du test

| Élément | Valeur |
|---|---|
| Date du test | 19 novembre 2026 |
| Application | `php -S 127.0.0.1:8000 -t public` |
| Navigateur | Google Chrome 156, piloté par Playwright 1.65.1 |
| Base | MariaDB, données fictives du projet |
| Étudiant | `etudiant1@univ.test` / `etudiant123` |
| Responsable | `responsable@univ.test` / `responsable123` |

État initial : base rechargée avec les scripts TP3 + TP6, puis une demande
de démonstration `#5` au statut `SOUMISE` pour `etudiant1` et `Reseau Plus`.

## Scénario A — validation d'une demande

### Étape 1 — Page de connexion

- Action : ouvrir `http://127.0.0.1:8000/`.
- Attendu : formulaire de connexion avec email, mot de passe et bouton
  « Se connecter ».
- Observé : page affichée, aucun message d'erreur JavaScript.
- Capture : [`preuves/captures/01-connexion.png`](preuves/captures/01-connexion.png)

### Étape 2 — Connexion étudiant

- Action : saisir `etudiant1@univ.test` / `etudiant123`, puis cliquer sur
  « Se connecter ».
- Attendu : `POST /api/connexion` répond `200`, redirection vers
  `#/etudiant/demandes`.
- Observé : `200`, redirection effectuée, trois demandes affichées
  (`#5` Soumise, `#4` Refusée, `#1` Brouillon).
- Capture : [`preuves/captures/02-etudiant-liste.png`](preuves/captures/02-etudiant-liste.png)

### Étape 3 — Nouvelle demande

- Action : cliquer sur « Nouvelle demande ».
- Attendu : formulaire avec les informations étudiants en lecture seule, un
  sélecteur d'entreprise alimenté par `GET /api/entreprises`, et la ville
  remplie automatiquement.
- Observé : `GET /api/entreprises` répond `200` ; « Atelier Numerique —
  Cotonou » est sélectionnable ; la ville « Cotonou » est préremplie.
- Capture : [`preuves/captures/03-etudiant-nouvelle-demande.png`](preuves/captures/03-etudiant-nouvelle-demande.png)

### Étape 4 — Soumission

- Action : sélectionner « Atelier Numerique », puis cliquer sur
  « Soumettre ma demande ».
- Attendu : `POST /api/demandes` répond `201`, redirection vers le détail de la
  demande créée, statut `SOUMISE`.
- Observé : demande `#6` créée, redirection vers
  `#/etudiant/demandes/6`, statut « Soumise ».
- Capture : [`preuves/captures/04-etudiant-detail-soumise.png`](preuves/captures/04-etudiant-detail-soumise.png)

### Étape 5 — Connexion responsable

- Action : se déconnecter, puis se connecter avec
  `responsable@univ.test` / `responsable123`.
- Attendu : `POST /api/connexion` répond `200`, redirection vers
  `#/responsable/demandes`.
- Observé : liste des demandes affichée ; la demande `#6` est présente avec le
  bouton « Traiter ».
- Capture : [`preuves/captures/05-responsable-liste.png`](preuves/captures/05-responsable-liste.png)

### Étape 6 — Ouverture de la décision

- Action : cliquer sur « Traiter » pour la demande `#6`.
- Attendu : `GET /api/demandes` répond `200`, écran de décision avec le dossier
  et les options « Valider » / « Refuser la demande ».
- Observé : dossier `#6` affiché, option « Valider » sélectionnée par défaut.
- Capture : [`preuves/captures/06-responsable-decision-validation.png`](preuves/captures/06-responsable-decision-validation.png)

### Étape 7 — Validation

- Action : cliquer sur « Confirmer la validation ».
- Attendu : `PATCH /api/demandes/6/statut` répond `200`, écran de confirmation.
- Observé : confirmation « Demande #6 validée avec succès », date de décision
  enregistrée, aucune erreur JavaScript.
- Capture : [`preuves/captures/07-responsable-confirmation-validation.png`](preuves/captures/07-responsable-confirmation-validation.png)

### Étape 8 — Retour étudiant

- Action : se déconnecter, se reconnecter avec le compte étudiant, ouvrir
  « Mes demandes », puis le détail de la demande `#6`.
- Attendu : `GET /api/demandes/mes-demandes` répond `200` ; la demande `#6`
  apparaît au statut « Validée » ; le détail (`GET /api/demandes/6` depuis le TP8)
  affiche la date de décision.
- Observé : statut « Validée » et date de décision visibles.
- Captures :
  - [`preuves/captures/08-etudiant-liste-validee.png`](preuves/captures/08-etudiant-liste-validee.png)
  - [`preuves/captures/09-etudiant-detail-validee.png`](preuves/captures/09-etudiant-detail-validee.png)

## Scénario B — refus motivé

### Étape 9 — Nouvelle demande à refuser

- Action : depuis le compte étudiant, créer une demande pour « Reseau Plus ».
- Attendu : `POST /api/demandes` répond `201`, demande `#7` au statut
  `SOUMISE`.
- Observé : formulaire rempli, ville « Porto-Novo », demande `#7` créée.
- Capture : [`preuves/captures/10-etudiant-nouvelle-demande-refus.png`](preuves/captures/10-etudiant-nouvelle-demande-refus.png)

### Étape 10 — Saisie du refus

- Action : se connecter en responsable, ouvrir la décision `#7`, sélectionner
  « Refuser la demande », puis saisir le motif
  « Dossier incomplet : convention non signée. ».
- Attendu : le champ motif devient obligatoire et visible ; le bouton devient
  « Confirmer le refus ».
- Observé : champ motif affiché, bouton rouge « Confirmer le refus ».
- Capture : [`preuves/captures/11-responsable-decision-refus.png`](preuves/captures/11-responsable-decision-refus.png)

### Étape 11 — Confirmation du refus

- Action : cliquer sur « Confirmer le refus ».
- Attendu : `PATCH /api/demandes/7/statut` répond `200`, confirmation avec le
  motif enregistré.
- Observé : confirmation « Demande #7 refusée », motif affiché.
- Capture : [`preuves/captures/12-responsable-confirmation-refus.png`](preuves/captures/12-responsable-confirmation-refus.png)

### Étape 12 — Lecture par l'étudiant

- Action : se reconnecter en étudiant, consulter la liste finale puis le détail
  de la demande `#7`.
- Attendu : la demande `#7` est « Refusée » et le motif est visible.
- Observé : statut « Refusée », motif « Dossier incomplet : convention non
  signée. ».
- Captures :
  - [`preuves/captures/13-etudiant-liste-finale.png`](preuves/captures/13-etudiant-liste-finale.png)
  - [`preuves/captures/14-etudiant-detail-refusee.png`](preuves/captures/14-etudiant-detail-refusee.png)

## Résultats HTTP observés

| Requête | Code attendu | Code observé |
|---|---|---|
| `POST /api/connexion` étudiant | `200` | `200` |
| `GET /api/entreprises` étudiant | `200` | `200` |
| `POST /api/demandes` | `201` | `201` |
| `GET /api/demandes/mes-demandes` | `200` | `200` |
| `GET /api/demandes/{id}` (détail, TP8) | `200` | `200` |
| `GET /api/demandes` responsable | `200` | `200` |
| `PATCH /api/demandes/6/statut` validation | `200` | `200` |
| `PATCH /api/demandes/7/statut` refus | `200` | `200` |

Les cas d'erreur sont couverts par `tests/test_api_tp6.sh` et détaillés dans
[`preuves/rapport_tests.md`](preuves/rapport_tests.md).

## Test XSS (annexe)

Un refus a été enregistré avec le motif suivant :

```html
<img src=x onerror="window.__xss=1">
```

À l'affichage du détail étudiant :

- aucun élément `<img src="x">` n'est présent dans le DOM ;
- `window.__xss` reste indéfini ;
- la charge utile est affichée comme texte, pas interprétée comme HTML ;
- aucune erreur JavaScript n'est remontée.

Capture : [`preuves/captures/15-test-xss.png`](preuves/captures/15-test-xss.png)

## Validation des balises HTML

Les 14 pages du parcours ont été rendues dans Chrome, sérialisées en HTML, puis
validées :

- validateur W3C Nu : 14/14 pages, 0 erreur, 0 avertissement ;
- `html-validate` : 14/14 pages, 0 erreur.

Le détail, les commandes et les rapports bruts sont dans
[`preuves/validation_html.md`](preuves/validation_html.md).

## Remarque sur les identifiants

Les identifiants `#5`, `#6` et `#7` sont ceux observés lors de l'exécution. Ils
dépendent de l'auto-incrément de la base ; le scénario reste valable avec les
identifiants réels affichés par l'application.
