<?php

declare(strict_types=1);

namespace App\Repositories;

use LogicException;
use PDO;

/**
 * Seule couche autorisée à écrire du SQL.
 *
 * Les signatures sont posées au TP4 ; les requêtes préparées seront
 * écrites au TP6. Exemple de requête préparée attendue :
 *
 *   $requete = $this->pdo->prepare('SELECT * FROM demande_stage WHERE id = :id');
 *   $requete->execute([':id' => $id]);
 *   return $requete->fetch() ?: null;
 */
final class DemandeRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function findAll(): array
    {
        throw new LogicException('À implémenter au TP6.');
    }

    /**
     * @return array<string, mixed>|null
     */
    public function findById(int $id): ?array
    {
        throw new LogicException('À implémenter au TP6.');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function findByStudent(int $etudiantId): array
    {
        throw new LogicException('À implémenter au TP6.');
    }

    /**
     * @param array<string, mixed> $donnees
     */
    public function create(array $donnees): int
    {
        throw new LogicException('À implémenter au TP6.');
    }

    public function updateStatus(int $id, string $statut, ?string $motif): bool
    {
        throw new LogicException('À implémenter au TP6.');
    }
}
