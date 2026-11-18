<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

/**
 * Accès aux comptes de connexion.
 *
 * Le hachage est lu uniquement par AuthService, qui appelle
 * password_verify(). Il n'est jamais renvoyé au client.
 */
final class UtilisateurRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    /**
     * @return array<string, mixed>|null
     */
    public function findByEmail(string $email): ?array
    {
        $requete = $this->pdo->prepare(
            'SELECT u.id, u.email, u.mot_de_passe_hash, u.role, u.etudiant_id,
                    u.actif, e.nom, e.prenom
             FROM utilisateur u
             LEFT JOIN etudiant e ON e.id = u.etudiant_id
             WHERE u.email = :email
             LIMIT 1'
        );
        $requete->execute([':email' => $email]);

        $ligne = $requete->fetch();

        return $ligne === false ? null : $ligne;
    }
}
