# TP8 — Fiche de revue de code

**Date :** 19 novembre 2026  
**Dépôt relu :** application de gestion des stages et des soutenances  
**Relecteur / groupe relecteur :** ______________________ (à compléter lors de l'échange)  
**Auteur des corrections :** groupe ANAGO / DAGNON / KARIMOU

La revue porte sur le code PHP, le frontend, les routes et les tests. Chaque remarque est classée
**acceptée**, **reportée** ou **rejetée**, avec une justification. Les remarques reportées forment
la dette technique consignée dans le [`README.md`](README.md).

## Remarques

| Id | Remarque | Emplacement | Décision | Justification / action |
|---|---|---|---|---|
| R-01 | Les écritures authentifiées ne vérifiaient que le cookie de session : un site tiers pouvait déclencher une création ou une décision à l'insu de l'utilisateur. | `public/index.php`, `public/app.js` | **Acceptée** | Ajout d'un jeton synchronisé en session, route `GET /api/csrf`, en-tête `X-CSRF-Token` et comparaison avec `hash_equals()`. Tests T-08 à T-10. |
| R-02 | Le frontend affichait le détail d'une demande en filtrant `GET /api/demandes/mes-demandes` : aucun `GET /api/demandes/{id}` ne permettait de tester directement le contrôle de propriété. | `public/app.js`, `src/Controllers/DemandeController.php` | **Acceptée** | Ajout de `GET /api/demandes/{id}` avec `403` sans donnée pour le dossier d'un autre étudiant. Le frontend utilise cette route. Tests T-05 et T-18. |
| R-03 | La date de soutenance n'était validée nulle part au niveau HTTP : le cas `2026-02-30` ne pouvait pas produire un `400`. | `src/Services/`, `src/Repositories/`, `public/index.php` | **Acceptée** | Ajout de `POST /api/soutenances` et de `SoutenanceService::validerDate()`. La date est vérifiée avant l'accès à la base. Tests T-04, T-15 et T-16. |
| R-04 | Le motif de refus est mesuré avec `strlen()` (octets) alors que la colonne SQL est en caractères (`VARCHAR(255)`). | `src/Services/DemandeService.php` | **Reportée** | L'extension `mbstring` n'est pas installée sur le poste de test. La limite en octets est plus stricte et ne crée pas de faille ; elle pénalise seulement les accents. Dette : utiliser `mb_strlen()` ou `grapheme_strlen()` sur un environnement disposant de l'extension. |
| R-05 | Aucune limitation du nombre de tentatives de connexion : l'exigence ENF-05 (verrouillage après 5 échecs) n'est pas implémentée. | `src/Services/AuthService.php` | **Reportée** | ENF-05 est une exigence Should, hors du socle Must du TP8. Elle demande un compteur persistant et une durée de verrouillage. Dette technique consignée. |
| R-06 | Deux boutons de déconnexion coexistent dans la coquille (barre latérale et barre supérieure). | `public/app.js` | **Rejetée** | Les deux boutons appartiennent à deux zones responsive différentes, portent le même libellé accessible et déclenchent la même action. Ce n'est pas une duplication de logique métier ; en supprimer un dégraderait l'accès sur mobile. |

## Dette technique retenue

1. **R-04** — mesure des caractères avec `strlen()` : à corriger avec `mb_strlen()` quand
   `mbstring` est disponible.
2. **R-05** — verrouillage des tentatives de connexion (ENF-05) : à planifier avec un compteur
   en base et une fenêtre de 15 minutes.
3. **Hors revue** — l'affectation d'un encadreur (EF-04) et l'écran de programmation de soutenance
   restent à livrer ; la route API de soutenance est testée, mais n'a pas encore d'interface.

## Points vérifiés sans remarque

- Toutes les requêtes SQL des dépôts utilisent des paramètres nommés ; le test
  `q=1 OR 1=1` renvoie une liste vide (T-07).
- Les mots de passe sont stockés en bcrypt `$2y$12$` et vérifiés avec `password_verify()`
  (T-11, [`preuves/mots_de_passe.txt`](preuves/mots_de_passe.txt)).
- Les réponses d'erreur ne contiennent ni trace SQL ni donnée du dossier refusé.
- Le cookie de session est `HttpOnly`, `SameSite=Lax`, et `Secure` lorsque HTTPS est actif.

## Signature

| Rôle | Nom | Date | Signature |
|---|---|---|---|
| Groupe relecteur | | | |
| Groupe auteur | ANAGO Shirley, DAGNON Christie, KARIMOU NARO Sabalimath | 19/11/2026 | |
