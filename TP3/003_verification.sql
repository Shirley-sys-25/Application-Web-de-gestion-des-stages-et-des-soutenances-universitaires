-- =====================================================================
-- 003_verification.sql : controle du chargement par COUNT(*)
-- Executer avec l'option -t pour obtenir des tableaux lisibles :
--   mariadb -u root -t stages < 003_verification.sql
-- =====================================================================

SET NAMES utf8mb4;

-- 1. Nombre de lignes par table (attendu : 3, 2, 2, 4, 1)
SELECT 'etudiant' AS table_, COUNT(*) AS lignes FROM etudiant
UNION ALL SELECT 'entreprise',    COUNT(*) FROM entreprise
UNION ALL SELECT 'encadreur',     COUNT(*) FROM encadreur
UNION ALL SELECT 'demande_stage', COUNT(*) FROM demande_stage
UNION ALL SELECT 'soutenance',    COUNT(*) FROM soutenance;

-- 2. Repartition des demandes par statut (4 statuts, 1 demande chacun)
SELECT statut, COUNT(*) AS demandes
FROM demande_stage
GROUP BY statut
ORDER BY FIELD(statut, 'BROUILLON', 'SOUMISE', 'VALIDEE', 'REFUSEE');

-- 3. Vue d'ensemble des demandes
SELECT d.id,
       e.nom AS etudiant,
       en.nom AS entreprise,
       d.statut,
       COALESCE(CONCAT(c.prenom, ' ', c.nom), '-') AS encadreur
FROM demande_stage d
JOIN etudiant e     ON e.id  = d.etudiant_id
JOIN entreprise en  ON en.id = d.entreprise_id
LEFT JOIN encadreur c ON c.id = d.encadreur_id
ORDER BY d.id;

-- 4. Planning des soutenances
SELECT * FROM v_planning_soutenances;

-- 5. Demandes validees sans encadreur (attendu : 0)
SELECT COUNT(*) AS dossiers_sans_encadreur
FROM demande_stage
WHERE statut = 'VALIDEE' AND encadreur_id IS NULL;

-- 6. Regles metier verifiees sur les donnees chargees (attendu : 0 partout)
SELECT
  SUM(statut = 'REFUSEE' AND motif_refus IS NULL)          AS refus_sans_motif,
  SUM(statut IN ('VALIDEE', 'REFUSEE') AND date_decision IS NULL)
                                                            AS decision_sans_date
FROM demande_stage;
