-- =====================================================================
-- 000_reset_tp6.sql : retire les objets ajoutes au TP6.
-- Utile pour rejouer TP3/001_schema.sql sur une base deja utilisee.
-- =====================================================================

SET NAMES utf8mb4;

DROP TABLE IF EXISTS historique_demande;
DROP TABLE IF EXISTS utilisateur;
