<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

/**
 * Vérification de l'existence d'une entreprise avant la création d'une
 * demande. La clé étrangère protège aussi la base, mais un contrôle
 * explicite permet de renvoyer 400 au lieu d'une erreur SQL 500.
 */
final class EntrepriseRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    public function exists(int $id): bool
    {
        $requete = $this->pdo->prepare('SELECT 1 FROM entreprise WHERE id = :id LIMIT 1');
        $requete->execute([':id' => $id]);

        return $requete->fetchColumn() !== false;
    }
}
