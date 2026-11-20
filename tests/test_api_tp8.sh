#!/usr/bin/env bash
# TP8 : matrice de tests, cas limites et contrôles de sécurité.
#
# Prérequis :
#   1. base rechargée avec TP3/001_schema.sql, TP3/002_seed.sql,
#      TP6/001_schema_tp6.sql et TP6/002_seed_tp6.sql ;
#   2. serveur lancé : php -S 127.0.0.1:8000 -t public
#
# Usage : ./tests/test_api_tp8.sh
# BASE_URL peut être changé : BASE_URL=http://127.0.0.1:8010 ./tests/test_api_tp8.sh

set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8000}"
DOSSIER="$(mktemp -d)"
trap 'rm -rf "$DOSSIER"' EXIT

COOKIE_ETU1="$DOSSIER/etudiant1.cookies"
COOKIE_ETU2="$DOSSIER/etudiant2.cookies"
COOKIE_RESP="$DOSSIER/responsable.cookies"
CSRF_ETU1=""
CSRF_ETU2=""
CSRF_RESP=""

# Renvoie le corps puis le code HTTP sur la dernière ligne.
# Le 5e argument optionnel est le jeton CSRF à envoyer.
requete() {
    local methode="$1"
    local chemin="$2"
    local donnees="${3:-}"
    local cookie="${4:-}"
    local csrf="${5:-}"
    local arguments=(-sS -X "$methode" -H 'Content-Type: application/json' -w $'\n%{http_code}')

    if [ -n "$cookie" ]; then
        arguments+=(-b "$cookie" -c "$cookie")
    fi

    if [ -n "$csrf" ]; then
        arguments+=(-H "X-CSRF-Token: $csrf")
    fi

    if [ -n "$donnees" ]; then
        arguments+=(-d "$donnees")
    fi

    curl "${arguments[@]}" "$BASE_URL$chemin"
}

recuperer_jeton() {
    local cookie="$1"
    curl -sS -b "$cookie" -c "$cookie" "$BASE_URL/api/csrf" \
        | php -r '$d=json_decode(stream_get_contents(STDIN), true); echo $d["csrf_token"] ?? "";'
}

verifier() {
    local nom="$1"
    local attendu="$2"
    local reponse="$3"
    local code="${reponse##*$'\n'}"
    local corps="${reponse%$'\n'*}"

    if [ "$code" != "$attendu" ]; then
        echo "[KO] $nom : attendu HTTP $attendu, obtenu HTTP $code" >&2
        echo "$corps" >&2
        exit 1
    fi

    echo "[OK] $nom -> HTTP $code"
    echo "$corps"
    echo
}

verifier_contient() {
    local nom="$1"
    local aiguille="$2"
    local reponse="$3"
    local corps="${reponse%$'\n'*}"

    if ! printf '%s' "$corps" | grep -Fq "$aiguille"; then
        echo "[KO] $nom : fragment absent : $aiguille" >&2
        echo "$corps" >&2
        exit 1
    fi

    echo "[OK] $nom : contient $aiguille"
}

verifier_absent() {
    local nom="$1"
    local aiguille="$2"
    local reponse="$3"
    local corps="${reponse%$'\n'*}"

    if printf '%s' "$corps" | grep -Fq "$aiguille"; then
        echo "[KO] $nom : fragment interdit présent : $aiguille" >&2
        echo "$corps" >&2
        exit 1
    fi

    echo "[OK] $nom : ne contient pas $aiguille"
}

verifier_vide() {
    local nom="$1"
    local reponse="$2"
    local corps="${reponse%$'\n'*}"

    if [ "$(printf '%s' "$corps" | tr -d '[:space:]')" != "[]" ]; then
        echo "[KO] $nom : liste non vide" >&2
        echo "$corps" >&2
        exit 1
    fi

    echo "[OK] $nom : liste vide"
}

extraire_id() {
    local reponse="$1"
    printf '%s' "${reponse%$'\n'*}" \
        | php -r '$d=json_decode(stream_get_contents(STDIN), true); echo $d["id"] ?? "";'
}

echo "================================================================"
echo " TP8 — cas limites, autorisations, injection et CSRF"
echo "================================================================"
echo

echo "=== Jetons CSRF et connexions ==="
reponse="$(requete POST /api/connexion '{"email":"etudiant1@univ.test","mot_de_passe":"etudiant123"}')"
verifier 'Connexion sans jeton CSRF' 403 "$reponse"
verifier_contient 'La connexion exige le jeton' 'CSRF' "$reponse"

reponse="$(requete GET /api/csrf '' "$COOKIE_ETU1")"
verifier 'GET /api/csrf sans session' 200 "$reponse"

CSRF_ETU1="$(recuperer_jeton "$COOKIE_ETU1")"
CSRF_ETU2="$(recuperer_jeton "$COOKIE_ETU2")"
CSRF_RESP="$(recuperer_jeton "$COOKIE_RESP")"

for jeton in "$CSRF_ETU1" "$CSRF_ETU2" "$CSRF_RESP"; do
    if [ -z "$jeton" ]; then
        echo "[KO] Jeton CSRF vide." >&2
        exit 1
    fi
done

reponse="$(requete POST /api/connexion '{"email":"etudiant1@univ.test","mot_de_passe":"etudiant123"}' "$COOKIE_ETU1" "$CSRF_ETU1")"
verifier 'Connexion étudiant A' 200 "$reponse"
reponse="$(requete POST /api/connexion '{"email":"etudiant2@univ.test","mot_de_passe":"etudiant123"}' "$COOKIE_ETU2" "$CSRF_ETU2")"
verifier 'Connexion étudiant B' 200 "$reponse"
reponse="$(requete POST /api/connexion '{"email":"responsable@univ.test","mot_de_passe":"responsable123"}' "$COOKIE_RESP" "$CSRF_RESP")"
verifier 'Connexion responsable' 200 "$reponse"

echo "=== T-05 / ENF-01 : autorisation de lecture d'un dossier ==="
reponse="$(requete GET /api/demandes/4 '' "$COOKIE_ETU1")"
verifier 'Étudiant A lit son dossier 4' 200 "$reponse"
verifier_contient 'Dossier 4 du propriétaire' '"nom":"ADJOVI"' "$reponse"

reponse="$(requete GET /api/demandes/4 '' "$COOKIE_ETU2")"
verifier 'Étudiant B lit le dossier 4 de A' 403 "$reponse"
verifier_absent 'Réponse 403 sans donnée de A' 'ADJOVI' "$reponse"
verifier_absent 'Réponse 403 sans objet étudiant' '"etudiant"' "$reponse"

reponse="$(requete GET /api/demandes/2 '' "$COOKIE_ETU2")"
verifier 'Étudiant B lit son propre dossier 2' 200 "$reponse"
verifier_contient 'Dossier 2 du propriétaire' '"nom":"BELLO"' "$reponse"

echo "=== T-06 : injection SQL dans un identifiant et une recherche ==="
reponse="$(requete GET '/api/demandes/1%20OR%201=1' '' "$COOKIE_ETU1")"
verifier 'GET /api/demandes/1 OR 1=1' 404 "$reponse"

reponse="$(requete PATCH '/api/demandes/1%20OR%201=1/statut' '{"decision":"VALIDEE"}' "$COOKIE_RESP" "$CSRF_RESP")"
verifier 'PATCH /api/demandes/1 OR 1=1/statut' 404 "$reponse"

reponse="$(requete GET '/api/demandes?q=1%20OR%201=1' '' "$COOKIE_RESP")"
verifier 'Recherche q=1 OR 1=1' 200 "$reponse"
verifier_vide 'La recherche ne retourne aucune ligne' "$reponse"

echo "=== T-07 / CSRF : écriture authentifiée ==="
reponse="$(requete POST /api/demandes '{"entreprise_id":1}' "$COOKIE_ETU1")"
verifier 'POST /api/demandes sans jeton CSRF' 403 "$reponse"
verifier_contient 'Message CSRF absent' 'CSRF' "$reponse"

reponse="$(requete POST /api/demandes '{"entreprise_id":1}' "$COOKIE_ETU1" 'jeton-invalide')"
verifier 'POST /api/demandes avec jeton invalide' 403 "$reponse"

reponse="$(requete POST /api/demandes '{"entreprise_id":1}' "$COOKIE_ETU1" "$CSRF_ETU1")"
verifier 'POST /api/demandes avec jeton valide' 201 "$reponse"
DEMANDE_ID="$(extraire_id "$reponse")"

if [ -z "$DEMANDE_ID" ]; then
    echo "[KO] Identifiant de la demande créée introuvable." >&2
    exit 1
fi

echo "=== T-01 : demande inexistante ==="
reponse="$(requete PATCH /api/demandes/999/statut '{"decision":"VALIDEE"}' "$COOKIE_RESP" "$CSRF_RESP")"
verifier 'PATCH /api/demandes/999/statut' 404 "$reponse"

echo "=== T-02 : refus sans motif ==="
reponse="$(requete PATCH /api/demandes/2/statut '{"decision":"REFUSEE"}' "$COOKIE_RESP" "$CSRF_RESP")"
verifier 'PATCH /api/demandes/2/statut sans motif' 400 "$reponse"
verifier_contient 'Message motif obligatoire' 'motif' "$reponse"

reponse="$(requete GET /api/demandes/2 '' "$COOKIE_RESP")"
verifier_contient 'La demande 2 est restée SOUMISE' '"statut":"SOUMISE"' "$reponse"

echo "=== T-03 : validation répétée ==="
reponse="$(requete PATCH /api/demandes/3/statut '{"decision":"VALIDEE"}' "$COOKIE_RESP" "$CSRF_RESP")"
verifier 'PATCH /api/demandes/3/statut (déjà validée)' 409 "$reponse"

reponse="$(requete GET /api/demandes/3 '' "$COOKIE_RESP")"
verifier_contient 'La demande 3 est restée VALIDEE' '"statut":"VALIDEE"' "$reponse"

echo "=== Identifiant négatif ==="
reponse="$(requete PATCH /api/demandes/-1/statut '{"decision":"VALIDEE"}' "$COOKIE_RESP" "$CSRF_RESP")"
verifier 'PATCH /api/demandes/-1/statut' 404 "$reponse"

echo "=== T-04 : date de soutenance invalide ==="
reponse="$(requete POST /api/soutenances '{"demande_id":3,"date_heure":"2026-02-30 10:00:00","salle":"B12","duree_minutes":45}' "$COOKIE_RESP" "$CSRF_RESP")"
verifier 'POST /api/soutenances avec le 30 février' 400 "$reponse"
verifier_contient 'Message date invalide' 'Date de soutenance invalide' "$reponse"

echo "=== EF-05 : date valide et doublon de demande ==="
reponse="$(requete PATCH "/api/demandes/$DEMANDE_ID/statut" '{"decision":"VALIDEE"}' "$COOKIE_RESP" "$CSRF_RESP")"
verifier "Validation de la demande $DEMANDE_ID" 200 "$reponse"

SALLE_TEST="Z$(date +%s)$RANDOM"
reponse="$(requete POST /api/soutenances "{\"demande_id\":$DEMANDE_ID,\"date_heure\":\"2027-04-10 09:30:00\",\"salle\":\"$SALLE_TEST\",\"duree_minutes\":45}" "$COOKIE_RESP" "$CSRF_RESP")"
verifier 'Programmation avec date valide' 201 "$reponse"
verifier_contient 'Soutenance créée pour la demande' "\"demande_id\":$DEMANDE_ID" "$reponse"

reponse="$(requete POST /api/soutenances "{\"demande_id\":$DEMANDE_ID,\"date_heure\":\"2027-04-11 09:30:00\",\"salle\":\"$SALLE_TEST\",\"duree_minutes\":45}" "$COOKIE_RESP" "$CSRF_RESP")"
verifier 'Seconde soutenance pour la même demande' 409 "$reponse"

echo "=== Autorisations par rôle ==="
reponse="$(requete GET /api/demandes '' "$COOKIE_ETU1")"
verifier 'Étudiant sur la liste responsable' 403 "$reponse"

reponse="$(requete GET /api/entreprises '' "$COOKIE_RESP")"
verifier 'Responsable sur la liste des entreprises' 403 "$reponse"

reponse="$(requete POST /api/soutenances '{"demande_id":3,"date_heure":"2027-05-01 10:00:00","salle":"C01","duree_minutes":45}' "$COOKIE_ETU1" "$CSRF_ETU1")"
verifier 'Étudiant sur la programmation de soutenance' 403 "$reponse"

echo "=== Sans session ==="
reponse="$(requete POST /api/demandes '{"entreprise_id":1}')"
verifier 'POST /api/demandes sans session' 401 "$reponse"

echo
echo "Tous les contrôles TP8 sont conformes."
