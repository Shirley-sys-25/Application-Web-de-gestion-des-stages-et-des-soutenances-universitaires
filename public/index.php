<?php

declare(strict_types=1);

use App\Controllers\DemandeController;
use App\Controllers\SanteController;

/**
 * Point d'entrée unique de l'API.
 *
 * Toutes les requêtes passent ici. Le routeur est volontairement simple :
 * le cours impose un monolithe modulaire PHP sans framework.
 */

$config = require __DIR__ . '/../bootstrap.php';

$methode = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$chemin = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$chemin = is_string($chemin) ? $chemin : '/';
$chemin = rtrim($chemin, '/') ?: '/';

try {
    $reponse = match (true) {
        $methode === 'GET' && $chemin === '/' => [
            'status' => 200,
            'body' => [
                'application' => 'Gestion des stages et des soutenances',
                'sante' => '/api/sante',
                'contrat' => 'TP4/contrat_api.md',
            ],
        ],

        $methode === 'GET' && $chemin === '/api/sante' => (new SanteController($config))->verifier(),

        $methode === 'GET' && $chemin === '/api/demandes' => (new DemandeController())->lister(),
        $methode === 'POST' && $chemin === '/api/demandes' => (new DemandeController())->creer(),

        $methode === 'PATCH'
            && preg_match('#^/api/demandes/([1-9][0-9]*)/statut$#', $chemin, $correspondances) === 1
            => (new DemandeController())->changerStatut((int) $correspondances[1]),

        default => [
            'status' => 404,
            'body' => [
                'erreur' => 'Route introuvable.',
            ],
        ],
    };
} catch (Throwable $e) {
    error_log('[api] ' . $e->getMessage());

    $reponse = [
        'status' => 500,
        'body' => [
            'erreur' => 'Erreur interne du serveur.',
        ],
    ];
}

http_response_code($reponse['status']);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$json = json_encode(
    $reponse['body'],
    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
);

if ($json === false) {
    http_response_code(500);
    $json = '{"erreur":"Erreur interne du serveur."}';
}

echo $json . PHP_EOL;
