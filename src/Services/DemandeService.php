<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\DemandeRepository;
use LogicException;

/**
 * Règles métier des demandes de stage.
 *
 * Cette couche ne connaît ni HTTP ni SQL. Elle sera complétée au TP6 :
 * validation des données, table des transitions, authentification et
 * transaction de validation.
 */
final class DemandeService
{
    public function __construct(private DemandeRepository $depot)
    {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function lister(): array
    {
        throw new LogicException('À implémenter au TP6.');
    }

    /**
     * @param array<string, mixed> $donnees
     */
    public function creer(array $donnees): int
    {
        throw new LogicException('À implémenter au TP6.');
    }

    /**
     * @return array<string, mixed>
     */
    public function changerStatut(int $id, string $decision, ?string $motif): array
    {
        throw new LogicException('À implémenter au TP6.');
    }
}
