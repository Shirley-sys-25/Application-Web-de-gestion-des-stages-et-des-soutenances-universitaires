<?php

declare(strict_types=1);

use App\Services\DemandeService;

/**
 * Vérifie la table des transitions sans base de données.
 *
 * Usage :
 *   php tests/test_transitions.php
 */

require __DIR__ . '/../bootstrap.php';

$cas = [
    ['SOUMISE', 'VALIDEE', true],
    ['SOUMISE', 'REFUSEE', true],
    ['BROUILLON', 'SOUMISE', true],
    ['REFUSEE', 'BROUILLON', true],
    ['VALIDEE', 'REFUSEE', false],
    ['BROUILLON', 'VALIDEE', false],
    ['SOUMISE', 'INCONNU', false],
];

$echecs = 0;

foreach ($cas as [$de, $vers, $attendu]) {
    $obtenu = DemandeService::peutPasser($de, $vers);
    $ok = $obtenu === $attendu;
    $echecs += $ok ? 0 : 1;

    printf(
        "[%s] %s -> %s : attendu %s, obtenu %s%s",
        $ok ? 'OK' : 'KO',
        $de,
        $vers,
        $attendu ? 'true' : 'false',
        $obtenu ? 'true' : 'false',
        PHP_EOL
    );
}

if ($echecs > 0) {
    fwrite(STDERR, "{$echecs} cas en échec." . PHP_EOL);
    exit(1);
}

echo 'Toutes les transitions sont conformes.' . PHP_EOL;
