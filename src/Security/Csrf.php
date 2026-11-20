<?php

declare(strict_types=1);

namespace App\Security;

use App\Exceptions\HttpException;

/**
 * Protection CSRF par jeton synchronisé.
 *
 * Le jeton est stocké en session et envoyé au client par GET /api/csrf.
 * Le frontend le renvoie dans l'en-tête X-CSRF-Token pour toute écriture.
 * Un site tiers ne peut pas lire ce jeton (Same-Origin Policy), ni le
 * placer dans un en-tête personnalisé sans preflight CORS.
 *
 * Toutes les écritures sont protégées, y compris la connexion : le
 * formulaire de connexion récupère d'abord le jeton, puis le renvoie.
 * Les écritures sans session (hors connexion) laissent l'authentification
 * répondre 401, pour ne pas masquer l'absence de session par un 403.
 */
final class Csrf
{
    private const METHODES_ECRITURE = ['POST', 'PATCH', 'PUT', 'DELETE'];

    public static function initialiser(): string
    {
        if (
            !isset($_SESSION['csrf_token'])
            || !is_string($_SESSION['csrf_token'])
            || strlen($_SESSION['csrf_token']) < 32
        ) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }

        return $_SESSION['csrf_token'];
    }

    public static function jeton(): string
    {
        return self::initialiser();
    }

    /**
     * Vérifie le jeton avant une écriture.
     *
     * La connexion exige toujours le jeton. Les autres écritures sans
     * session utilisateur sont laissées à la couche d'authentification,
     * qui répond 401.
     */
    public static function verifierEcriture(string $methode, string $chemin): void
    {
        $methode = strtoupper($methode);

        if (!in_array($methode, self::METHODES_ECRITURE, true)) {
            return;
        }

        $estConnexion = $chemin === '/api/connexion';

        if (
            !$estConnexion
            && (!isset($_SESSION['utilisateur']) || !is_array($_SESSION['utilisateur']))
        ) {
            return;
        }

        $jeton = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';

        if (
            !is_string($jeton)
            || $jeton === ''
            || !hash_equals(self::jeton(), $jeton)
        ) {
            throw new HttpException(403, 'Jeton CSRF invalide ou absent.');
        }
    }
}
