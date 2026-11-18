<?php

declare(strict_types=1);

use App\Database;

/**
 * Test en ligne de commande de la connexion PDO.
 *
 * Usage :
 *   php tests/test_connexion.php
 */

$config = require __DIR__ . '/../bootstrap.php';

try {
    $pdo = Database::connexion($config);
    $pdo->query('SELECT 1');

    $cible = $config['db']['socket'] !== ''
        ? 'socket ' . $config['db']['socket']
        : $config['db']['host'] . ':' . $config['db']['port'];

    echo "[OK] Connexion PDO réussie à la base « {$config['db']['name']} » ({$cible})." . PHP_EOL;
    exit(0);
} catch (Throwable $e) {
    fwrite(STDERR, '[ERREUR] ' . $e->getMessage() . PHP_EOL);

    $precedente = $e->getPrevious();
    if ($precedente instanceof Throwable) {
        fwrite(STDERR, '[DÉTAIL] ' . $precedente->getMessage() . PHP_EOL);
    }

    exit(1);
}
