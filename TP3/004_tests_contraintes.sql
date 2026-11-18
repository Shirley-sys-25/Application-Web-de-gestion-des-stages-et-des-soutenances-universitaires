-- =====================================================================
-- 004_tests_contraintes.sql : preuve que la base refuse les donnees
-- incoherentes, meme si le code applicatif oublie de le verifier.
--
-- Executer avec --force pour que le client continue apres chaque
-- erreur attendue :
--   mariadb --force -u root -t stages < 004_tests_contraintes.sql
-- Chaque bloc doit produire une erreur, sauf le test 7 (accepte).
-- =====================================================================

SET NAMES utf8mb4;

-- Test 1 : refus sans motif -> ck_demande_motif
INSERT INTO demande_stage
  (etudiant_id, entreprise_id, statut, motif_refus, date_decision)
VALUES (2, 2, 'REFUSEE', NULL, NOW());

-- Test 2 : statut hors enumeration -> ck_demande_statut
INSERT INTO demande_stage
  (etudiant_id, entreprise_id, statut, motif_refus, date_depot)
VALUES (2, 2, 'EN_ATTENTE', NULL, NOW());

-- Test 3 : entreprise inexistante -> fk_demande_entreprise
INSERT INTO demande_stage
  (etudiant_id, entreprise_id, statut, date_depot)
VALUES (2, 99, 'BROUILLON', NOW());

-- Test 4 : email deja utilise -> uk_etudiant_email
INSERT INTO etudiant (numero_etudiant, nom, prenom, email)
VALUES ('ETU-2026-004', 'TEST', 'Doublon', 'koffi.adjovi@univ.test');

-- Test 5 : deuxieme soutenance pour la demande 3 -> uk_soutenance_demande
INSERT INTO soutenance (demande_id, date_heure, salle, duree_minutes)
VALUES (3, '2026-12-16 09:00:00', 'B12', 45);

-- Test 6 : meme creneau, meme salle -> uk_soutenance_creneau
INSERT INTO soutenance (demande_id, date_heure, salle, duree_minutes)
VALUES (4, '2026-12-15 09:00:00', 'B12', 45);

-- Test 7 : duree hors bornes -> ck_soutenance_duree
INSERT INTO soutenance (demande_id, date_heure, salle, duree_minutes)
VALUES (4, '2026-12-17 09:00:00', 'B12', 500);

-- Test 8 (doit etre ACCEPTE) : meme creneau, autre salle.
-- La contrainte porte sur le couple (date_heure, salle), pas sur l'heure.
INSERT INTO soutenance (demande_id, date_heure, salle, duree_minutes)
VALUES (4, '2026-12-15 09:00:00', 'B14', 45);

-- Nettoyage du test 8 pour laisser la base dans son etat initial.
DELETE FROM soutenance WHERE salle = 'B14';

-- Controle final : les comptages n'ont pas bouge (4 demandes, 1 soutenance).
SELECT 'demande_stage' AS table_, COUNT(*) AS lignes FROM demande_stage
UNION ALL SELECT 'soutenance', COUNT(*) FROM soutenance
UNION ALL SELECT 'etudiant',   COUNT(*) FROM etudiant;
