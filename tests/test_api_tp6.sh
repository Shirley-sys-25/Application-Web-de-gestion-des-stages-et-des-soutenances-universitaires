#!/usr/bin/env bash
# Vérifie les cas HTTP des TP6 et TP7 avec curl.
#
# Prérequis :
#   1. base rechargée avec TP3/001_schema.sql, TP3/002_seed.sql,
#      TP6/001_schema_tp6.sql et TP6/002_seed_tp6.sql ;
#   2. serveur lancé : php -S 127.0.0.1:8000 -t public
#
# Usage : ./tests/test_api_tp6.sh
# BASE_URL peut être changé : BASE_URL=http://127.0.0.1:8010 ./tests/test_api_tp6.sh

set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8000}"
DOSSIER="$(mktemp -d)"
trap 'rm -rf "$DOSSIER"' EXIT

COOKIE_ETUDIANT="$DOSSIER/etudiant.cookies"
COOKIE_RESPONSABLE="$DOSSIER/responsable.cookies"
CSRF_ETUDIANT=""
CSRF_RESPONSABLE=""

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

# Ouvre une session et récupère le jeton CSRF associé.
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

echo "=== Connexion étudiant ==="
CSRF_ETUDIANT="$(recuperer_jeton "$COOKIE_ETUDIANT")"
reponse="$(requete POST /api/connexion '{"email":"etudiant1@univ.test","mot_de_passe":"etudiant123"}' "$COOKIE_ETUDIANT" "$CSRF_ETUDIANT")"
verifier 'Connexion étudiant' 200 "$reponse"

echo "=== TP7 : GET /api/entreprises ==="
reponse="$(requete GET /api/entreprises '' "$COOKIE_ETUDIANT")"
verifier 'GET /api/entreprises en tant qu’étudiant' 200 "$reponse"
if ! printf '%s' "$reponse" | grep -q '"nom":"Atelier Numerique"'; then
    echo "[KO] GET /api/entreprises : Atelier Numerique absent" >&2
    exit 1
fi
if ! printf '%s' "$reponse" | grep -q '"nom":"Reseau Plus"'; then
    echo "[KO] GET /api/entreprises : Reseau Plus absent" >&2
    exit 1
fi
reponse="$(requete GET /api/entreprises)"
verifier 'GET /api/entreprises sans session' 401 "$reponse"

echo "=== Cas 1 : succès de création ==="
reponse="$(requete POST /api/demandes '{"entreprise_id":1}' "$COOKIE_ETUDIANT" "$CSRF_ETUDIANT")"
verifier 'POST /api/demandes (entreprise 1)' 201 "$reponse"
DEMANDE_ID="$(printf '%s' "$reponse" | head -n 1 | php -r '$d=json_decode(stream_get_contents(STDIN), true); echo $d["id"] ?? "";')"

echo "=== Cas 2 : 400 entreprise inexistante ==="
reponse="$(requete POST /api/demandes '{"entreprise_id":999}' "$COOKIE_ETUDIANT" "$CSRF_ETUDIANT")"
verifier 'POST /api/demandes (entreprise 999)' 400 "$reponse"

echo "=== Cas 3 : 401 sans session ==="
reponse="$(requete POST /api/demandes '{"entreprise_id":1}')"
verifier 'POST /api/demandes sans cookie' 401 "$reponse"

echo "=== Cas 4 : 403 étudiant sur la liste responsable ==="
reponse="$(requete GET /api/demandes '' "$COOKIE_ETUDIANT")"
verifier 'GET /api/demandes en tant qu’étudiant' 403 "$reponse"

echo "=== Connexion responsable ==="
CSRF_RESPONSABLE="$(recuperer_jeton "$COOKIE_RESPONSABLE")"
reponse="$(requete POST /api/connexion '{"email":"responsable@univ.test","mot_de_passe":"responsable123"}' "$COOKIE_RESPONSABLE" "$CSRF_RESPONSABLE")"
verifier 'Connexion responsable' 200 "$reponse"

reponse="$(requete GET /api/entreprises '' "$COOKIE_RESPONSABLE")"
verifier 'GET /api/entreprises en tant que responsable' 403 "$reponse"

echo "=== Cas 5 : 404 demande inexistante ==="
reponse="$(requete PATCH /api/demandes/999/statut '{"decision":"VALIDEE"}' "$COOKIE_RESPONSABLE" "$CSRF_RESPONSABLE")"
verifier 'PATCH /api/demandes/999/statut' 404 "$reponse"

echo "=== Validation de la demande créée (succès 200) ==="
reponse="$(requete PATCH "/api/demandes/$DEMANDE_ID/statut" '{"decision":"VALIDEE"}' "$COOKIE_RESPONSABLE" "$CSRF_RESPONSABLE")"
verifier "PATCH /api/demandes/$DEMANDE_ID/statut" 200 "$reponse"

echo "=== Cas 6 : 409 validation répétée ==="
reponse="$(requete PATCH "/api/demandes/$DEMANDE_ID/statut" '{"decision":"VALIDEE"}' "$COOKIE_RESPONSABLE" "$CSRF_RESPONSABLE")"
verifier "PATCH /api/demandes/$DEMANDE_ID/statut (répétition)" 409 "$reponse"

echo 'Tous les cas HTTP des TP6 et TP7 sont conformes.'
