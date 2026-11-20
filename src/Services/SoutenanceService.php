<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\HttpException;
use App\Repositories\DemandeRepository;
use App\Repositories\SoutenanceRepository;
use DateTimeImmutable;
use PDO;
use PDOException;
use Throwable;

/**
 * Règles métier de la programmation d'une soutenance (EF-05).
 *
 * La date est validée avant tout accès à la base : une date inexistante
 * comme le 30 février doit produire un 400, même si la demande est déjà
 * programmée. Les contrôles d'état et les contraintes UNIQUE de la base
 * complètent la validation.
 */
final class SoutenanceService
{
    public function __construct(
        private DemandeRepository $demandes,
        private SoutenanceRepository $soutenances,
        private PDO $pdo
    ) {
    }

    /**
     * @param array<string, mixed> $donnees
     * @return array<string, mixed>
     */
    public function programmer(array $donnees): array
    {
        $demandeId = filter_var(
            $donnees['demande_id'] ?? null,
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 1]]
        );

        if ($demandeId === false) {
            throw new HttpException(400, 'Le champ demande_id doit être un entier positif.');
        }

        $dateHeure = $this->validerDate($donnees['date_heure'] ?? null);
        $salle = $this->validerSalle($donnees['salle'] ?? null);
        $duree = $this->validerDuree($donnees['duree_minutes'] ?? 45);

        $this->pdo->beginTransaction();

        try {
            $demande = $this->demandes->findById((int) $demandeId);

            if ($demande === null) {
                throw new HttpException(404, 'Demande introuvable.');
            }

            if ((string) $demande['statut'] !== 'VALIDEE') {
                throw new HttpException(409, 'La demande doit être validée avant la programmation.');
            }

            if ($this->soutenances->findByDemandeId((int) $demandeId) !== null) {
                throw new HttpException(409, 'Cette demande a déjà une soutenance.');
            }

            if ($this->soutenances->creneauExiste($dateHeure, $salle)) {
                throw new HttpException(409, 'Ce créneau est déjà occupé dans cette salle.');
            }

            $id = $this->soutenances->create((int) $demandeId, [
                'date_heure' => $dateHeure,
                'salle' => $salle,
                'duree_minutes' => $duree,
            ]);

            $this->pdo->commit();
        } catch (HttpException $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            throw $e;
        } catch (PDOException $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            // 23000 = violation de contrainte (demande ou créneau déjà pris).
            if ((string) $e->getCode() === '23000') {
                throw new HttpException(409, 'Cette demande ou ce créneau est déjà programmé.');
            }

            throw $e;
        } catch (Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            throw $e;
        }

        $soutenance = $this->soutenances->findById($id);

        if ($soutenance === null) {
            throw new HttpException(500, 'Soutenance créée mais introuvable.');
        }

        return $this->formater($soutenance);
    }

    private function validerDate(mixed $valeur): string
    {
        if (!is_string($valeur) || trim($valeur) === '') {
            throw new HttpException(400, 'Le champ date_heure est obligatoire.');
        }

        $dateHeure = trim($valeur);
        $date = DateTimeImmutable::createFromFormat('!Y-m-d H:i:s', $dateHeure);
        $erreurs = DateTimeImmutable::getLastErrors();

        if (
            $date === false
            || ($erreurs !== false && ($erreurs['warning_count'] > 0 || $erreurs['error_count'] > 0))
            || $date->format('Y-m-d H:i:s') !== $dateHeure
        ) {
            throw new HttpException(400, 'Date de soutenance invalide.');
        }

        return $dateHeure;
    }

    private function validerSalle(mixed $valeur): string
    {
        if (!is_string($valeur) || trim($valeur) === '') {
            throw new HttpException(400, 'Le champ salle est obligatoire.');
        }

        $salle = trim($valeur);

        if (strlen($salle) > 20) {
            throw new HttpException(400, 'La salle ne doit pas dépasser 20 caractères.');
        }

        return $salle;
    }

    private function validerDuree(mixed $valeur): int
    {
        if (is_int($valeur)) {
            $duree = $valeur;
        } elseif (is_string($valeur) && ctype_digit($valeur)) {
            $duree = (int) $valeur;
        } else {
            throw new HttpException(400, 'La durée doit être un entier entre 15 et 240 minutes.');
        }

        if ($duree < 15 || $duree > 240) {
            throw new HttpException(400, 'La durée doit être comprise entre 15 et 240 minutes.');
        }

        return $duree;
    }

    /**
     * @param array<string, mixed> $ligne
     * @return array<string, mixed>
     */
    private function formater(array $ligne): array
    {
        return [
            'id' => (int) $ligne['id'],
            'demande_id' => (int) $ligne['demande_id'],
            'date_heure' => (string) $ligne['date_heure'],
            'salle' => (string) $ligne['salle'],
            'duree_minutes' => (int) $ligne['duree_minutes'],
        ];
    }
}
