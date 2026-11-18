# TP4 — Contrat d'API

**Version :** 1 (TP4)  
**Base URL locale :** `http://localhost:8000`  
**Format :** JSON UTF-8 (`Content-Type: application/json; charset=utf-8`)  
**Authentification :** session par cookie (implémentée au TP6)  
**Rôles :** `ETUDIANT`, `RESPONSABLE`, `SECRETARIAT`, `ADMINISTRATEUR`, `DEVELOPPEUR`

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
| `403` | Authentifié mais rôle interdit |
| `404` | Ressource introuvable |
| `409` | Conflit d'état (transition interdite) |
| `500` | Erreur interne du serveur |
| `503` | Base de données indisponible |

## Tableau des routes

| Méthode | Chemin | Rôle autorisé | Succès | Erreurs |
|---|---|---|---|---|
| `GET` | `/api/sante` | public | `200` | `503` |
| `GET` | `/api/demandes` | Responsable, Administrateur, Secrétariat | `200` | `400`, `401`, `403` |
| `POST` | `/api/demandes` | Étudiant | `201` | `400`, `401`, `403` |
| `PATCH` | `/api/demandes/{id}/statut` | Responsable, Administrateur | `200` | `400`, `401`, `403`, `404`, `409` |

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

Liste les demandes de stage. Réservée au responsable pédagogique, à l'administrateur (par héritage) et au secrétariat.

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
- `403` : rôle différent de `RESPONSABLE`, `ADMINISTRATEUR` ou `SECRETARIAT`.

---

## POST /api/demandes

Crée une demande de stage pour l'étudiant connecté.

**Corps attendu**

```json
{
  "entreprise_id": 1
}
```

L'étudiant est identifié par la session : `etudiant_id` n'est jamais accepté depuis le corps de la requête. L'encadreur n'est pas choisi par l'étudiant : `encadreur_id` reste `NULL` jusqu'à l'affectation par le secrétariat (EF-04).

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
