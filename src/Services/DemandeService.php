<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\HttpException;
use App\Repositories\DemandeRepository;
use App\Repositories\EntrepriseRepository;
use PDO;
use Throwable;

/**
 * Règles métier des demandes de stage.
 *
 * Cette couche ne connaît ni HTTP ni SQL : elle valide les données,
 * applique la table des transitions et délimite les transactions. Les
 * erreurs métier sont portées par HttpException, traduite en JSON par
 * le point d'entrée.
 */
final class DemandeService
{
    private const STATUTS = ['BROUILLON', 'SOUMISE', 'VALIDEE', 'REFUSEE'];

    private const TRANSITIONS = [
        'BROUILLON' => ['SOUMISE'],
        'SOUMISE' => ['VALIDEE', 'REFUSEE'],
        'REFUSEE' => ['BROUILLON'],
        'VALIDEE' => [],
    ];

    public function __construct(
        private DemandeRepository $depot,
        private EntrepriseRepository $entreprises,
        private PDO $pdo
    ) {
    }

    public static function peutPasser(string $de, string $vers): bool
    {
        return in_array($vers, self::TRANSITIONS[$de] ?? [], true);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function lister(?string $statut = null, ?string $q = null): array
    {
        if ($statut !== null && $statut !== '' && !in_array($statut, self::STATUTS, true)) {
            throw new HttpException(400, 'Statut inconnu.');
        }

        if ($q !== null && strlen($q) > 100) {
            throw new HttpException(400, 'Le texte de recherche ne doit pas dépasser 100 caractères.');
        }

        return array_map(
            fn (array $ligne): array => $this->formater($ligne),
            $this->depot->findAll($statut, $q)
        );
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listerPourEtudiant(int $etudiantId): array
    {
        return array_map(
            fn (array $ligne): array => $this->formater($ligne),
            $this->depot->findByStudent($etudiantId)
        );
    }

    /**
     * @return array<string, mixed>|null
     */
    public function trouver(int $id): ?array
    {
        $ligne = $this->depot->findById($id);

        return $ligne === null ? null : $this->formater($ligne);
    }

    /**
     * @param array<string, mixed> $donnees
     * @return array<string, mixed>
     */
    public function creer(int $etudiantId, array $donnees): array
    {
        $entrepriseId = filter_var(
            $donnees['entreprise_id'] ?? null,
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 1]]
        );

        if ($entrepriseId === false) {
            throw new HttpException(400, 'Le champ entreprise_id doit être un entier positif.');
        }

        if (!$this->entreprises->exists((int) $entrepriseId)) {
            throw new HttpException(400, 'Entreprise inexistante.');
        }

        $this->pdo->beginTransaction();

        try {
            $id = $this->depot->create([
                'etudiant_id' => $etudiantId,
                'entreprise_id' => (int) $entrepriseId,
                'statut' => 'SOUMISE',
            ]);
            $this->depot->ajouterHistorique($id, null, 'SOUMISE', null, $etudiantId);
            $this->pdo->commit();
        } catch (Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            throw $e;
        }

        $demande = $this->depot->findById($id);

        if ($demande === null) {
            throw new HttpException(500, 'Demande créée mais introuvable.');
        }

        return $this->formater($demande);
    }

    /**
     * @return array<string, mixed>
     */
    public function changerStatut(
        int $id,
        string $decision,
        ?string $motif,
        int $utilisateurId
    ): array {
        $decision = strtoupper(trim($decision));

        if (!in_array($decision, ['VALIDEE', 'REFUSEE'], true)) {
            throw new HttpException(400, 'La décision doit être VALIDEE ou REFUSEE.');
        }

        $motif = $motif !== null ? trim($motif) : null;

        if ($decision === 'REFUSEE') {
            if ($motif === null || $motif === '') {
                throw new HttpException(400, 'Le motif est obligatoire pour un refus.');
            }

            if (strlen($motif) > 255) {
                throw new HttpException(400, 'Le motif ne doit pas dépasser 255 caractères.');
            }
        } else {
            if ($motif !== null && $motif !== '') {
                throw new HttpException(400, 'Un motif est interdit pour une validation.');
            }

            $motif = null;
        }

        $this->pdo->beginTransaction();

        try {
            $demandeCourante = $this->depot->verrouillerStatut($id);

            if ($demandeCourante === null) {
                throw new HttpException(404, 'Demande introuvable.');
            }

            $ancienStatut = (string) $demandeCourante['statut'];

            if (!self::peutPasser($ancienStatut, $decision)) {
                throw new HttpException(409, 'Transition de statut interdite.');
            }

            $this->depot->updateStatus($id, $decision, $motif);
            $this->depot->ajouterHistorique(
                $id,
                $ancienStatut,
                $decision,
                $motif,
                $utilisateurId
            );
            $this->pdo->commit();
        } catch (Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            throw $e;
        }

        $demande = $this->depot->findById($id);

        if ($demande === null) {
            throw new HttpException(500, 'Demande introuvable après mise à jour.');
        }

        return $this->formater($demande);
    }

    /**
     * @param array<string, mixed> $ligne
     * @return array<string, mixed>
     */
    private function formater(array $ligne): array
    {
        return [
            'id' => (int) $ligne['id'],
            'etudiant' => [
                'id' => (int) $ligne['etudiant_id'],
                'numero_etudiant' => (string) $ligne['numero_etudiant'],
                'nom' => (string) $ligne['etudiant_nom'],
                'prenom' => (string) $ligne['etudiant_prenom'],
            ],
            'entreprise' => [
                'id' => (int) $ligne['entreprise_id'],
                'nom' => (string) $ligne['entreprise_nom'],
                'ville' => (string) $ligne['entreprise_ville'],
            ],
            'encadreur' => $ligne['encadreur_id'] !== null
                ? [
                    'id' => (int) $ligne['encadreur_id'],
                    'nom' => (string) $ligne['encadreur_nom'],
                    'prenom' => (string) $ligne['encadreur_prenom'],
                    'grade' => (string) $ligne['encadreur_grade'],
                ]
                : null,
            'statut' => (string) $ligne['statut'],
            'motif_refus' => $ligne['motif_refus'] !== null ? (string) $ligne['motif_refus'] : null,
            'date_depot' => (string) $ligne['date_depot'],
            'date_decision' => $ligne['date_decision'] !== null ? (string) $ligne['date_decision'] : null,
        ];
    }
}
