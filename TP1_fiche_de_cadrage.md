**TP1 – Fiche de cadrage**  
**Projet :** Application Web de gestion des stages universitaires  
   
 **Cours :** Projet informatique 2 – L3 SIL  
   
 **Groupe :** ANAGO Shirley, DAGNON Christie, KARIMOU NARO Sabalimath  
   
 **Données :** fictives uniquement  
  
---  
**1. Problème et valeur attendue**  
Aujourd'hui, les demandes de stage circulent sur papier entre l'étudiant, le secrétariat et le responsable pédagogique. Des validations se perdent et des pièces manquent à la première lecture. Ces défauts allongent le délai de traitement et obligent à de multiples relances. L'application Web centralise les dossiers de stage et impose des statuts traçables (brouillon, soumise, validée, refusée). Valeur attendue : un traitement plus rapide, des dossiers complets dès le dépôt et moins de relances.  
**2. Indicateurs mesurables**  
  
|  |  |  |  |  |  
| - | - | - | - | - |  
| **Indicateur** |  **Unité** |  **Mode de mesure** |  **Avant (estimé)** |  **Cible** |  
| Délai moyen de validation d'un dossier |  semaines |  Date de décision − date de dépôt, moyenne sur une session |  4 semaines |  ≤ 1 semaine |  
| Dossiers incomplets à la première lecture |  % |  Dossiers renvoyés pour pièce manquante / dossiers déposés |  *à estimer avec le secrétariat* |  ≤ 5 % |  
| Relances par dossier |  nombre |  Nombre moyen de relances (mail, appel, passage) avant décision, relevé par le secrétariat |  *à estimer avec le secrétariat* |  ≤ 1 |  
  
   
**3. Parties prenantes**  
  
|  |  |  |  
| - | - | - |  
| **Partie prenante** |  **Attente principale** |  **Dans le MVP** |  
| Étudiant |  Déposer et suivre sa demande |  Oui |  
| Secrétariat |  Vérifier les pièces, suivre les dossiers |  Oui |  
| Responsable pédagogique |  Valider ou refuser avec motif |  Oui |  
| Encadreur |  Consulter ses étudiants affectés |  Oui |  
| Administrateur technique |  Gérer les comptes |  Oui |  
| Entreprise (portail) |  Déposer elle-même des offres |  Non (version 2) |  
  
   
**4. Périmètre du MVP**  
**Inclus**  
  
|  |  |  
| - | - |  
| **Élément** |  **Justification** |  
| Dépôt d'une demande de stage |  Point de départ de tout le processus |  
| Validation ou refus motivé |  Supprime les validations perdues et rend la décision traçable |  
| Affectation d'un encadreur |  Nécessaire avant de programmer une soutenance |  
| Consultation de l'état de la demande |  L'étudiant suit son dossier sans relancer le secrétariat |  
| Connexion et contrôle d'accès |  Protège les dossiers : chaque rôle voit uniquement ce qui le concerne |  
  
   
   
**Exclus (version 2)**  
  
|  |  |  
| - | - |  
| **Élément** |  **Justification** |  
| Paiement en ligne |  Aucun lien avec le problème de départ, risque de sécurité élevé |  
| SMS de rappel |  Dépend d'un service externe, hors budget de 25 h |  
| Portail entreprise |  Demande une gestion de comptes supplémentaire |  
  
   
**5. Objectifs SMART**  
  
|  |  |  |  |  |  
| - | - | - | - | - |  
| **Objectif** |  **Mesure** |  **Test** |  **Seuil** |  **Preuve** |  
| Valider une demande en 1 semaine au lieu de 4 |  Délai dépôt → décision |  Parcours complet sur 5 demandes fictives, dates lues dans l'historique |  ≤ 1 semaine |  Extrait de l'historique en base |  
| Retrouver un dossier parmi 100 dossiers fictifs rapidement |  Temps de réponse de la recherche |  Chronométrer 5 recherches par nom ou statut |  < 1 seconde |  Fiche de test |  
| Refuser tout accès interdit sans fuite de données |  Code HTTP |  L'étudiant B lit le dossier de l'étudiant A |  403 sans donnée |  Sortie de la requête |  
  
   
*Échéance de chaque objectif : démonstration finale du projet.*  
- **Risques**  
  
|  |  |  |  |  |  |  |  
| - | - | - | - | - | - | - |  
| **Risque** |  **P** |  **I** |  **Criticité** |  **Action préventive** |  **Repli** |  **Propriétaire** |  
| Conflit Git en fin de projet |  3 |  2 |  **6** |  Fusions fréquentes, branches courtes |  Résolution en binôme, relance des tests |  Chef de projet |  
| Serveur MySQL indisponible |  2 |  3 |  **6** |  Installer MariaDB en local dès la séance 1 |  Base sur un autre poste du groupe |  Administrateur |  
| Fuite de données réelles |  1 |  3 |  **3** |  Découper en cartes Kanban de moins d'une séance |  Reporter les « Should » à la version 2 |  Chef de projet |  
  
   
*Criticité = probabilité × impact. À partir de 6, le risque est traité en priorité.*  
- **Hypothèses**  
- Un serveur MySQL ou MariaDB est disponible sur chaque poste.  
- Les données de test sont fictives et anonymisées.  
- Le secrétariat peut fournir une estimation des délais actuels (hypothèse à vérifier : tant qu'elle ne l'est pas, c'est un risque).  
  
---  
**Remarques du groupe relecteur**  
  
|  |  |  |  |  
| - | - | - | - |  
| **N°** |  **Remarque** |  **Décision (acceptée / reportée / rejetée)** |  **Justification** |  
| 1 |  Rien à signaler |  Acceptée |  Tout est clair et net |  
  
   
