<?php

declare(strict_types=1);

namespace App\Controllers;

/**
 * Contrôleur des demandes de stage.
 *
 * Le TP4 ne demande que le squelette et le contrat des routes : les trois
 * routes métier répondent volontairement 501 (Not Implemented). Elles
 * seront branchées sur DemandeService au TP6, avec l'authentification et
 * les règles de transition de statut.
 */
final class DemandeController
{
    /**
     * GET /api/demandes
     *
     * @return array{status: int, body: array<string, string>}
     */
    public function lister(): array
    {
        // TP6 : return ['status' => 200, 'body' => $this->service->lister()];
        return $this->nonImplemente();
    }

    /**
     * POST /api/demandes
     *
     * @return array{status: int, body: array<string, string>}
     */
    public function creer(): array
    {
        // TP6 : lire le JSON, valider, puis appeler $this->service->creer().
        return $this->nonImplemente();
    }

    /**
     * PATCH /api/demandes/{id}/statut
     *
     * @return array{status: int, body: array<string, string>}
     */
    public function changerStatut(int $id): array
    {
        // TP6 : vérifier le rôle, la transition, puis appeler le service.
        return $this->nonImplemente();
    }

    /**
     * @return array{status: int, body: array<string, string>}
     */
    private function nonImplemente(): array
    {
        return [
            'status' => 501,
            'body' => [
                'erreur' => 'Route prévue au TP6 (API des demandes).',
            ],
        ];
    }
}
