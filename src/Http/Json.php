<?php

declare(strict_types=1);

namespace App\Http;

use App\Exceptions\HttpException;
use JsonException;

/**
 * Lecture du corps JSON des requêtes.
 *
 * Un corps vide est accepté et renvoyé sous forme de tableau vide ; les
 * services décident ensuite quels champs sont obligatoires. Un JSON
 * malformé produit une erreur 400, jamais une erreur 500.
 */
final class Json
{
    /**
     * @return array<string, mixed>
     */
    public static function corps(): array
    {
        $brut = file_get_contents('php://input');

        if ($brut === false || trim($brut) === '') {
            return [];
        }

        try {
            $donnees = json_decode($brut, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            throw new HttpException(400, 'Corps JSON invalide.');
        }

        if (!is_array($donnees)) {
            throw new HttpException(400, 'Le corps de la requête doit être un objet JSON.');
        }

        return $donnees;
    }
}
