#!/usr/bin/env bash
# Vérifie que GET /api/sante répond 200 quand la base est joignable.
# Usage : ./tests/test_sante.sh
# Le serveur doit tourner : php -S 127.0.0.1:8000 -t public

set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8000}"
FICHIER="$(mktemp)"
trap 'rm -f "$FICHIER"' EXIT

CODE="$(curl -sS -o "$FICHIER" -w '%{http_code}' "$BASE_URL/api/sante")"

echo "GET $BASE_URL/api/sante -> HTTP $CODE"
cat "$FICHIER"
echo

if [ "$CODE" != "200" ]; then
    echo "Échec : la route de santé doit répondre 200." >&2
    exit 1
fi

echo "OK : la base est joignable."
