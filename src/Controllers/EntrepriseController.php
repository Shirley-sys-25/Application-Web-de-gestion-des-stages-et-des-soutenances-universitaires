<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\AuthService;
use App\Services\EntrepriseService;

/**
 * Contrôleur du référentiel des entreprises.
 *
 * GET /api/entreprises : liste les entreprises proposées à l'étudiant
 * pour le formulaire de dépôt.
 */
final class EntrepriseController
{
    public function __construct(
        private EntrepriseService $service,
        private AuthService $auth
    ) {
    }

    /**
     * @return array{status: int, body: array<int, array{id: int, nom: string, ville: string}>}
     */
    public function lister(): array
    {
        $this->auth->exigerRole(['ETUDIANT']);

        return [
            'status' => 200,
            'body' => $this->service->lister(),
        ];
    }
}
