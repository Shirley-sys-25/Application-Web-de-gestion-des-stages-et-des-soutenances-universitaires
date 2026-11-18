<?php

declare(strict_types=1);

/**
 * Configuration de l'application.
 *
 * Les secrets (hôte, utilisateur, mot de passe de la base) sont lus dans
 * le fichier .env, qui n'est jamais versionné. Le dépôt contient seulement
 * .env.example avec des valeurs factices.
 */

$chargerEnv = static function (string $chemin): void {
    if (!is_readable($chemin)) {
        return;
    }

    $lignes = file($chemin, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    if ($lignes === false) {
        return;
    }

    foreach ($lignes as $ligne) {
        $ligne = trim($ligne);

        if ($ligne === '' || str_starts_with($ligne, '#') || !str_contains($ligne, '=')) {
            continue;
        }

        [$cle, $valeur] = explode('=', $ligne, 2);
        $cle = trim($cle);
        $valeur = trim($valeur);

        // Retire les guillemets simples ou doubles autour de la valeur.
        if (
            $valeur !== ''
            && (
                ($valeur[0] === '"' && str_ends_with($valeur, '"'))
                || ($valeur[0] === "'" && str_ends_with($valeur, "'"))
            )
        ) {
            $valeur = substr($valeur, 1, -1);
        }

        // Une variable déjà définie dans l'environnement garde la priorité.
        if (getenv($cle) === false) {
            putenv($cle . '=' . $valeur);
        }
    }
};

$lireEnv = static function (string $cle, string $defaut = ''): string {
    $valeur = getenv($cle);

    return $valeur === false ? $defaut : $valeur;
};

$chargerEnv(__DIR__ . '/../.env');

return [
    'app' => [
        'env' => $lireEnv('APP_ENV', 'local'),
        'debug' => filter_var($lireEnv('APP_DEBUG', 'false'), FILTER_VALIDATE_BOOL),
    ],
    'db' => [
        'host' => $lireEnv('DB_HOST', '127.0.0.1'),
        'port' => (int) $lireEnv('DB_PORT', '3306'),
        'name' => $lireEnv('DB_NAME', 'stages'),
        'user' => $lireEnv('DB_USER', 'root'),
        'pass' => $lireEnv('DB_PASS'),
        'socket' => $lireEnv('DB_SOCKET'),
    ],
];
