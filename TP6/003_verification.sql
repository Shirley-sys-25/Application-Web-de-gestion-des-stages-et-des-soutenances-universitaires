-- =====================================================================
-- 003_verification.sql : contrôles après chargement du jeu d'essai TP6
-- =====================================================================

SET NAMES utf8mb4;

SELECT 'utilisateurs' AS controle, COUNT(*) AS valeur FROM utilisateur
UNION ALL
SELECT 'historique_demande', COUNT(*) FROM historique_demande;

SELECT role, COUNT(*) AS nombre
FROM utilisateur
GROUP BY role
ORDER BY role;

SELECT demande_id, ancien_statut, nouveau_statut, motif, utilisateur_id, date_evenement
FROM historique_demande
ORDER BY demande_id, id;
