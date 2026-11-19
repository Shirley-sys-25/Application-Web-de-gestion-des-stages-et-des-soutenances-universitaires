# Maquettes TP7

Les 7 écrans sont présents dans leurs dossiers respectifs avec un export `screen.png`.

## Fichiers

1. `1._connexion_unistage_restructur_e/screen.png`
2. `2._tudiant_mes_demandes/screen.png`
3. `3._tudiant_nouvelle_demande/screen.png`
4. `4._tudiant_d_tail_d_une_demande/screen.png`
5. `5._responsable_demandes_traiter/screen.png`
6. `6._responsable_d_cision/screen.png`
7. `7._responsable_confirmation/screen.png`

Un aperçu global est disponible dans `apercu_7_ecrans.png`.

## Générer les PNG sans Stitch

Chaque écran est aussi fourni en HTML (`code.html`). Si Stitch ne propose pas le téléchargement PNG, on peut générer l'image avec Chrome/Playwright.

### 1. Servir le dossier en local

Depuis `TP7/maquettes/` :

```bash
python3 -m http.server 8001 --bind 127.0.0.1
```

### 2. Générer un écran

```bash
npx --yes playwright screenshot \
  --channel chrome \
  --viewport-size "1600,1000" \
  --full-page \
  --wait-for-timeout 2500 \
  "http://127.0.0.1:8001/3._tudiant_nouvelle_demande/code.html" \
  "3._tudiant_nouvelle_demande/screen.png"
```

Remplacer le dossier et le nom du fichier pour chaque écran.

### 3. Générer les 7 écrans d'un coup

```bash
for d in \
  "1._connexion_unistage_restructur_e" \
  "2._tudiant_mes_demandes" \
  "3._tudiant_nouvelle_demande" \
  "4._tudiant_d_tail_d_une_demande" \
  "5._responsable_demandes_traiter" \
  "6._responsable_d_cision" \
  "7._responsable_confirmation"; do
  npx --yes playwright screenshot \
    --channel chrome \
    --viewport-size "1600,1000" \
    --full-page \
    --wait-for-timeout 2500 \
    "http://127.0.0.1:8001/$d/code.html" \
    "$d/screen.png"
done
```

> `--full-page` capture toute la hauteur de la page. `--viewport-size "1600,1000"` force le rendu desktop pour éviter les tableaux coupés.

## Corrections déjà appliquées aux HTML

- Logo cassé remplacé par un logo texte `US` cohérent.
- Menu étudiant nettoyé : suppression de « Demandes à traiter ».
- Menu responsable harmonisé : Tableau de bord, Demandes à traiter, Toutes les demandes.
- « Secrétariat » remplacé par « Responsable pédagogique » (conforme au TP3).
- Page décision : « Valider » sélectionné par défaut, champ motif masqué tant que « Refuser » n'est pas choisi.
- Bouton « Rapport de cohorte » passé en secondaire pour laisser « Traiter » comme action primaire.

## Points à corriger avant le code TP7

Voir `TP7/revue_maquettes.md`.
