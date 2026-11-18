<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\HttpException;
use App\Repositories\UtilisateurRepository;

/**
 * Authentification par session.
 *
 * Le mot de passe est vérifié avec password_verify(). En cas de succès,
 * l'identifiant de session est régénéré pour éviter la fixation de
 * session. Le message d'échec est identique pour un compte inconnu et
 * pour un mot de passe faux.
 */
final class AuthService
{
    public function __construct(private UtilisateurRepository $utilisateurs)
    {
    }

    /**
     * @return array{id: int, email: string, role: string, etudiant_id: int|null, nom: string|null, prenom: string|null}
     */
    public function connecter(string $email, string $motDePasse): array
    {
        $email = strtolower(trim($email));
        $utilisateur = $this->utilisateurs->findByEmail($email);

        if (
            $utilisateur === null
            || (int) $utilisateur['actif'] !== 1
            || !password_verify($motDePasse, (string) $utilisateur['mot_de_passe_hash'])
        ) {
            throw new HttpException(401, 'Identifiants invalides.');
        }

        if (session_status() === PHP_SESSION_ACTIVE) {
            session_regenerate_id(true);
        }

        $session = [
            'id' => (int) $utilisateur['id'],
            'email' => (string) $utilisateur['email'],
            'role' => (string) $utilisateur['role'],
            'etudiant_id' => $utilisateur['etudiant_id'] !== null
                ? (int) $utilisateur['etudiant_id']
                : null,
            'nom' => $utilisateur['nom'] !== null ? (string) $utilisateur['nom'] : null,
            'prenom' => $utilisateur['prenom'] !== null ? (string) $utilisateur['prenom'] : null,
        ];

        $_SESSION['utilisateur'] = $session;

        return $session;
    }

    public function deconnecter(): void
    {
        $_SESSION = [];

        if (session_status() !== PHP_SESSION_ACTIVE) {
            return;
        }

        if ((bool) ini_get('session.use_cookies')) {
            $parametres = session_get_cookie_params();
            setcookie(session_name(), '', [
                'expires' => time() - 42000,
                'path' => $parametres['path'],
                'domain' => $parametres['domain'],
                'secure' => (bool) $parametres['secure'],
                'httponly' => (bool) $parametres['httponly'],
                'samesite' => $parametres['samesite'] ?? 'Lax',
            ]);
        }

        session_destroy();
    }

    /**
     * @return array{id: int, email: string, role: string, etudiant_id: int|null, nom: string|null, prenom: string|null}|null
     */
    public function courant(): ?array
    {
        $utilisateur = $_SESSION['utilisateur'] ?? null;

        return is_array($utilisateur) ? $utilisateur : null;
    }

    /**
     * @param list<string> $roles
     * @return array{id: int, email: string, role: string, etudiant_id: int|null, nom: string|null, prenom: string|null}
     */
    public function exigerRole(array $roles): array
    {
        $utilisateur = $this->courant();

        if ($utilisateur === null) {
            throw new HttpException(401, 'Authentification requise.');
        }

        if (!in_array($utilisateur['role'], $roles, true)) {
            throw new HttpException(403, 'Accès interdit.');
        }

        return $utilisateur;
    }
}
