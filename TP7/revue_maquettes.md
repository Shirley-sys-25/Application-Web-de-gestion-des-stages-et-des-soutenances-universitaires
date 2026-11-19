# TP7 — Revue des maquettes

## 1. État des exports

Les 7 écrans sont maintenant disponibles en PNG dans `TP7/maquettes/` :

| # | Écran | Fichier |
|---|---|---|
| 1 | Connexion | `1._connexion_unistage_restructur_e/screen.png` |
| 2 | Étudiant — Mes demandes | `2._tudiant_mes_demandes/screen.png` |
| 3 | Étudiant — Nouvelle demande | `3._tudiant_nouvelle_demande/screen.png` |
| 4 | Étudiant — Détail d'une demande | `4._tudiant_d_tail_d_une_demande/screen.png` |
| 5 | Responsable — Demandes à traiter | `5._responsable_demandes_traiter/screen.png` |
| 6 | Responsable — Décision | `6._responsable_d_cision/screen.png` |
| 7 | Responsable — Confirmation | `7._responsable_confirmation/screen.png` |

Aperçu global : `TP7/maquettes/apercu_7_ecrans.png`.

## 2. Points forts

- Direction visuelle cohérente : indigo, corail, menthe, fond clair, cartes arrondies.
- Glassmorphisme présent et lisible sur les cartes, la sidebar et les panneaux.
- Bonne hiérarchie globale : sidebar, top bar, contenu, actions.
- Les badges de statut sont visibles et différenciés.
- Le parcours étudiant est clair : liste → dépôt → détail.
- Le parcours responsable est clair : liste → décision → confirmation.
- La page de décision distingue bien validation et refus avec motif.
- La page de confirmation résume correctement la décision.

## 3. Corrections déjà appliquées

- Logo cassé remplacé par un logo texte `US`.
- Menu étudiant nettoyé : suppression de « Demandes à traiter ».
- Menu responsable harmonisé : Tableau de bord, Demandes à traiter, Toutes les demandes.
- « Secrétariat » remplacé par « Responsable pédagogique » (conforme au TP3).
- Page décision : « Valider » sélectionné par défaut ; le motif n'apparaît qu'en mode refus.
- Bouton « Rapport de cohorte » passé en secondaire pour laisser « Traiter » comme action primaire.
- Textes de rôle corrigés sur la page décision (plus de « Étudiant SIL » dans l'espace responsable).

## 4. Corrections restantes avant le code TP7

### 4.1 Aligner le formulaire avec l'API

Le formulaire « Nouvelle demande » affiche :

- date de début ;
- date de fin ;
- intitulé du sujet / missions.

Or `POST /api/demandes` n'accepte aujourd'hui que `entreprise_id`. Deux choix :

1. **Recommandé pour le TP7** : simplifier le formulaire pour ne garder que le select « Entreprise d'accueil », la ville en lecture seule et le bouton « Soumettre ma demande ».
2. Ou étendre l'API et la base pour accepter ces champs (hors périmètre TP7, à faire plus tard).

### 4.2 Simplifier la page détail

La page détail montre :

- téléchargement PDF ;
- carte géographique ;
- pièces justificatives ;
- historique détaillé ;
- bloc assistance.

Ces éléments ne sont pas exposés par l'API actuelle. Pour le TP7, garder uniquement :

- étudiant ;
- entreprise + ville ;
- encadreur éventuel ;
- statut ;
- motif de refus ;
- date de dépôt ;
- date de décision ;
- bouton « Retour à mes demandes ».

### 4.3 Retirer ou désactiver les actions non supportées

- `Exporter la liste (.csv)` : aucun endpoint.
- `Rapport de cohorte` : aucun endpoint.
- `Convention PDF` : aucun endpoint.
- `Télécharger récapitulatif PDF` : aucun endpoint.
- `Voir la fiche` peut rester si elle pointe vers le détail.
- `Voir motif` peut rester si le motif est affiché dans la liste.

Les garder en maquette est acceptable, mais il faut les marquer « à venir » ou les retirer avant l'intégration.

### 4.4 Page décision

- Le bandeau « La décision sera enregistrée… » est rouge même en mode validation. Le passer en ambre/neutre en validation, rouge uniquement en refus.
- Prévoir une capture séparée de l'état « Refuser » avec le motif obligatoire et le message d'erreur.
- Le bouton final doit changer de libellé :
  - « Confirmer la validation » ;
  - « Confirmer le refus ».

### 4.5 Connexion

- L'état d'erreur « Email ou mot de passe incorrect » est affiché en permanence.
- Pour l'écran principal, montrer l'état normal ; garder l'erreur comme état secondaire dans une capture séparée.
- Les comptes de démonstration sont utiles pour la soutenance, mais à retirer ou masquer en production.

### 4.6 Responsive

- Les écrans sont bons en 1600 px.
- Vérifier 1280 px et 390 px.
- Sur mobile, les tableaux doivent devenir des cartes empilées.
- La sidebar doit se replier en menu ou bottom nav.

### 4.7 Détails de cohérence

- Uniformiser l'écriture des statuts : « Soumise », « Validée », « Refusée », « Brouillon » dans l'interface (l'API peut rester en majuscules).
- Vérifier que chaque écran a un seul bouton primaire.
- Vérifier les libellés des boutons de ligne : `Voir`, `Reprendre`, `Traiter`.
- Vérifier que les zones cliquables font au moins 44 px.

## 5. Prochaine étape

1. Valider les 7 maquettes corrigées.
2. Choisir : simplifier le formulaire ou étendre l'API.
3. Coder le frontend TP7 :
   - formulaires accessibles ;
   - appels `fetch` ;
   - affichage sécurisé avec `textContent` ;
   - gestion des erreurs `400/401/403/404/409` ;
   - parcours de bout en bout.
