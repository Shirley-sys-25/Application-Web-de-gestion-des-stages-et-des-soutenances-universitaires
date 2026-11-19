# TP7 — Prompt de correction glassmorphism

## Contexte

Le lien Stitch fourni n'est pas accessible sans session Google / partage public :
Stitch affiche « This page doesn't exist or isn't shared with you. »

Pour une revue écran par écran, exporter les 7 PNG dans `TP7/maquettes/`.
En attendant, ce prompt permet de faire une passe de correction cohérente sur la maquette existante.

## Prompt de correction à coller dans Stitch

```text
Rôle : Tu es un designer UI senior. Applique une passe de correction UI/UX à la maquette existante « UniStage » (7 écrans). Conserve la structure, les contenus, les données fictives et la navigation. Ne change pas le parcours.

OBJECTIF : passer d'une maquette correcte à une maquette cohérente, lisible et professionnelle, avec un glassmorphisme léger et maîtrisé.

1. GLASSMORPHISME
- Fond global : dégradé très clair #EEF2FF -> #FDF2F8 -> #ECFDF5, avec 3 grandes formes floues (indigo #4F46E5, corail #FF6B6B, menthe #10B981) en arrière-plan.
- Surfaces en verre : sidebar, top bar, cartes de statistiques, cartes de formulaire, panneaux de décision et modales. Utiliser rgba(255,255,255,0.55-0.70), backdrop-filter blur(18-24px), bordure 1px rgba(255,255,255,0.70), ombre douce 0 20px 50px rgba(15,23,42,0.10).
- Les tableaux, les champs de formulaire et les zones de texte longs restent sur fond blanc opaque pour la lisibilité.
- Les boutons primaires restent pleins (indigo #4F46E5) ; ne pas les rendre transparents.
- Éviter le glassmorphisme sur les champs de saisie : fond blanc, bordure nette, focus visible.
- Fallback : si le blur n'est pas supporté, fond blanc à 92 %.
- Contraste AA obligatoire, pas de texte blanc sur verre clair.

2. STRUCTURE DES PAGES
- Conserver la sidebar 260 px, la top bar 72 px et la grille 12 colonnes sur les 7 écrans.
- Marquer clairement l'élément de navigation actif (fond indigo translucide + texte indigo).
- Garder un seul titre principal par écran et un fil d'Ariane discret.
- Les cartes de statistiques doivent avoir la même hauteur, le même rayon et la même hiérarchie typographique.
- Les tableaux doivent rester lisibles : en-têtes gris clair, lignes aérées, badges de statut alignés, actions à droite.
- Sur mobile, transformer les tableaux en cartes empilées.

3. BOUTONS ET HIÉRARCHIE
- Un seul bouton primaire par zone : « Se connecter », « + Nouvelle demande », « Soumettre ma demande », « Traiter », « Confirmer la décision », « Retour aux demandes à traiter ».
- Boutons secondaires : contour indigo sur fond transparent/verre.
- Actions de ligne : style ghost/texte (« Voir », « Reprendre », « Traiter »), pas de gros boutons primaires dans chaque ligne.
- Ne pas afficher deux boutons primaires concurrents « Valider » et « Refuser ». Utiliser un segmented control Valider/Refuser, puis un seul bouton « Confirmer la décision ».
- Le bouton de refus devient rouge uniquement quand l'option « Refuser » est sélectionnée.
- Tous les boutons : hauteur 44-48 px, rayon 12 px, padding 16-24 px, libellé explicite, icône optionnelle, focus visible 2 px.
- Prévoir les états hover, focus, disabled et loading.
- Pas de bouton icône seule sans aria-label.

4. ÉCRAN 1 — CONNEXION
- Garder le split screen, mais poser la carte de connexion sur un panneau en verre.
- Un seul CTA primaire « Se connecter ».
- Message d'erreur sous les champs, avec role="alert".
- Encadré « Comptes de démonstration » discret, en verre, sans concurrencer le formulaire.

5. ÉCRAN 2 — ÉTUDIANT, MES DEMANDES
- Sidebar en verre, top bar en verre, cartes stats en verre.
- Un seul bouton primaire « + Nouvelle demande » en haut à droite du contenu.
- Recherche et filtre en contrôles secondaires.
- Tableau sur fond blanc opaque.
- Badges : Brouillon gris, Soumise bleu, Validée vert, Refusée rouge.
- Actions de ligne en ghost : « Voir », « Reprendre ».

6. ÉCRAN 3 — ÉTUDIANT, NOUVELLE DEMANDE
- Carte formulaire en verre, mais champs sur fond blanc.
- Un seul bouton primaire « Soumettre ma demande », un bouton secondaire « Annuler ».
- Erreur sous le select, avec role="alert".
- Encadré « Ce qui se passe ensuite » en verre, avec 3 étapes.

7. ÉCRAN 4 — ÉTUDIANT, DÉTAIL
- Carte résumé en verre, timeline lisible sur fond blanc.
- Un seul bouton secondaire « Retour à mes demandes ».
- Ne pas ajouter d'action « Modifier » ou « Soumettre à nouveau » si l'API ne la permet pas.
- Pour une demande refusée : encart rouge clair avec motif et date de décision.

8. ÉCRAN 5 — RESPONSABLE, DEMANDES À TRAITER
- Cartes stats en verre, tableau blanc.
- Un seul bouton primaire par ligne : « Traiter ».
- Filtres en chips/secondaires, pas en gros boutons.
- État vide illustré « Aucune demande à traiter ».

9. ÉCRAN 6 — RESPONSABLE, DÉCISION
- Colonne gauche : dossier en verre. Colonne droite : carte décision en verre.
- Segmented control Valider/Refuser, puis un seul bouton primaire « Confirmer la décision ».
- Textarea « Motif du refus » sur fond blanc, obligatoire, compteur 0/255, erreur avec role="alert".
- Encart d'avertissement « La décision sera enregistrée dans l'historique. »

10. ÉCRAN 7 — RESPONSABLE, CONFIRMATION
- Carte centrale en verre avec icône de succès menthe.
- Un seul bouton primaire « Retour aux demandes à traiter », un bouton secondaire « Voir la demande ».
- Toast discret « Décision enregistrée avec succès. »

11. COHÉRENCE ET ACCESSIBILITÉ
- Même sidebar, même top bar, mêmes espacements, mêmes badges et mêmes rayons sur les 7 écrans.
- Labels liés aux champs (for/id), types adaptés, focus visibles, contrastes AA.
- Statut jamais indiqué uniquement par la couleur.
- Zones cliquables >= 44 px.
- Interface 100 % en français, données fictives uniquement.
- Pas de lorem ipsum, pas de logo d'université réel.
- Livrer les 7 écrans corrigés, prêts à exporter en PNG.
```

## Grille de vérification rapide

### Pages

- [ ] Les 7 écrans sont présents et cohérents.
- [ ] La sidebar est identique sur les écrans internes.
- [ ] L'élément actif est visible.
- [ ] Un seul titre principal par écran.
- [ ] Les tableaux sont lisibles et les badges alignés.
- [ ] La page détail ne propose pas d'action non supportée par l'API.
- [ ] La page décision permet de valider ou refuser avec motif.
- [ ] La confirmation résume la décision.

### Boutons

- [ ] Un seul bouton primaire par zone.
- [ ] Les actions de ligne sont en ghost/texte.
- [ ] Valider/Refuser n'est pas deux gros boutons primaires concurrents.
- [ ] Le bouton de refus n'est rouge qu'en mode refus.
- [ ] Les libellés sont explicites et en français.
- [ ] Les états hover/focus/disabled sont prévus.
- [ ] Les zones cliquables font au moins 44 px.

### Glassmorphisme

- [ ] Le fond coloré/flou est visible derrière les surfaces.
- [ ] Les cartes en verre ont un blur, une bordure claire et une ombre douce.
- [ ] Les champs, tableaux et textes longs restent lisibles.
- [ ] Les boutons primaires restent opaques.
- [ ] Le contraste AA est respecté.
- [ ] Le glassmorphisme reste discret, pas envahissant.
```
