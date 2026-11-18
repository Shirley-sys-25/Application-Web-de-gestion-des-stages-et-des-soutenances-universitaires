-- =====================================================================
-- Projet informatique 2 - L3 SIL
-- TP3 : modele UML et schema SQL
-- 001_schema.sql : creation des cinq tables du fil rouge
-- SGBD : MySQL 8 / MariaDB 10.6+ (InnoDB, utf8mb4)
-- Rejouable : les tables sont supprimees dans l'ordre inverse des
-- dependances avant d'etre creees.
-- =====================================================================

SET NAMES utf8mb4;

DROP VIEW IF EXISTS v_planning_soutenances;
DROP TABLE IF EXISTS soutenance;
DROP TABLE IF EXISTS demande_stage;
DROP TABLE IF EXISTS encadreur;
DROP TABLE IF EXISTS entreprise;
DROP TABLE IF EXISTS etudiant;

-- ---------------------------------------------------------------------
-- Etudiant : 1 etudiant depose 1..* demandes
-- ---------------------------------------------------------------------
CREATE TABLE etudiant (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  numero_etudiant VARCHAR(20)  NOT NULL,
  nom             VARCHAR(60)  NOT NULL,
  prenom          VARCHAR(60)  NOT NULL,
  email           VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_etudiant_numero (numero_etudiant),
  UNIQUE KEY uk_etudiant_email  (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Entreprise : 1 entreprise accueille 1..* demandes
-- ---------------------------------------------------------------------
CREATE TABLE entreprise (
  id      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom     VARCHAR(80)  NOT NULL,
  ville   VARCHAR(60)  NOT NULL,
  contact VARCHAR(100) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_entreprise_nom_ville (nom, ville)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Encadreur : 0..1 encadreur pour une demande (affectation optionnelle)
-- ---------------------------------------------------------------------
CREATE TABLE encadreur (
  id     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom    VARCHAR(60)  NOT NULL,
  prenom VARCHAR(60)  NOT NULL,
  grade  VARCHAR(60)  NOT NULL,
  email  VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_encadreur_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- DemandeStage : association entre un etudiant et une entreprise.
-- Les deux cles etrangeres sont NOT NULL : une demande a exactement
-- un etudiant et une entreprise. encadreur_id reste NULL tant que
-- l'affectation n'a pas eu lieu (multiplicite 0..1).
-- ---------------------------------------------------------------------
CREATE TABLE demande_stage (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  etudiant_id   INT UNSIGNED NOT NULL,
  entreprise_id INT UNSIGNED NOT NULL,
  encadreur_id  INT UNSIGNED NULL,
  statut        VARCHAR(10)  NOT NULL DEFAULT 'BROUILLON',
  motif_refus   VARCHAR(255) NULL,
  date_depot    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_decision DATETIME     NULL,
  PRIMARY KEY (id),
  KEY idx_demande_etudiant   (etudiant_id),
  KEY idx_demande_entreprise (entreprise_id),
  KEY idx_demande_encadreur  (encadreur_id),
  KEY idx_demande_statut     (statut),
  CONSTRAINT fk_demande_etudiant FOREIGN KEY (etudiant_id)
    REFERENCES etudiant (id) ON UPDATE CASCADE,
  CONSTRAINT fk_demande_entreprise FOREIGN KEY (entreprise_id)
    REFERENCES entreprise (id) ON UPDATE CASCADE,
  CONSTRAINT fk_demande_encadreur FOREIGN KEY (encadreur_id)
    REFERENCES encadreur (id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT ck_demande_statut
    CHECK (statut IN ('BROUILLON', 'SOUMISE', 'VALIDEE', 'REFUSEE')),
  CONSTRAINT ck_demande_motif
    CHECK (statut <> 'REFUSEE' OR motif_refus IS NOT NULL),
  CONSTRAINT ck_demande_decision
    CHECK (statut IN ('BROUILLON', 'SOUMISE') OR date_decision IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Soutenance : la multiplicite "une demande a 0 ou 1 soutenance"
-- devient demande_id NOT NULL UNIQUE.
-- (date_heure, salle) est UNIQUE : pas deux soutenances au meme
-- creneau dans la meme salle.
-- ---------------------------------------------------------------------
CREATE TABLE soutenance (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  demande_id     INT UNSIGNED NOT NULL,
  date_heure     DATETIME     NOT NULL,
  salle          VARCHAR(20)  NOT NULL,
  duree_minutes  SMALLINT UNSIGNED NOT NULL DEFAULT 45,
  PRIMARY KEY (id),
  UNIQUE KEY uk_soutenance_demande (demande_id),
  UNIQUE KEY uk_soutenance_creneau (date_heure, salle),
  CONSTRAINT fk_soutenance_demande FOREIGN KEY (demande_id)
    REFERENCES demande_stage (id) ON DELETE CASCADE,
  CONSTRAINT ck_soutenance_duree
    CHECK (duree_minutes BETWEEN 15 AND 240)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Vue : planning des soutenances (etudiant, entreprise, salle)
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW v_planning_soutenances AS
SELECT s.id                          AS id,
       CONCAT(e.nom, ' ', e.prenom)  AS etudiant,
       en.nom                        AS entreprise,
       s.date_heure,
       s.salle,
       s.duree_minutes               AS duree
FROM soutenance s
JOIN demande_stage d ON d.id = s.demande_id
JOIN etudiant e      ON e.id = d.etudiant_id
JOIN entreprise en   ON en.id = d.entreprise_id;
