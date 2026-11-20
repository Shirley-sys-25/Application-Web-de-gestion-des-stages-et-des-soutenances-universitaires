# TP8 — Fiche de recette utilisateur

**Date :** 19 novembre 2026  
**Application :** UniStage — gestion des stages et des soutenances  
**Environnement :** serveur local `php -S 127.0.0.1:8010 -t public`, base `stages` rechargée  
**Rôle client :** encadreur (à signer en fin de fiche)

La recette confronte l'application aux cinq scénarios du chapitre 8. Les scénarios 1 à 4 sont
exécutés sur l'interface ou l'API ; le scénario 5 est exécuté côté API pour prouver que le contrôle
est serveur et non un simple masquage visuel. La programmation de soutenance dispose d'une route
API testée, mais pas encore d'écran dédié.

| # | Scénario | Résultat attendu | Résultat observé | Statut |
|---|---|---|---|---|
| 1 | Se connecter avec `etudiant1@univ.test` / `etudiant123` | Session ouverte, redirection vers « Mes demandes », nom ADJOVI affiché | Connexion `200`, redirection vers `#/etudiant/demandes`, espace étudiant affiché | Conforme |
| 2 | Déposer une demande pour l'entreprise 1 | Demande créée en `SOUMISE`, accusé de réception, aucune donnée d'un autre étudiant | `POST /api/demandes` -> `201`, statut `SOUMISE` ; test T-10 | Conforme (API) |
| 3 | Valider la demande créée en tant que responsable | Statut `VALIDEE`, décision et historique enregistrés | `PATCH /api/demandes/{id}/statut` -> `200`, statut `VALIDEE` ; test EF-05 | Conforme (API) |
| 4 | Programmer la soutenance de la demande validée | `201`, date, salle et durée enregistrées ; deuxième programmation refusée | `POST /api/soutenances` -> `201` ; deuxième essai -> `409` ; tests T-15/T-16 | Conforme (API, écran à venir) |
| 5 | Accès interdit : l'étudiant B demande le dossier de l'étudiant A | `403` sans aucune donnée du dossier | `GET /api/demandes/4` avec le compte B -> `403`, corps sans `ADJOVI` ; test T-05 et capture d'interface | Conforme (API + interface) |

## Détail des preuves

- Scénario 1 : test navigateur du 19/11/2026, connexion puis ouverture de `#/etudiant/demandes`.
- Scénarios 2 à 5 : sortie [`preuves/tests_tp8.txt`](preuves/tests_tp8.txt).
- Scénario 5 côté interface : [`preuves/etudiant-b-acces-interdit.png`](preuves/etudiant-b-acces-interdit.png).
- Mots de passe : [`preuves/mots_de_passe.txt`](preuves/mots_de_passe.txt).

## Écarts et réserves

- L'écran de programmation de soutenance n'est pas encore livré ; la recette du scénario 4 est
  donc une recette API, pas une recette d'interface.
- La signature de l'encadreur atteste la recette ; elle ne peut être apposée que lors de la
  démonstration réelle.

## Procès-verbal

| Partie | Nom | Date | Signature |
|---|---|---|---|
| Encadreur (client) | | | |
| Groupe projet | ANAGO Shirley, DAGNON Christie, KARIMOU NARO Sabalimath | 19/11/2026 | |
