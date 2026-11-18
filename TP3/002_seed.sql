-- =====================================================================
-- 002_seed.sql : jeu d'essai fictif (aucune donnee reelle)
-- 3 etudiants, 2 entreprises, 2 encadreurs, 4 demandes, 1 soutenance
-- =====================================================================

SET NAMES utf8mb4;

-- Les identifiants sont explicites pour que le jeu d'essai soit
-- reproductible et que 003_verification.sql affiche toujours les
-- memes comptages.
DELETE FROM soutenance;
DELETE FROM demande_stage;
DELETE FROM encadreur;
DELETE FROM entreprise;
DELETE FROM etudiant;
ALTER TABLE soutenance     AUTO_INCREMENT = 1;
ALTER TABLE demande_stage  AUTO_INCREMENT = 1;
ALTER TABLE encadreur      AUTO_INCREMENT = 1;
ALTER TABLE entreprise     AUTO_INCREMENT = 1;
ALTER TABLE etudiant       AUTO_INCREMENT = 1;

INSERT INTO etudiant (id, numero_etudiant, nom, prenom, email) VALUES
  (1, 'ETU-2026-001', 'ADJOVI', 'Koffi',  'koffi.adjovi@univ.test'),
  (2, 'ETU-2026-002', 'BELLO',  'Aicha',  'aicha.bello@univ.test'),
  (3, 'ETU-2026-003', 'DOSSOU', 'Marc',   'marc.dossou@univ.test');

INSERT INTO entreprise (id, nom, ville, contact) VALUES
  (1, 'Atelier Numerique', 'Cotonou', 'recrutement@atelier-numerique.test'),
  (2, 'Reseau Plus',       'Porto-Novo', 'stages@reseau-plus.test');

INSERT INTO encadreur (id, nom, prenom, grade, email) VALUES
  (1, 'HOUNKPATI', 'Lea',  'Maitre de conferences', 'lea.hounkpati@univ.test'),
  (2, 'SOSSOU',    'Paul', 'Assistant',             'paul.sossou@univ.test');

INSERT INTO demande_stage
  (id, etudiant_id, entreprise_id, encadreur_id, statut,
   motif_refus, date_depot, date_decision) VALUES
  (1, 1, 1, NULL, 'BROUILLON', NULL,
      '2026-11-10 09:15:00', NULL),
  (2, 2, 1, NULL, 'SOUMISE', NULL,
      '2026-11-11 14:00:00', NULL),
  (3, 3, 2, 1, 'VALIDEE', NULL,
      '2026-11-12 10:30:00', '2026-11-14 16:45:00'),
  (4, 1, 2, NULL, 'REFUSEE', 'Dossier incomplet : convention non signee.',
      '2026-11-13 08:20:00', '2026-11-15 11:10:00');

-- Une seule soutenance : elle porte sur la demande 3, la seule VALIDEE.
INSERT INTO soutenance (id, demande_id, date_heure, salle, duree_minutes) VALUES
  (1, 3, '2026-12-15 09:00:00', 'B12', 45);
