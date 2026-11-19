# TP7 — Brief et prompt pour Google Stitch

> Variante glassmorphism et corrections de structure : voir `TP7/prompt_correction_glassmorphism.md`.

## 1. Décisions de design

| Élément | Choix |
|---|---|
| Périmètre | 7 écrans TP7 : connexion, espace étudiant (liste, dépôt, détail), espace responsable (liste, décision, confirmation) |
| Format | Desktop-first responsive (1440 px, puis mobile 390 px) |
| Style | Coloré et jeune, mais crédible et lisible |
| Fidélité | Haute fidélité |
| Navigation | Dashboard avec barre latérale |
| Données | Données fictives du projet (ADJOVI, BELLO, DOSSOU, Atelier Numerique, Reseau Plus) |

## 2. Prompt maître à coller dans Google Stitch

> Dans Stitch, choisir **Web** et **Desktop**. Coller le prompt ci-dessous.
> Si Stitch limite la longueur ou ne génère pas les 7 écrans d'un coup, utiliser les prompts écran par écran de la section 3.

```text
Rôle : Tu es un designer produit senior spécialisé dans les applications web universitaires.

Crée une maquette UI haute fidélité, desktop-first responsive, pour « UniStage », une application web française de gestion des demandes de stage et des soutenances universitaires.

CONTEXTE
- Utilisateurs : étudiants de L3 SIL et responsables pédagogiques.
- Objectif : l'étudiant dépose une demande de stage et suit son statut ; le responsable examine les demandes et prend une décision (valider ou refuser avec motif).
- Toutes les données sont fictives. Interface 100 % en français.
- Ton : coloré et jeune, mais crédible, lisible et institutionnel. Pas de style cartoon, pas de surcharge visuelle.

DIRECTION ARTISTIQUE
- Palette : indigo/violet #4F46E5 (primaire), corail #FF6B6B (accent), menthe #10B981 (succès), ambre #F59E0B (attention), rouge #EF4444 (erreur/refus), fond #F7F8FC, surfaces blanches, texte #111827, texte secondaire #6B7280.
- Typographie : Sora pour les titres, Inter pour le corps. Titres 24–32 px, corps 14–16 px.
- Style : cartes blanches à coins arrondis 16 px, ombres douces, badges de statut, illustrations géométriques abstraites légères, icônes arrondies, beaucoup d'espace blanc.
- Accessibilité : contraste AA, labels visibles et liés aux champs (for/id), types adaptés (email, date), focus visibles, messages d'erreur sous les champs avec role="alert", statut jamais indiqué uniquement par la couleur, zones cliquables >= 44 px.
- Layout desktop : largeur 1440 px, sidebar fixe 260 px, top bar 72 px, contenu max 1200 px, grille 12 colonnes.
- Responsive : la sidebar se replie en menu/bottom nav sur mobile 390 px ; les tableaux deviennent des cartes.

NAVIGATION
- Sidebar étudiant : logo UniStage, Tableau de bord, Mes demandes (actif), Nouvelle demande, Mon profil ; carte utilisateur ADJOVI Koffi, ETU-2026-001, bouton Déconnexion.
- Sidebar responsable : logo UniStage, Tableau de bord, Demandes à traiter (actif), Toutes les demandes ; carte Responsable pédagogique, bouton Déconnexion.
- Top bar : fil d'Ariane/titre, recherche, cloche de notifications, avatar.
- Composants : boutons primaire/secondaire/ghost, champs avec label au-dessus, select, textarea, badges, cartes de statistiques, tableau, timeline, modale de confirmation, toast.

DONNÉES FICTIVES À UTILISER
- Étudiants : ADJOVI Koffi (ETU-2026-001), BELLO Aicha (ETU-2026-002), DOSSOU Marc (ETU-2026-003).
- Entreprises : Atelier Numerique (Cotonou), Reseau Plus (Porto-Novo).
- Demandes :
  #1 ADJOVI / Atelier Numerique / BROUILLON / 10/11/2026
  #2 BELLO / Atelier Numerique / SOUMISE / 11/11/2026
  #3 DOSSOU / Reseau Plus / VALIDEE / 12/11/2026, décision 14/11/2026
  #4 ADJOVI / Reseau Plus / REFUSEE / 13/11/2026, motif « Dossier incomplet : convention non signée. », décision 15/11/2026
  #5 ADJOVI / Atelier Numerique / SOUMISE / 18/11/2026
- Badges : Brouillon (gris), Soumise (bleu), Validée (vert), Refusée (rouge).

GÉNÈRE EXACTEMENT 7 ÉCRANS, cohérents entre eux, avec les mêmes composants et la même grille :

1. CONNEXION
- Split screen : panneau gauche illustré avec logo UniStage, accroche « Déposez et suivez votre demande de stage en toute simplicité. », formes géométriques indigo/corail ; panneau droit avec carte de connexion.
- Champs Email et Mot de passe, bouton « Se connecter », lien « Mot de passe oublié ? ».
- Encadré discret « Comptes de démonstration » avec etudiant1@univ.test / etudiant123 et responsable@univ.test / responsable123.
- État d'erreur visible : « Email ou mot de passe incorrect. » avec role alert.
- Mention « Données fictives – projet universitaire » en bas.

2. ÉTUDIANT — MES DEMANDES
- Titre « Bonjour Koffi » et sous-titre « Voici l'état de vos demandes de stage. »
- 3 cartes stats : 1 brouillon, 1 soumise, 1 refusée.
- Barre d'actions : bouton primaire « + Nouvelle demande », champ de recherche, filtre statut.
- Tableau/cartes des demandes #5 SOUMISE, #4 REFUSEE, #1 BROUILLON : entreprise, ville, date de dépôt, statut, action « Voir » / « Reprendre ».
- Mise en avant de la demande refusée avec un motif court.
- État vide illustré si aucune demande (petit encart).

3. ÉTUDIANT — NOUVELLE DEMANDE
- Titre « Nouvelle demande de stage », fil d'Ariane « Mes demandes > Nouvelle demande ».
- Carte formulaire en 2 colonnes : section « Étudiant » en lecture seule (ADJOVI Koffi, ETU-2026-001, etudiant1@univ.test) ; section « Stage » avec select « Entreprise d'accueil » (Atelier Numerique, Reseau Plus), champ Ville auto-rempli en lecture seule, encadré d'information « Votre demande sera créée au statut Soumise. »
- Boutons « Annuler » et « Soumettre ma demande ».
- État d'erreur sous le select : « Veuillez choisir une entreprise. » avec role alert.
- Encart latéral « Ce qui se passe ensuite » en 3 étapes : dépôt, examen, décision.

4. ÉTUDIANT — DÉTAIL D'UNE DEMANDE
- En-tête « Demande #5 » + badge Soumise, bouton retour « Mes demandes ».
- Carte principale : entreprise Atelier Numerique, ville Cotonou, date de dépôt 18/11/2026 à 17:05, statut Soumise, encadreur « Non assigné ».
- Carte « Suivi de la demande » avec timeline : Demande créée (18/11/2026), En attente de décision (état actuel).
- Encart « Prochaine étape : le responsable pédagogique examine votre dossier. »
- Variante d'état refusé : encart rouge avec motif et date de décision (montrer #4 dans une seconde carte ou un onglet).
- Bouton secondaire « Retour à mes demandes ».

5. RESPONSABLE — DEMANDES À TRAITER
- Titre « Demandes à traiter », sous-titre « Examinez les demandes soumises et prenez une décision. »
- 4 cartes stats : À traiter 1, Validées 1, Refusées 1, Total 4.
- Barre de filtres : recherche par étudiant/numéro, segmented control « À traiter / Toutes », filtre statut.
- Tableau : Étudiant (avatar initiales + nom + numéro), Entreprise, Ville, Date de dépôt, Statut, Action « Traiter ».
- Ligne principale : BELLO Aicha / Atelier Numerique / Cotonou / 11/11/2026 / Soumise / bouton « Traiter ».
- Autres lignes : DOSSOU Marc (Validée), ADJOVI Koffi (Refusée), ADJOVI Koffi (Brouillon).
- État vide « Aucune demande à traiter » avec illustration.

6. RESPONSABLE — DÉCISION
- Titre « Décision — Demande #2 », badge Soumise, bouton retour.
- Deux colonnes : à gauche carte dossier (étudiant BELLO Aicha, ETU-2026-002, entreprise Atelier Numerique, Cotonou, date de dépôt, pièces/statut) ; à droite carte « Votre décision ».
- Segmented control « Valider » / « Refuser » (Valider sélectionné par défaut).
- Si Refuser : textarea « Motif du refus » obligatoire, compteur 0/255, helper « Expliquez précisément ce qui manque. », état d'erreur « Le motif est obligatoire pour un refus. ».
- Boutons « Annuler » et « Confirmer la décision ».
- Encart d'avertissement « La décision sera enregistrée dans l'historique. ».
- Timeline compacte du dossier.

7. RESPONSABLE — CONFIRMATION
- Écran de confirmation centré, fond clair, carte blanche avec icône de succès menthe.
- Titre « Demande #2 validée » (ou « Demande #2 refusée » avec icône corail/rouge et motif).
- Résumé : BELLO Aicha, Atelier Numerique, date de décision 18/11/2026.
- Boutons « Retour aux demandes à traiter » et « Voir la demande ».
- Toast discret « Décision enregistrée avec succès. ».

CONTRAINTES
- Les 7 écrans doivent former une suite cohérente, pas 7 styles différents.
- Utiliser les mêmes couleurs, typographies, espacements, badges et composants.
- Pas de lorem ipsum, pas de texte anglais, pas de données réelles, pas de logo d'université réel.
- Pas de tableaux surchargés ; privilégier la lisibilité.
- Prévoir les états hover/focus/disabled et l'accessibilité.
- Livrer les écrans en français, prêts à être exportés en PNG pour un dossier de TP.
```

## 3. Prompts de secours écran par écran

À utiliser si Stitch ne respecte pas le prompt maître. Garder le même préambule (palette, typographie, accessibilité) et ne changer que la partie « écran ».

### Écran 1 — Connexion

```text
Écran de connexion desktop 1440 px pour UniStage, application universitaire de gestion des stages. Split screen : à gauche, panneau indigo #4F46E5 avec logo, accroche « Déposez et suivez votre demande de stage en toute simplicité. » et formes géométriques corail ; à droite, carte blanche centrée avec champs Email et Mot de passe, bouton primaire « Se connecter », lien « Mot de passe oublié ? », encadré « Comptes de démonstration », message d'erreur accessible, mention « Données fictives – projet universitaire ». Style coloré et jeune mais crédible, coins arrondis, ombres douces, typographies Sora + Inter, contraste AA.
```

### Écran 2 — Étudiant, mes demandes

```text
Dashboard étudiant desktop 1440 px pour UniStage. Sidebar 260 px avec logo, navigation (Tableau de bord, Mes demandes actif, Nouvelle demande, Mon profil) et carte ADJOVI Koffi / ETU-2026-001. Top bar avec titre « Bonjour Koffi », recherche, notifications, avatar. Contenu : 3 cartes stats (1 brouillon, 1 soumise, 1 refusée), bouton « + Nouvelle demande », filtres, tableau des demandes #5 SOUMISE, #4 REFUSEE (motif visible) et #1 BROUILLON avec badges colorés et actions Voir/Reprendre. Style indigo/violet, corail, menthe, cartes blanches arrondies, typographies Sora + Inter, accessible AA.
```

### Écran 3 — Étudiant, nouvelle demande

```text
Formulaire desktop 1440 px « Nouvelle demande de stage » pour UniStage avec sidebar étudiant. Carte formulaire en deux colonnes : section Étudiant en lecture seule (ADJOVI Koffi, ETU-2026-001, etudiant1@univ.test) et section Stage avec select « Entreprise d'accueil » (Atelier Numerique, Reseau Plus), ville en lecture seule, encadré « Votre demande sera créée au statut Soumise. », état d'erreur sous le select, boutons Annuler et Soumettre ma demande. Encart latéral « Ce qui se passe ensuite » en 3 étapes. Style indigo/violet, cartes blanches, coins arrondis, labels visibles, focus visibles, contraste AA.
```

### Écran 4 — Étudiant, détail d'une demande

```text
Page détail desktop 1440 px « Demande #5 » pour UniStage avec sidebar étudiant. En-tête avec badge Soumise et bouton retour. Carte informations : Atelier Numerique, Cotonou, déposée le 18/11/2026 à 17:05, encadreur non assigné. Carte « Suivi de la demande » avec timeline (Demande créée, En attente de décision). Encart « Prochaine étape : le responsable pédagogique examine votre dossier. » Variante refusée avec encart rouge et motif « Dossier incomplet : convention non signée. » pour la demande #4. Style indigo/violet, cartes blanches, badges, typographies Sora + Inter, accessible.
```

### Écran 5 — Responsable, demandes à traiter

```text
Dashboard responsable desktop 1440 px pour UniStage. Sidebar 260 px avec logo, navigation (Tableau de bord, Demandes à traiter actif, Toutes les demandes) et carte Responsable pédagogique. Top bar avec recherche, notifications, avatar. Contenu : titre « Demandes à traiter », 4 cartes stats (À traiter 1, Validées 1, Refusées 1, Total 4), filtres et tableau avec BELLO Aicha / Atelier Numerique / Cotonou / 11/11/2026 / Soumise / bouton Traiter, puis DOSSOU Marc (Validée), ADJOVI Koffi (Refusée), ADJOVI Koffi (Brouillon). Badges colorés, style indigo/violet + corail + menthe, cartes blanches arrondies, contraste AA.
```

### Écran 6 — Responsable, décision

```text
Page décision desktop 1440 px « Décision — Demande #2 » pour UniStage avec sidebar responsable. Deux colonnes : dossier de BELLO Aicha (ETU-2026-002), Atelier Numerique, Cotonou, date de dépôt, statut Soumise, timeline compacte ; carte « Votre décision » avec segmented control Valider/Refuser, textarea « Motif du refus » obligatoire, compteur 0/255, helper, état d'erreur, boutons Annuler et Confirmer la décision, encart « La décision sera enregistrée dans l'historique. ». Style indigo/violet, cartes blanches, badges, typographies Sora + Inter, focus visibles, contraste AA.
```

### Écran 7 — Responsable, confirmation

```text
Écran de confirmation desktop 1440 px pour UniStage, fond #F7F8FC, carte blanche centrée avec icône de succès menthe. Titre « Demande #2 validée », résumé BELLO Aicha / Atelier Numerique / décision du 18/11/2026, boutons « Retour aux demandes à traiter » et « Voir la demande », toast « Décision enregistrée avec succès. ». Variante refusée avec icône corail/rouge et motif affiché. Style coloré et jeune mais crédible, indigo/violet, cartes arrondies, typographies Sora + Inter, contraste AA.
```

## 4. Après génération

1. Exporter chaque écran en PNG.
2. Nommer les fichiers dans l'ordre :
   - `01_connexion.png`
   - `02_etudiant_mes_demandes.png`
   - `03_etudiant_nouvelle_demande.png`
   - `04_etudiant_detail_demande.png`
   - `05_responsable_demandes_a_traiter.png`
   - `06_responsable_decision.png`
   - `07_responsable_confirmation.png`
3. Placer les fichiers dans `TP7/maquettes/`.
4. Ajouter une capture mobile si Stitch en génère une (sinon, la mention « responsive » du prompt suffit pour le TP7).
5. Vérifier que les 7 écrans utilisent bien les mêmes couleurs, badges et composants avant de les intégrer au dossier.
```
