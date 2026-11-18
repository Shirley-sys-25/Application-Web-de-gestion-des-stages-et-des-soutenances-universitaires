**ADR-001 — Monolithe modulaire PHP avec PDO**  
- **Date :** 18 novembre 2026  
- **Statut :** accepté  
**Contexte**  
Équipe de trois étudiantes, 25 heures de cours, besoin de livrer une application web de gestion des stages avec PHP 8 et MySQL/MariaDB. Le déploiement doit rester simple, sans infrastructure lourde.  
**Décision**  
Construire un monolithe modulaire en PHP 8 avec PDO, sans framework : un point d'entrée `public/index.php`, des contrôleurs, des services et des dépôts séparés, et un fichier `.env` non versionné pour la configuration locale.  
**Conséquences**  
- **Positives :** démarrage rapide, aucune dépendance externe, code proche du cours et facile à expliquer.  
- **Négatives :** le routage, la validation et l'authentification sont écrits à la main ; ils doivent être testés (TP6 et TP8).  
