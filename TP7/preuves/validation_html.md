# Validation des balises HTML — TP7

## Méthode

Les pages de l'application sont rendues par JavaScript. Pour valider le HTML
réellement produit, les 14 états du parcours ont été ouverts dans Chrome, puis
sérialisés avec le DOM courant :

```text
TP7/preuves/html/01-connexion.html
...
TP7/preuves/html/14-etudiant-detail-refusee.html
```

Deux validateurs ont été utilisés :

1. **Validateur W3C Nu** (`https://validator.w3.org/nu/?out=json`), sur chaque
   fichier HTML rendu.
2. **html-validate 11.21.1**, avec la configuration
   [`htmlvalidate.json`](htmlvalidate.json).

## Commande W3C Nu

Exemple pour une page :

```bash
curl -sS \
  -H 'Content-Type: text/html; charset=utf-8' \
  --data-binary @TP7/preuves/html/01-connexion.html \
  'https://validator.w3.org/nu/?out=json'
```

Les réponses brutes sont dans [`w3c/`](w3c/).

## Commande html-validate

```bash
npx --yes html-validate \
  --config TP7/preuves/htmlvalidate.json \
  TP7/preuves/html/*.html
```

La configuration désactive uniquement deux règles de style de sérialisation
(`attribute-boolean-style`, `attribute-empty-style`) : le navigateur écrit par
exemple `required=""` ou `hidden=""`, ce qui reste du HTML valide. Aucune règle
de structure, de contenu ou d'accessibilité n'est désactivée.

## Résultats

| Page rendue | W3C Nu | html-validate |
|---|---|---|
| `01-connexion.html` | 0 erreur, 0 avertissement | 0 erreur |
| `02-etudiant-liste.html` | 0 erreur, 0 avertissement | 0 erreur |
| `03-etudiant-nouvelle-demande.html` | 0 erreur, 0 avertissement | 0 erreur |
| `04-etudiant-detail-soumise.html` | 0 erreur, 0 avertissement | 0 erreur |
| `05-responsable-liste.html` | 0 erreur, 0 avertissement | 0 erreur |
| `06-responsable-decision-validation.html` | 0 erreur, 0 avertissement | 0 erreur |
| `07-responsable-confirmation-validation.html` | 0 erreur, 0 avertissement | 0 erreur |
| `08-etudiant-liste-validee.html` | 0 erreur, 0 avertissement | 0 erreur |
| `09-etudiant-detail-validee.html` | 0 erreur, 0 avertissement | 0 erreur |
| `10-etudiant-nouvelle-demande-refus.html` | 0 erreur, 0 avertissement | 0 erreur |
| `11-responsable-decision-refus.html` | 0 erreur, 0 avertissement | 0 erreur |
| `12-responsable-confirmation-refus.html` | 0 erreur, 0 avertissement | 0 erreur |
| `13-etudiant-liste-finale.html` | 0 erreur, 0 avertissement | 0 erreur |
| `14-etudiant-detail-refusee.html` | 0 erreur, 0 avertissement | 0 erreur |

**Bilan : 14/14 pages valides, 0 erreur HTML.**

## Balises et attributs contrôlés

| Famille | Éléments présents |
|---|---|
| Structure du document | `html`, `head`, `body`, `header`, `nav`, `main`, `aside`, `section` |
| Titres et texte | `h1`, `h2`, `p`, `strong`, `span`, `ul`, `li` |
| Formulaires | `form`, `label`, `input`, `select`, `option`, `textarea`, `fieldset`, `legend`, `button` |
| Tableaux | `table`, `caption`, `thead`, `tbody`, `tr`, `th`, `td` |
| Navigation | `a`, `nav`, `aria-current="page"` |
| Accessibilité | `for`, `id`, `name`, `type`, `required`, `aria-labelledby`, `aria-describedby`, `aria-live`, `aria-hidden`, `role="alert"`, `role="status"` |
| Tableaux de données | `scope="col"`, `caption` en `sr-only` |

## Points d'accessibilité vérifiés

- Chaque champ possède un `label` associé par `for` / `id`.
- Les icônes SVG décoratives sont en `aria-hidden="true"` et `focusable="false"`.
- Les liens de navigation ont un état `aria-current="page"`.
- Les zones de message utilisent `role="alert"` ou `role="status"`.
- Un lien d'évitement « Aller au contenu principal » est présent.
- Le focus est déplacé sur le titre ou le contenu principal après navigation.
- Le statut n'est pas indiqué uniquement par la couleur : un libellé texte est
  toujours présent.
- Les tableaux ont une légende `caption` et des en-têtes `th` avec `scope`.

## Absence de constructions non conformes

- Pas de balises obsolètes (`center`, `font`, `marquee`, etc.).
- Pas d'attribut `style` inline dans le code applicatif.
- Pas de gestionnaire `onclick` inline : les écouteurs sont ajoutés en JavaScript.
- Pas de HTML injecté via `innerHTML` pour les données serveur : le rendu utilise
  `textContent`.
- Pas de formulaire sans `label` ni de tableau sans en-tête.

## Remarque sur les captures

Lors d'une capture Playwright, Chrome ajoute parfois des attributs `style=""`
vides sur les champs. Ces attributs ont été retirés avant la sérialisation pour
valider le DOM produit par l'application, et non un artefact de l'outil de
capture.
