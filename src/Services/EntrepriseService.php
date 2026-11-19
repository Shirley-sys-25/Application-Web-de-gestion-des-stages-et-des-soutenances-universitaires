<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\EntrepriseRepository;

/**
 * Lecture du référentiel des entreprises partenaires.
 *
 * Cette route a été ajoutée au TP7 pour alimenter le sélecteur du
 * formulaire de dépôt : le contrat TP4 ne prévoyait que la création
 * d'une demande à partir d'un identifiant d'entreprise.
 */
final class EntrepriseService
{
    public function __construct(private EntrepriseRepository $entreprises)
    {
    }

    /**
     * @return array<int, array{id: int, nom: string, ville: string}>
     */
    public function lister(): array
    {
        return $this->entreprises->findAll();
    }
}
