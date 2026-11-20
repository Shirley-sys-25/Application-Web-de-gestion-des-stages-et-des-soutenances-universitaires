<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Exceptions\HttpException;
use App\Http\Json;
use App\Security\Csrf;
use App\Services\AuthService;

/**
 * Routes d'authentification.
 *
 * POST /api/connexion   : ouvre une session (cookie HttpOnly).
 * POST /api/deconnexion : détruit la session.
 * GET  /api/moi         : renvoie l'utilisateur connecté.
 * GET  /api/csrf        : renvoie le jeton CSRF de la session.
 */
final class AuthController
{
    public function __construct(private AuthService $auth)
    {
    }

    /**
     * @return array{status: int, body: array<string, mixed>}
     */
    public function connexion(): array
    {
        $donnees = Json::corps();
        $email = $donnees['email'] ?? null;
        $motDePasse = $donnees['mot_de_passe'] ?? null;

        if (!is_string($email) || trim($email) === '') {
            throw new HttpException(400, 'Le champ email est obligatoire.');
        }

        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            throw new HttpException(400, 'Adresse email invalide.');
        }

        if (!is_string($motDePasse) || $motDePasse === '') {
            throw new HttpException(400, 'Le champ mot_de_passe est obligatoire.');
        }

        $utilisateur = $this->auth->connecter($email, $motDePasse);

        return [
            'status' => 200,
            'body' => [
                'utilisateur' => $utilisateur,
            ],
        ];
    }

    /**
     * @return array{status: int, body: array<string, mixed>}
     */
    public function deconnexion(): array
    {
        $this->auth->deconnecter();

        return [
            'status' => 200,
            'body' => [
                'message' => 'Déconnecté.',
            ],
        ];
    }

    /**
     * @return array{status: int, body: array<string, mixed>}
     */
    public function moi(): array
    {
        $utilisateur = $this->auth->courant();

        if ($utilisateur === null) {
            throw new HttpException(401, 'Authentification requise.');
        }

        return [
            'status' => 200,
            'body' => [
                'utilisateur' => $utilisateur,
            ],
        ];
    }

    /**
     * GET /api/csrf
     * Fournit le jeton synchronisé de la session courante.
     *
     * Route publique : le jeton n'est pas un secret d'authentification,
     * il est inutilisable par un site tiers qui ne peut pas le lire.
     *
     * @return array{status: int, body: array<string, string>}
     */
    public function csrf(): array
    {
        return [
            'status' => 200,
            'body' => [
                'csrf_token' => Csrf::jeton(),
            ],
        ];
    }
}
