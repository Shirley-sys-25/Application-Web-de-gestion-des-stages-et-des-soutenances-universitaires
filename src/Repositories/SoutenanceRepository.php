<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

/**
 * Accès SQL aux soutenances.
 *
 * Toutes les valeurs passent par des paramètres nommés : une chaîne
 * comme « 1 OR 1=1 » reste une valeur, jamais du SQL.
 */
final class SoutenanceRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    /**
     * @return array<string, mixed>|null
     */
    public function findByDemandeId(int $demandeId): ?array
    {
        $requete = $this->pdo->prepare(
            'SELECT id, demande_id, date_heure, salle, duree_minutes
             FROM soutenance
             WHERE demande_id = :demande_id
             LIMIT 1'
        );
        $requete->execute([':demande_id' => $demandeId]);

        $ligne = $requete->fetch();

        return $ligne === false ? null : $ligne;
    }

    public function creneauExiste(string $dateHeure, string $salle): bool
    {
        $requete = $this->pdo->prepare(
            'SELECT 1
             FROM soutenance
             WHERE date_heure = :date_heure AND salle = :salle
             LIMIT 1'
        );
        $requete->execute([
            ':date_heure' => $dateHeure,
            ':salle' => $salle,
        ]);

        return $requete->fetchColumn() !== false;
    }

    /**
     * @param array{date_heure: string, salle: string, duree_minutes: int} $donnees
     */
    public function create(int $demandeId, array $donnees): int
    {
        $requete = $this->pdo->prepare(
            'INSERT INTO soutenance (demande_id, date_heure, salle, duree_minutes)
             VALUES (:demande_id, :date_heure, :salle, :duree_minutes)'
        );
        $requete->execute([
            ':demande_id' => $demandeId,
            ':date_heure' => $donnees['date_heure'],
            ':salle' => $donnees['salle'],
            ':duree_minutes' => $donnees['duree_minutes'],
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    /**
     * @return array<string, mixed>|null
     */
    public function findById(int $id): ?array
    {
        $requete = $this->pdo->prepare(
            'SELECT id, demande_id, date_heure, salle, duree_minutes
             FROM soutenance
             WHERE id = :id
             LIMIT 1'
        );
        $requete->execute([':id' => $id]);

        $ligne = $requete->fetch();

        return $ligne === false ? null : $ligne;
    }
}
