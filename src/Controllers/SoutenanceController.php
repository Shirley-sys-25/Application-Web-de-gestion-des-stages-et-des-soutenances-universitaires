<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Http\Json;
use App\Services\AuthService;
use App\Services\SoutenanceService;

/**
 * Programmation des soutenances (EF-05).
 *
 * Route minimale ajoutée au TP8 pour que le cas limite « date invalide »
 * soit vérifié au niveau HTTP, avec un vrai code 400.
 */
final class SoutenanceController
{
    public function __construct(
        private SoutenanceService $service,
        private AuthService $auth
    ) {
    }

    /**
     * POST /api/soutenances
     * Réservé au responsable pédagogique et à l'administrateur.
     *
     * @return array{status: int, body: array<string, mixed>}
     */
    public function creer(): array
    {
        $this->auth->exigerRole(['RESPONSABLE', 'ADMINISTRATEUR']);

        return [
            'status' => 201,
            'body' => $this->service->programmer(Json::corps()),
        ];
    }
}
