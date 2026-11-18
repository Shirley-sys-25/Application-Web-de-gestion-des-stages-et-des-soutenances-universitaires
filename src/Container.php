<?php

declare(strict_types=1);

namespace App;

use App\Controllers\AuthController;
use App\Controllers\DemandeController;
use App\Controllers\SanteController;
use App\Repositories\DemandeRepository;
use App\Repositories\EntrepriseRepository;
use App\Repositories\UtilisateurRepository;
use App\Services\AuthService;
use App\Services\DemandeService;
use PDO;

/**
 * Petite fabrique de dépendances, sans framework.
 *
 * La connexion PDO est créée à la demande : la page d'accueil et les
 * routes inconnues restent accessibles même si la base est arrêtée.
 */
final class Container
{
    private ?PDO $pdo = null;

    /**
     * @param array<string, mixed> $config
     */
    public function __construct(private array $config)
    {
    }

    public function pdo(): PDO
    {
        return $this->pdo ??= Database::connexion($this->config);
    }

    public function authService(): AuthService
    {
        return new AuthService(new UtilisateurRepository($this->pdo()));
    }

    public function authController(): AuthController
    {
        return new AuthController($this->authService());
    }

    public function demandeController(): DemandeController
    {
        $pdo = $this->pdo();

        return new DemandeController(
            new DemandeService(
                new DemandeRepository($pdo),
                new EntrepriseRepository($pdo),
                $pdo
            ),
            $this->authService()
        );
    }

    public function santeController(): SanteController
    {
        return new SanteController($this->config);
    }
}
