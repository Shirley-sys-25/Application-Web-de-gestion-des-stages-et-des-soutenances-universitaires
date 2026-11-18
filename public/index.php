<?php

declare(strict_types=1);

use App\Container;
use App\Exceptions\HttpException;

/**
 * Point d'entrée unique de l'API.
 *
 * Toutes les requêtes passent ici. Le routeur est volontairement simple :
 * le cours impose un monolithe modulaire PHP sans framework.
 */

$config = require __DIR__ . '/../bootstrap.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    ini_set('session.use_strict_mode', '1');
    session_name('STAGES_SESSION');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || (($_SERVER['SERVER_PORT'] ?? '') === '443'),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

$conteneur = new Container($config);

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
                'connexion' => '/api/connexion',
                'demandes' => '/api/demandes',
                'contrat' => 'TP6/README.md',
            ],
        ],

        $methode === 'GET' && $chemin === '/api/sante'
            => $conteneur->santeController()->verifier(),

        $methode === 'POST' && $chemin === '/api/connexion'
            => $conteneur->authController()->connexion(),

        $methode === 'POST' && $chemin === '/api/deconnexion'
            => $conteneur->authController()->deconnexion(),

        $methode === 'GET' && $chemin === '/api/moi'
            => $conteneur->authController()->moi(),

        $methode === 'GET' && $chemin === '/api/demandes'
            => $conteneur->demandeController()->lister(),

        $methode === 'GET' && $chemin === '/api/demandes/mes-demandes'
            => $conteneur->demandeController()->mesDemandes(),

        $methode === 'POST' && $chemin === '/api/demandes'
            => $conteneur->demandeController()->creer(),

        $methode === 'PATCH'
            && preg_match('#^/api/demandes/([1-9][0-9]*)/statut$#', $chemin, $correspondances) === 1
            => $conteneur->demandeController()->changerStatut((int) $correspondances[1]),

        default => [
            'status' => 404,
            'body' => [
                'erreur' => 'Route introuvable.',
            ],
        ],
    };
} catch (HttpException $e) {
    $reponse = [
        'status' => $e->status,
        'body' => [
            'erreur' => $e->getMessage(),
        ],
    ];
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
header('Cache-Control: no-store');

$json = json_encode(
    $reponse['body'],
    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
);

if ($json === false) {
    http_response_code(500);
    $json = '{"erreur":"Erreur interne du serveur."}';
}

echo $json . PHP_EOL;
