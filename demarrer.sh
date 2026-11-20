#!/usr/bin/env bash
# Lance le serveur PHP local depuis la racine du projet.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f .env ]; then
    echo "Attention : le fichier .env est absent."
    echo "Copiez .env.example vers .env et adaptez les paramètres de la base."
    echo
fi

exec php -S 127.0.0.1:8000 -t public
