<?php

declare(strict_types=1);

/**
 * Point d'amorçage commun : autoload des classes et chargement de la configuration.
 * Le fichier est utilisable en CLI (tests) comme en HTTP (public/index.php).
 */

spl_autoload_register(static function (string $classe): void {
    $prefixe = 'App\\';

    if (!str_starts_with($classe, $prefixe)) {
        return;
    }

    $chemin = __DIR__ . '/src/' . str_replace('\\', '/', substr($classe, strlen($prefixe))) . '.php';

    if (is_file($chemin)) {
        require $chemin;
    }
});

return require __DIR__ . '/config/config.php';
