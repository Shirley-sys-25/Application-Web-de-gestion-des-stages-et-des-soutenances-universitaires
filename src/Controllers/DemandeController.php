<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Exceptions\HttpException;
use App\Http\Json;
use App\Services\AuthService;
use App\Services\DemandeService;

/**
 * Contrôleur des demandes de stage.
 *
 * Il traduit HTTP vers le service : lecture des paramètres, contrôle du
 * rôle, choix du format de réponse. Aucune requête SQL ici.
 */
final class DemandeController
{
    public function __construct(
        private DemandeService $service,
        private AuthService $auth
    ) {
    }

    /**
     * GET /api/demandes
     * Réservé au responsable pédagogique et à l'administrateur.
     *
     * @return array{status: int, body: array<int, array<string, mixed>>}
     */
    public function lister(): array
    {
        $this->auth->exigerRole(['RESPONSABLE', 'ADMINISTRATEUR']);

        $statut = $_GET['statut'] ?? null;
        $q = $_GET['q'] ?? null;

        if ($statut !== null && !is_string($statut)) {
            throw new HttpException(400, 'Le paramètre statut est invalide.');
        }

        if ($q !== null && !is_string($q)) {
            throw new HttpException(400, 'Le paramètre q est invalide.');
        }

        $q = $q !== null ? trim($q) : null;

        return [
            'status' => 200,
            'body' => $this->service->lister($statut, $q === '' ? null : $q),
        ];
    }

    /**
     * GET /api/demandes/mes-demandes
     * Réservé à l'étudiant connecté.
     *
     * @return array{status: int, body: array<int, array<string, mixed>>}
     */
    public function mesDemandes(): array
    {
        $utilisateur = $this->auth->exigerRole(['ETUDIANT']);
        $etudiantId = $utilisateur['etudiant_id'];

        if ($etudiantId === null) {
            throw new HttpException(403, 'Ce compte étudiant n’est relié à aucun dossier.');
        }

        return [
            'status' => 200,
            'body' => $this->service->listerPourEtudiant($etudiantId),
        ];
    }

    /**
     * POST /api/demandes
     * Réservé à l'étudiant connecté.
     *
     * @return array{status: int, body: array<string, mixed>}
     */
    public function creer(): array
    {
        $utilisateur = $this->auth->exigerRole(['ETUDIANT']);
        $etudiantId = $utilisateur['etudiant_id'];

        if ($etudiantId === null) {
            throw new HttpException(403, 'Ce compte étudiant n’est relié à aucun dossier.');
        }

        $demande = $this->service->creer($etudiantId, Json::corps());

        return [
            'status' => 201,
            'body' => [
                'id' => $demande['id'],
                'statut' => $demande['statut'],
                'date_depot' => $demande['date_depot'],
            ],
        ];
    }

    /**
     * PATCH /api/demandes/{id}/statut
     * Réservé au responsable pédagogique et à l'administrateur.
     *
     * @return array{status: int, body: array<string, mixed>}
     */
    public function changerStatut(int $id): array
    {
        $utilisateur = $this->auth->exigerRole(['RESPONSABLE', 'ADMINISTRATEUR']);
        $donnees = Json::corps();

        $decision = $donnees['decision'] ?? null;
        $motif = $donnees['motif'] ?? null;

        if (!is_string($decision) || trim($decision) === '') {
            throw new HttpException(400, 'Le champ decision est obligatoire.');
        }

        if ($motif !== null && !is_string($motif)) {
            throw new HttpException(400, 'Le champ motif doit être une chaîne de caractères.');
        }

        $demande = $this->service->changerStatut(
            $id,
            $decision,
            $motif,
            (int) $utilisateur['id']
        );

        return [
            'status' => 200,
            'body' => [
                'id' => $demande['id'],
                'statut' => $demande['statut'],
                'motif_refus' => $demande['motif_refus'],
                'date_decision' => $demande['date_decision'],
            ],
        ];
    }
}
