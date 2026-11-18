-- =====================================================================
-- Projet informatique 2 - L3 SIL
-- TP6 : API des demandes
-- 001_schema_tp6.sql : authentification et historique des decisions
-- SGBD : MySQL 8 / MariaDB 10.6+ (InnoDB, utf8mb4)
-- A executer APRES TP3/001_schema.sql et TP3/002_seed.sql.
-- Rejouable : les deux tables sont supprimees avant d'etre creees.
-- =====================================================================

SET NAMES utf8mb4;

DROP TABLE IF EXISTS historique_demande;
DROP TABLE IF EXISTS utilisateur;

-- ---------------------------------------------------------------------
-- Utilisateur : compte de connexion.
-- Un compte etudiant est relie a une ligne etudiant ; les comptes
-- responsable, administrateur et developpeur n'ont pas d'etudiant_id.
-- Le mot de passe n'est jamais stocke en clair : mot_de_passe_hash
-- contient le resultat de password_hash().
-- ---------------------------------------------------------------------
CREATE TABLE utilisateur (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email             VARCHAR(100) NOT NULL,
  mot_de_passe_hash VARCHAR(255) NOT NULL,
  role              VARCHAR(20)  NOT NULL,
  etudiant_id       INT UNSIGNED NULL,
  actif             TINYINT(1)   NOT NULL DEFAULT 1,
  cree_le           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_utilisateur_email (email),
  UNIQUE KEY uk_utilisateur_etudiant (etudiant_id),
  CONSTRAINT fk_utilisateur_etudiant FOREIGN KEY (etudiant_id)
    REFERENCES etudiant (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT ck_utilisateur_role
    CHECK (role IN ('ETUDIANT', 'RESPONSABLE', 'ADMINISTRATEUR', 'DEVELOPPEUR'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Historique : trace chaque changement de statut.
-- La validation d'une demande ecrit le statut et l'historique dans la
-- meme transaction ; si l'INSERT echoue, le ROLLBACK annule l'UPDATE.
-- utilisateur_id identifie l'auteur de l'action (NULL pour un import).
-- ---------------------------------------------------------------------
CREATE TABLE historique_demande (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  demande_id     INT UNSIGNED NOT NULL,
  ancien_statut  VARCHAR(10)  NULL,
  nouveau_statut VARCHAR(10)  NOT NULL,
  motif          VARCHAR(255) NULL,
  utilisateur_id INT UNSIGNED NULL,
  date_evenement DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_historique_demande (demande_id, date_evenement),
  KEY idx_historique_utilisateur (utilisateur_id),
  CONSTRAINT fk_historique_demande FOREIGN KEY (demande_id)
    REFERENCES demande_stage (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_historique_utilisateur FOREIGN KEY (utilisateur_id)
    REFERENCES utilisateur (id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT ck_historique_ancien
    CHECK (ancien_statut IS NULL OR ancien_statut IN ('BROUILLON', 'SOUMISE', 'VALIDEE', 'REFUSEE')),
  CONSTRAINT ck_historique_nouveau
    CHECK (nouveau_statut IN ('BROUILLON', 'SOUMISE', 'VALIDEE', 'REFUSEE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
