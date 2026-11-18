-- =====================================================================
-- 002_seed_tp6.sql : comptes fictifs et historique de demonstration
-- A executer apres TP6/001_schema_tp6.sql.
-- Mots de passe locaux (fictifs) :
--   etudiant1@univ.test / etudiant123
--   etudiant2@univ.test / etudiant123
--   etudiant3@univ.test / etudiant123
--   responsable@univ.test / responsable123
--   admin@univ.test / admin123
--   developpeur@univ.test / developpeur123
-- =====================================================================

SET NAMES utf8mb4;

DELETE FROM historique_demande;
DELETE FROM utilisateur;
ALTER TABLE historique_demande AUTO_INCREMENT = 1;
ALTER TABLE utilisateur        AUTO_INCREMENT = 1;

INSERT INTO utilisateur
  (id, email, mot_de_passe_hash, role, etudiant_id, actif) VALUES
  (1, 'etudiant1@univ.test',
      '$2y$12$qSfHqtE8nAq4Hu4VeLN.W..dablx3GNQeNT7VjwZuzRARVAJqeRb.',
      'ETUDIANT', 1, 1),
  (2, 'etudiant2@univ.test',
      '$2y$12$YUdYrVq6yCon.oOaidcT9u2R/skgEtUWItgv3djeTgcobaU7PPMAW',
      'ETUDIANT', 2, 1),
  (3, 'etudiant3@univ.test',
      '$2y$12$R8oqVtwM.JwoE4X593txO.BqCQuRTluMdnEsklvPSKyV1NVwGphAO',
      'ETUDIANT', 3, 1),
  (4, 'responsable@univ.test',
      '$2y$12$sUvoiXPRJkQkwykCdw3inOJZDijiVedgj432SQtP6oS9IbXf.QUIW',
      'RESPONSABLE', NULL, 1),
  (5, 'admin@univ.test',
      '$2y$12$a2wjFnnleUkTdLAa9k9.Uu.rMW2qjgb/GCDOzj4N8JAM5okrnLzEm',
      'ADMINISTRATEUR', NULL, 1),
  (6, 'developpeur@univ.test',
      '$2y$12$hKE73ko8LrG8BLV4hPawXuAa1kk.W511vrhOiqTbNQlq8kTd0hvBq',
      'DEVELOPPEUR', NULL, 1);

-- Historique coherent avec les quatre demandes du jeu d'essai TP3.
INSERT INTO historique_demande
  (demande_id, ancien_statut, nouveau_statut, motif, utilisateur_id, date_evenement) VALUES
  (1, NULL,         'BROUILLON', NULL, 1, '2026-11-10 09:15:00'),
  (2, NULL,         'BROUILLON', NULL, 2, '2026-11-11 14:00:00'),
  (2, 'BROUILLON',  'SOUMISE',   NULL, 2, '2026-11-11 14:05:00'),
  (3, NULL,         'BROUILLON', NULL, 3, '2026-11-12 10:30:00'),
  (3, 'BROUILLON',  'SOUMISE',   NULL, 3, '2026-11-12 10:35:00'),
  (3, 'SOUMISE',    'VALIDEE',   NULL, 4, '2026-11-14 16:45:00'),
  (4, NULL,         'BROUILLON', NULL, 1, '2026-11-13 08:20:00'),
  (4, 'BROUILLON',  'SOUMISE',   NULL, 1, '2026-11-13 08:25:00'),
  (4, 'SOUMISE',    'REFUSEE',   'Dossier incomplet : convention non signee.',
      4, '2026-11-15 11:10:00');
