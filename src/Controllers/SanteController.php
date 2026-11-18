<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Database;
use Throwable;

/**
 * Route publique GET /api/sante.
 *
 * Elle répond 200 si la base est joignable, 503 sinon. Aucun détail
 * technique (hôte, utilisateur, message PDO) n'est renvoyé au client :
 * le détail part dans le journal du serveur.
 */
final class SanteController
{
    /**
     * @param array<string, mixed> $config
     */
    public function __construct(private array $config)
    {
    }

    /**
     * @return array{status: int, body: array<string, string>}
     */
    public function verifier(): array
    {
        try {
            Database::connexion($this->config)->query('SELECT 1');

            return [
                'status' => 200,
                'body' => [
                    'statut' => 'ok',
                    'base' => 'ok',
                ],
            ];
        } catch (Throwable $e) {
            error_log('[sante] ' . $e->getMessage());

            return [
                'status' => 503,
                'body' => [
                    'statut' => 'erreur',
                    'base' => 'indisponible',
                ],
            ];
        }
    }
}
