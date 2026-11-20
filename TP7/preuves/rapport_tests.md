# Rapport de tests — TP7

## Synthèse

| Vérification | Résultat |
|---|---|
| Syntaxe JavaScript (`node --check`) | OK |
| Syntaxe PHP (`php -l`, 19 fichiers) | OK |
| Syntaxe des scripts de test (`bash -n`, TP6 et TP8) | OK |
| Tests HTTP TP6 + TP7 (`tests/test_api_tp6.sh`) | 12/12 cas OK |
| Parcours navigateur de bout en bout | OK, aucune erreur JavaScript |
| Validation W3C Nu (14 pages rendues) | 14/14, 0 erreur, 0 avertissement |
| Validation `html-validate` (14 pages) | 14/14, 0 erreur |
| Test XSS dans un motif de refus | OK, charge utile affichée en texte |

Date d'exécution initiale : **19 novembre 2026**. Les contrôles statiques et la sortie API ont
été rejoués le **20 novembre 2026** après l'ajout du CSRF du TP8 ; les captures et snapshots HTML
restent ceux du parcours initial.

## Environnement

| Élément | Version / valeur |
|---|---|
| PHP CLI | 8.5.4 |
| Navigateur | Google Chrome 156.0.8078.73 |
| Playwright | 1.65.1 |
| html-validate | 11.21.1 |
| Validateur W3C Nu | 26.11.19 |
| Serveur applicatif | `php -S 127.0.0.1:8000 -t public` |
| Base | MariaDB locale, données fictives |

## 1. Vérifications statiques

Commandes exécutées :

```bash
node --check public/app.js
find src public -name '*.php' -print0 | sort -z | xargs -0 -n1 php -l
bash -n tests/test_api_tp6.sh
bash -n tests/test_api_tp8.sh
```

Résultat complet : [`verifications_statiques.txt`](verifications_statiques.txt).

Extrait :

```text
node --check public/app.js
OK

No syntax errors detected in public/index.php
No syntax errors detected in src/Container.php
...
No syntax errors detected in src/Services/SoutenanceService.php

bash -n tests/test_api_tp6.sh
OK

bash -n tests/test_api_tp8.sh
OK
```

## 2. Tests HTTP de l'API

Commande :

```bash
./tests/test_api_tp6.sh
```

Sortie complète : [`api_tp7.txt`](api_tp7.txt).

Cas couverts :

```text
[OK] Connexion étudiant -> HTTP 200
[OK] GET /api/entreprises en tant qu’étudiant -> HTTP 200
[OK] GET /api/entreprises sans session -> HTTP 401
[OK] POST /api/demandes (entreprise 1) -> HTTP 201
[OK] POST /api/demandes (entreprise 999) -> HTTP 400
[OK] POST /api/demandes sans cookie -> HTTP 401
[OK] GET /api/demandes en tant qu’étudiant -> HTTP 403
[OK] Connexion responsable -> HTTP 200
[OK] GET /api/entreprises en tant que responsable -> HTTP 403
[OK] PATCH /api/demandes/999/statut -> HTTP 404
[OK] PATCH /api/demandes/{id}/statut -> HTTP 200
[OK] PATCH /api/demandes/{id}/statut (répétition) -> HTTP 409
Tous les cas HTTP des TP6 et TP7 sont conformes.
```

Cela couvre les codes `200`, `201`, `400`, `401`, `403`, `404` et `409`, ainsi
que les contrôles de rôle et de transition de statut. Depuis le TP8, le script
récupère aussi le jeton CSRF avant la connexion et l'envoie sur chaque écriture.

## 3. Parcours navigateur de bout en bout

Le scénario détaillé, les actions et les résultats attendus sont dans
[`../scenario_bout_en_bout.md`](../scenario_bout_en_bout.md).

Résultats observés :

| Étape | Résultat |
|---|---|
| Connexion étudiant | `200`, redirection vers « Mes demandes » |
| Liste initiale | 3 demandes affichées |
| Création demande #6 | `201`, détail au statut `SOUMISE` |
| Connexion responsable | `200`, liste des demandes |
| Validation #6 | `200`, écran de confirmation |
| Étudiant — liste après validation | #6 au statut `VALIDEE` |
| Création demande #7 | `201`, détail au statut `SOUMISE` |
| Refus motivé #7 | `200`, confirmation avec motif |
| Étudiant — détail après refus | #7 au statut `REFUSEE`, motif visible |

Captures : [`captures/`](captures/).

Aucune erreur JavaScript n'a été remontée pendant le parcours
(`pageErrors: []`).

## 4. Validation des balises HTML

Les 14 pages rendues ont été sérialisées puis validées avec le validateur W3C Nu
et `html-validate`. Résultat : **0 erreur sur les 14 pages**.

Détail des commandes, tableau par page et rapports bruts :
[`validation_html.md`](validation_html.md).

Points vérifiés :

- structure HTML5 (`header`, `nav`, `main`, `aside`, `section`) ;
- formulaires étiquetés (`label` + `for`/`id`) ;
- tableaux avec `caption`, `thead`, `th` et `scope` ;
- attributs ARIA valides (`aria-labelledby`, `aria-describedby`, `aria-live`,
  `role="alert"`, `role="status"`) ;
- absence de balises obsolètes et de style inline dans le code applicatif.

## 5. Test XSS

Scénario :

1. Une demande `#9` est créée par l'étudiant.
2. Le responsable la refuse avec le motif :

   ```html
   <img src=x onerror="window.__xss=1">
   ```

3. L'étudiant ouvre le détail de la demande.

Résultat dans le navigateur :

```json
{
  "injectedImg": false,
  "payloadAsText": true,
  "pageErrors": []
}
```

`window.__xss` reste indéfini. La charge utile apparaît comme du texte dans le
motif, et aucun élément HTML n'est injecté.

Capture : [`captures/15-test-xss.png`](captures/15-test-xss.png).

## 6. Reproductibilité

Depuis la racine du dépôt :

```bash
# 1. Recharger la base de démonstration
for f in TP6/000_reset_tp6.sql TP3/001_schema.sql TP3/002_seed.sql \
         TP6/001_schema_tp6.sql TP6/002_seed_tp6.sql; do
  mysql --socket=/run/mysqld/mysqld.sock -u stages -pmotdepasse stages < "$f"
done

# 2. Lancer l'application
php -S 127.0.0.1:8000 -t public

# 3. Dans un autre terminal : tests HTTP
./tests/test_api_tp6.sh

# 4. Parcours navigateur
#    Recharger la base, puis recréer la demande de démonstration #5
#    (Reseau Plus, compte etudiant1) via le formulaire ou POST /api/demandes.
#    Suivre ensuite les étapes de TP7/scenario_bout_en_bout.md
```

Les captures et les snapshots HTML fournis correspondent à l'exécution du
19 novembre 2026. Les identifiants `#6`, `#7`, `#8` et `#9` dépendent de
l'auto-incrément de la base ; les assertions du script HTTP lisent l'identifiant
retourné par l'API et ne le codent pas en dur.

## Conclusion

Le parcours étudiant et le parcours responsable sont fonctionnels, les réponses
HTTP sont conformes, le HTML rendu est valide et le rendu des données serveur est
protégé contre l'injection HTML. Les preuves sont regroupées dans
[`captures/`](captures/), [`html/`](html/) et [`w3c/`](w3c/).
