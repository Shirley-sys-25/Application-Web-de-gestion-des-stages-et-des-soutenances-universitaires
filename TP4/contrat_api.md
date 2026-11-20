# TP4 — Contrat d'API

**Version :** 1 (TP4)  
**Base URL locale :** `http://localhost:8000`  
**Format :** JSON UTF-8 (`Content-Type: application/json; charset=utf-8`)  
**Authentification :** session par cookie (implémentée au TP6)  
**Rôles :** `ETUDIANT`, `RESPONSABLE`, `ADMINISTRATEUR`, `DEVELOPPEUR`

Le rôle `DEVELOPPEUR` est réservé à la maintenance (journalisation, déploiement, diagnostic ; EF-12). Il n'accède à aucune route métier du TP4 ; son périmètre sera précisé avec l'authentification au TP6.

`ADMINISTRATEUR` hérite de `RESPONSABLE` : il dispose des mêmes droits sur les demandes, en plus de la gestion des comptes.

Le contrat est écrit avant le code : il sert de référence commune au backend et au frontend.

## Format des erreurs

Toutes les erreurs renvoient un objet JSON simple :

```json
{ "erreur": "message lisible" }
```

Aucun détail technique (SQL, nom d'utilisateur, mot de passe, trace PHP) n'est renvoyé au client.

| Code | Signification |
|---|---|
| `400` | Données invalides ou incomplètes |
| `401` | Non authentifié (pas de session) |
| `403` | Authentifié mais rôle interdit, ou jeton CSRF absent/invalide |
| `404` | Ressource introuvable |
| `409` | Conflit d'état (transition interdite) |
| `500` | Erreur interne du serveur |
| `503` | Base de données indisponible |

## Protection CSRF

Depuis le TP8, les écritures (`POST`, `PATCH`, `PUT`, `DELETE`) exigent un jeton synchronisé :

1. `GET /api/csrf` renvoie `{"csrf_token":"…"}` pour la session courante.
2. Le client renvoie ce jeton dans l'en-tête `X-CSRF-Token`.
3. Le serveur compare le jeton reçu à celui de la session avec `hash_equals()` et répond `403`
   si le jeton est absent ou invalide.

Le jeton est stocké en session et n'est pas lisible par un site tiers (Same-Origin Policy). Toutes
les écritures sont protégées, y compris `POST /api/connexion` : le formulaire de connexion récupère
d'abord le jeton. Les écritures sans session autres que la connexion laissent l'authentification
répondre `401`.

## Tableau des routes

| Méthode | Chemin | Rôle autorisé | Succès | Erreurs |
|---|---|---|---|---|
| `GET` | `/api/sante` | public | `200` | `503` |
| `GET` | `/api/csrf` | public | `200` | — |
| `GET` | `/api/demandes` | Responsable, Administrateur | `200` | `400`, `401`, `403` |
| `GET` | `/api/demandes/mes-demandes` | Étudiant | `200` | `401`, `403` |
| `GET` | `/api/demandes/{id}` | Étudiant propriétaire, Responsable, Administrateur | `200` | `401`, `403`, `404` |
| `GET` | `/api/entreprises` | Étudiant | `200` | `401`, `403` |
| `POST` | `/api/demandes` | Étudiant | `201` | `400`, `401`, `403` |
| `PATCH` | `/api/demandes/{id}/statut` | Responsable, Administrateur | `200` | `400`, `401`, `403`, `404`, `409` |
| `POST` | `/api/soutenances` | Responsable, Administrateur | `201` | `400`, `401`, `403`, `404`, `409` |

---

## GET /api/sante

Vérifie que l'application arrive à joindre la base. Route publique, sans authentification.

**Succès — `200`**

```json
{
  "statut": "ok",
  "base": "ok"
}
```

**Base indisponible — `503`**

```json
{
  "statut": "erreur",
  "base": "indisponible"
}
```

Exemple :

```bash
curl -i http://localhost:8000/api/sante
```

---

## GET /api/demandes

Liste les demandes de stage. Réservée au responsable pédagogique et à l'administrateur (par héritage).

**Paramètres de requête optionnels**

| Paramètre | Valeurs | Effet |
|---|---|---|
| `statut` | `BROUILLON`, `SOUMISE`, `VALIDEE`, `REFUSEE` | filtre par statut |
| `q` | texte libre | recherche sur le nom, le prénom ou le numéro d'étudiant |

**Succès — `200`**

```json
[
  {
    "id": 2,
    "etudiant": {
      "id": 2,
      "numero_etudiant": "ETU-2026-002",
      "nom": "BELLO",
      "prenom": "Aicha"
    },
    "entreprise": {
      "id": 1,
      "nom": "Atelier Numerique",
      "ville": "Cotonou"
    },
    "encadreur": null,
    "statut": "SOUMISE",
    "motif_refus": null,
    "date_depot": "2026-11-11 14:00:00",
    "date_decision": null
  }
]
```

La liste est vide (`[]`) s'il n'y a aucune demande.

**Erreurs**

- `400` : valeur de `statut` inconnue.
- `401` : aucune session active.
- `403` : rôle différent de `RESPONSABLE` ou `ADMINISTRATEUR`.

---

## POST /api/demandes

Crée une demande de stage pour l'étudiant connecté.

**Corps attendu**

```json
{
  "entreprise_id": 1
}
```

L'étudiant est identifié par la session : `etudiant_id` n'est jamais accepté depuis le corps de la requête. L'encadreur n'est pas choisi par l'étudiant : `encadreur_id` reste `NULL` jusqu'à l'affectation par le responsable (EF-04).

La demande est créée directement au statut `SOUMISE` (« En attente »), avec `date_depot` remplie par le serveur. Le statut `BROUILLON` reste disponible pour un brouillon non soumis, mais ne fait pas partie de cette route.

**Succès — `201`**

```json
{
  "id": 5,
  "statut": "SOUMISE",
  "date_depot": "2026-11-18 10:00:00"
}
```

**Erreurs**

- `400` : `entreprise_id` absent, non entier ou inexistant.
- `401` : aucune session active.
- `403` : rôle différent d'`ETUDIANT`.

---

## PATCH /api/demandes/{id}/statut

Valide ou refuse une demande. Réservée au responsable pédagogique et à l'administrateur (par héritage).

**Corps attendu — validation**

```json
{
  "decision": "VALIDEE"
}
```

**Corps attendu — refus**

```json
{
  "decision": "REFUSEE",
  "motif": "Convention incomplète."
}
```

Règles :

- `decision` vaut `VALIDEE` ou `REFUSEE`.
- `motif` est obligatoire pour `REFUSEE` (255 caractères maximum) et doit être absent ou `null` pour `VALIDEE`.
- Seule une demande au statut `SOUMISE` peut être validée ou refusée.
- Toute autre transition est refusée avec `409`.
- La mise à jour du statut et l'ajout dans l'historique des décisions se font dans la même transaction (TP6).

**Succès — `200`**

```json
{
  "id": 2,
  "statut": "VALIDEE",
  "date_decision": "2026-11-18 10:05:00"
}
```

**Erreurs**

- `400` : décision inconnue, motif absent pour un refus, motif trop long, motif fourni pour une validation.
- `401` : aucune session active.
- `403` : rôle différent de `RESPONSABLE` ou `ADMINISTRATEUR`.
- `404` : demande inexistante.
- `409` : demande déjà validée, déjà refusée, ou encore en brouillon.

---

## Ce qui est implémenté au TP4

- `GET /api/sante` : **fonctionnelle**.
- `GET /api/demandes`, `POST /api/demandes`, `PATCH /api/demandes/{id}/statut` : **contrat rédigé**, routes en attente (`501 Not Implemented`).
- Le branchement sur `DemandeService`, l'authentification, les transitions et la transaction sont prévus au TP6.

## Mise à jour TP6

Les trois routes métier sont implémentées avec authentification par session, requêtes préparées,
table des transitions et transaction statut + historique. Des routes d'authentification
(`POST /api/connexion`, `POST /api/deconnexion`, `GET /api/moi`) et une route étudiant
(`GET /api/demandes/mes-demandes`) ont été ajoutées. Voir [`../TP6/README.md`](../TP6/README.md).

## Mise à jour TP7

### GET /api/entreprises

Liste les entreprises partenaires proposées dans le formulaire de nouvelle demande. Route en
lecture seule, réservée aux étudiants connectés.

**Succès — `200`**

```json
[
  {
    "id": 1,
    "nom": "Atelier Numerique",
    "ville": "Cotonou"
  },
  {
    "id": 2,
    "nom": "Reseau Plus",
    "ville": "Porto-Novo"
  }
]
```

**Erreurs**

- `401` : aucune session active.
- `403` : rôle différent de `ETUDIANT`.

Cette route a été ajoutée au TP7 pour alimenter le sélecteur d'entreprise du frontend. Elle ne
permet aucune création ni modification : le dépôt reste assuré par `POST /api/demandes`.

## Mise à jour TP8

### GET /api/csrf

Renvoie le jeton CSRF de la session courante. Route publique : elle crée une session si nécessaire.

```json
{
  "csrf_token": "e094b2fe47270a4a63dc62f0cad74bcf843738de02440305c12fa01a067e4bb7"
}
```

Le jeton doit être envoyé dans `X-CSRF-Token` pour toute écriture.

### GET /api/demandes/{id}

Lit un dossier précis. Un étudiant ne peut lire que le dossier lié à son compte ; un autre dossier
existant renvoie `403` sans aucune donnée. Le responsable et l'administrateur peuvent lire tous les
dossiers. Une demande inexistante renvoie `404`.

**Succès — `200`** : même objet que dans la liste `GET /api/demandes`.

**Erreurs** : `401` sans session, `403` pour le dossier d'un autre étudiant, `404` si la demande
n'existe pas.

### POST /api/soutenances

Programme la soutenance d'une demande validée (EF-05). Réservé au responsable et à l'administrateur.
Exige le jeton CSRF.

**Corps attendu**

```json
{
  "demande_id": 5,
  "date_heure": "2027-04-10 09:30:00",
  "salle": "B12",
  "duree_minutes": 45
}
```

Règles :

- `demande_id` est un entier positif et la demande doit être au statut `VALIDEE`.
- `date_heure` respecte strictement le format `AAAA-MM-JJ HH:MM:SS` et doit être une date réelle :
  `2026-02-30 10:00:00` renvoie `400`.
- `salle` est obligatoire (20 caractères maximum) ; `duree_minutes` est comprise entre 15 et 240.
- Une demande n'a qu'une soutenance et un couple `(date_heure, salle)` est unique.

**Succès — `201`**

```json
{
  "id": 2,
  "demande_id": 5,
  "date_heure": "2027-04-10 09:30:00",
  "salle": "B12",
  "duree_minutes": 45
}
```

**Erreurs** : `400` données invalides (dont date inexistante), `401` sans session, `403` rôle
interdit, `404` demande inexistante, `409` demande non validée, déjà programmée ou créneau occupé.
