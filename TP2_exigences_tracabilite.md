# TP2 – Exigences et matrice de traçabilité

**Projet :** Application Web de gestion des stages universitaires
**Cours :** Projet informatique 2 – L3 SIL
**Groupe :** _à compléter_
**Données :** fictives uniquement

---

## 1. Exigences fonctionnelles

| Id | Exigence | Acteur | Résultat attendu | Priorité |
|---|---|---|---|---|
| EF-01 | Se connecter avec un compte | Tous | Session ouverte avec le rôle de l'utilisateur ; même message d'échec pour un compte inconnu et un mot de passe faux | Must |
| EF-02 | Soumettre une demande de stage | Étudiant | Demande enregistrée au statut « En attente » et accusé de réception affiché | Must |
| EF-03 | Valider ou refuser une demande (refus motivé) | Responsable | Statut VALIDEE ou REFUSEE (motif obligatoire), décision ajoutée à l'historique | Must |
| EF-04 | Affecter un encadreur à une demande validée | Secrétariat | Encadreur associé à la demande validée | Must |
| EF-05 | Programmer la soutenance d'une demande validée | Secrétariat | Soutenance créée (date, heure, salle), une seule par demande | Must |
| EF-06 | Consulter l'état de ses demandes | Étudiant | Liste des demandes de l'étudiant connecté avec leur statut | Should |
| EF-07 | Rechercher un dossier par nom ou statut | Secrétariat | Liste filtrée par nom d'étudiant ou par statut | Should |
| EF-08 | Consulter l'historique des décisions | Responsable | Liste chronologique des décisions d'un dossier | Could |

_Priorité MoSCoW. Statuts d'une demande : BROUILLON, SOUMISE (affichée « En attente »), VALIDEE, REFUSEE._

## 2. Exigences non fonctionnelles

| Id | Exigence mesurable | Priorité |
|---|---|---|
| ENF-01 | Toute lecture d'un dossier est soumise à un contrôle d'autorisation : un étudiant qui lit le dossier d'un autre reçoit 403 sans aucune donnée. | Must |
| ENF-02 | Tous les champs sont validés côté serveur : une requête directe (hors navigateur) contenant une donnée invalide reçoit 400. | Must |
| ENF-03 | La sauvegarde de la base est testée par une restauration : le nombre de lignes de chaque table est identique après restauration. | Must |
| ENF-04 | Toutes les communications entre le client et le serveur utilisent HTTPS : une requête en http:// est refusée ou redirigée vers https://. | Should |
| ENF-05 | Après 5 tentatives de connexion consécutives échouées, le compte est verrouillé pendant 15 minutes : la 6e tentative est refusée, même avec le bon mot de passe. | Should |

_ENF-01 à ENF-03 : autorisation, validation serveur, sauvegarde testée. ENF-04 et ENF-05 : sécurité (HTTPS, verrouillage du compte)._

## 3. User stories et critères d'acceptation

### US-01 (EF-02) – Soumettre une demande

En tant qu'étudiant, je veux soumettre une demande de stage afin que le secrétariat et le responsable puissent la traiter.

**Critère 1 – cas nominal**

- **Given** un étudiant connecté sur le formulaire de demande
- **When** il renseigne tous les champs obligatoires et clique sur « Soumettre »
- **Then** la demande est enregistrée avec le statut « En attente » et un accusé de réception s'affiche

**Critère 2 – cas d'erreur**

- **Given** un étudiant connecté sur le formulaire de demande
- **When** il clique sur « Soumettre » en laissant un champ obligatoire vide
- **Then** la soumission est bloquée, un message d'erreur précise le champ manquant et aucune demande n'est créée

### US-02 (EF-03) – Valider ou refuser une demande

En tant que responsable, je veux valider ou refuser une demande complète afin que le dossier avance vers l'affectation d'un encadreur.

**Critère 1 – cas nominal**

- **Given** une demande au statut SOUMISE et un responsable connecté
- **When** il valide la demande
- **Then** le statut devient VALIDEE et une ligne est ajoutée à l'historique

**Critère 2 – cas d'erreur**

- **Given** une demande au statut VALIDEE
- **When** le responsable tente de la refuser
- **Then** la réponse est 409 et le statut reste VALIDEE

## 4. Matrice de traçabilité

| Exigence | Composant | Test | Statut |
|---|---|---|---|
| EF-01 | AuthController, AuthService::connecter | T-01 identifiants valides → 200, session ouverte. T-02 mot de passe faux → 401, même message qu'un compte inconnu. | à faire |
| EF-02 | DemandeController::creer, DemandeService::soumettre | T-03 formulaire complet → 201, statut SOUMISE. T-04 champ obligatoire vide → 400, aucune ligne créée. | à faire |
| EF-03 | DemandeService::valider, DemandeService::refuser | T-05 SOUMISE → VALIDEE, historique ajouté. T-06 refus sans motif → 400. T-07 refus d'une demande VALIDEE → 409, statut inchangé. | à faire |
| EF-04 | DemandeService::affecterEncadreur | T-08 affectation sur une demande VALIDEE → 200. T-09 affectation sur une demande non validée → 409. | à faire |
| EF-05 | SoutenanceService::programmer | T-10 date valide → 201. T-11 date 2026-02-30 → 400. T-12 seconde soutenance pour la même demande → refusée (409). | à faire |
| EF-06 | DemandeController::mesDemandes | T-13 l'étudiant connecté ne voit que ses propres demandes. | à faire si temps |
| EF-07 | DemandeRepository::rechercher | T-14 recherche par statut VALIDEE → uniquement des demandes VALIDEE. | à faire si temps |
| EF-08 | DemandeService::historique | T-15 l'historique d'une demande validée contient la décision. | reporté |
| ENF-01 | DemandeService (contrôle de propriété) | T-16 l'étudiant B lit la demande de l'étudiant A → 403 sans donnée. | à faire |
| ENF-02 | Services (validation serveur) | T-17 requête directe avec une donnée invalide → 400. | à faire |
| ENF-03 | Procédure mysqldump / restauration | T-18 export, suppression d'une table de test, restauration : COUNT(*) identiques. | à faire |
| ENF-04 | Configuration du serveur Web | T-19 requête en http:// → refusée ou redirigée vers https://. | à faire si temps |
| ENF-05 | AuthService::connecter | T-20 six tentatives consécutives dont cinq échecs → la sixième est refusée pendant 15 minutes. | à faire si temps |

_Une exigence sans test relié n'est pas considérée comme livrée. Statuts : fait / à faire / reporté._

## 5. Périmètre minimal de 25 heures

| Décision | Exigences | Justification |
|---|---|---|
| Retenues (Must) | EF-01 à EF-05, ENF-01 à ENF-03 | D'après la méthode MoSCoW, elles sont indispensables à l'application : sans elles, le parcours connexion → dépôt → validation → affectation → programmation ne fonctionne pas, et les dossiers ne sont pas protégés. |
| Si le temps le permet (Should) | EF-06, EF-07, ENF-04, ENF-05 | Elles améliorent le confort et la sécurité mais le parcours fonctionne sans elles. HTTPS demande de configurer un certificat, le verrouillage demande un compteur et une durée. |
| Reportées (Could) | EF-08 | L'historique est déjà enregistré en base (EF-03) ; sa consultation par écran peut attendre la version 2. |
