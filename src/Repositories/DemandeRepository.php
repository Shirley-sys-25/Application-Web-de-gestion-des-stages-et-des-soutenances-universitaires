<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

/**
 * Seule couche autorisée à écrire du SQL pour les demandes de stage.
 *
 * Toutes les requêtes utilisent des paramètres nommés. Les jointures
 * renvoient des colonnes à plat ; DemandeService les transforme en
 * objets imbriqués pour l'API.
 */
final class DemandeRepository
{
    private const SELECT_BASE = <<<'SQL'
        SELECT d.id, d.statut, d.motif_refus, d.date_depot, d.date_decision,
               e.id AS etudiant_id, e.numero_etudiant,
               e.nom AS etudiant_nom, e.prenom AS etudiant_prenom,
               en.id AS entreprise_id, en.nom AS entreprise_nom,
               en.ville AS entreprise_ville,
               enc.id AS encadreur_id, enc.nom AS encadreur_nom,
               enc.prenom AS encadreur_prenom, enc.grade AS encadreur_grade
        FROM demande_stage d
        JOIN etudiant e ON e.id = d.etudiant_id
        JOIN entreprise en ON en.id = d.entreprise_id
        LEFT JOIN encadreur enc ON enc.id = d.encadreur_id
        SQL;

    public function __construct(private PDO $pdo)
    {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function findAll(?string $statut = null, ?string $q = null): array
    {
        $sql = self::SELECT_BASE;
        $conditions = [];
        $parametres = [];

        if ($statut !== null && $statut !== '') {
            $conditions[] = 'd.statut = :statut';
            $parametres[':statut'] = $statut;
        }

        if ($q !== null && $q !== '') {
            $conditions[] = '(e.nom LIKE :q1 OR e.prenom LIKE :q2 OR e.numero_etudiant LIKE :q3)';
            $motif = '%' . $q . '%';
            $parametres[':q1'] = $motif;
            $parametres[':q2'] = $motif;
            $parametres[':q3'] = $motif;
        }

        if ($conditions !== []) {
            $sql .= ' WHERE ' . implode(' AND ', $conditions);
        }

        $sql .= ' ORDER BY d.date_depot DESC, d.id DESC';

        $requete = $this->pdo->prepare($sql);
        $requete->execute($parametres);

        return $requete->fetchAll();
    }

    /**
     * @return array<string, mixed>|null
     */
    public function findById(int $id): ?array
    {
        $requete = $this->pdo->prepare(self::SELECT_BASE . ' WHERE d.id = :id LIMIT 1');
        $requete->execute([':id' => $id]);

        $ligne = $requete->fetch();

        return $ligne === false ? null : $ligne;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function findByStudent(int $etudiantId): array
    {
        $requete = $this->pdo->prepare(
            self::SELECT_BASE . ' WHERE d.etudiant_id = :etudiant_id ORDER BY d.date_depot DESC, d.id DESC'
        );
        $requete->execute([':etudiant_id' => $etudiantId]);

        return $requete->fetchAll();
    }

    /**
     * Verrouille la ligne de demande pour la durée de la transaction.
     *
     * @return array{id: int, statut: string}|null
     */
    public function verrouillerStatut(int $id): ?array
    {
        $requete = $this->pdo->prepare(
            'SELECT id, statut FROM demande_stage WHERE id = :id FOR UPDATE'
        );
        $requete->execute([':id' => $id]);

        $ligne = $requete->fetch();

        return $ligne === false ? null : $ligne;
    }

    /**
     * @param array<string, mixed> $donnees
     */
    public function create(array $donnees): int
    {
        $requete = $this->pdo->prepare(
            'INSERT INTO demande_stage
                (etudiant_id, entreprise_id, encadreur_id, statut, motif_refus, date_depot, date_decision)
             VALUES
                (:etudiant_id, :entreprise_id, NULL, :statut, NULL, NOW(), NULL)'
        );
        $requete->execute([
            ':etudiant_id' => (int) $donnees['etudiant_id'],
            ':entreprise_id' => (int) $donnees['entreprise_id'],
            ':statut' => (string) $donnees['statut'],
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    public function updateStatus(int $id, string $statut, ?string $motif): bool
    {
        $dateDecision = in_array($statut, ['VALIDEE', 'REFUSEE'], true) ? 'NOW()' : 'NULL';

        $requete = $this->pdo->prepare(
            'UPDATE demande_stage
             SET statut = :statut,
                 motif_refus = :motif,
                 date_decision = ' . $dateDecision . '
             WHERE id = :id'
        );
        $requete->execute([
            ':statut' => $statut,
            ':motif' => $motif,
            ':id' => $id,
        ]);

        return $requete->rowCount() > 0;
    }

    public function ajouterHistorique(
        int $demandeId,
        ?string $ancienStatut,
        string $nouveauStatut,
        ?string $motif,
        ?int $utilisateurId
    ): void {
        $requete = $this->pdo->prepare(
            'INSERT INTO historique_demande
                (demande_id, ancien_statut, nouveau_statut, motif, utilisateur_id, date_evenement)
             VALUES
                (:demande_id, :ancien_statut, :nouveau_statut, :motif, :utilisateur_id, NOW())'
        );
        $requete->execute([
            ':demande_id' => $demandeId,
            ':ancien_statut' => $ancienStatut,
            ':nouveau_statut' => $nouveauStatut,
            ':motif' => $motif,
            ':utilisateur_id' => $utilisateurId,
        ]);
    }
}
