# TP4 — Vérification locale

## Prérequis

- PHP 8.1 ou plus ;
- extension `pdo_mysql` activée ;
- MySQL ou MariaDB ;
- `curl` pour les tests HTTP.

Vérifier PHP et l'extension :

```bash
php -v
php -m | grep -i pdo_mysql
```

Si `pdo_mysql` n'apparaît pas, installer le paquet correspondant à la version de PHP, par exemple :

```bash
sudo apt install php8.5-mysql
```

## 1. Configurer l'environnement

```bash
cp .env.example .env
```

Modifier `.env` avec les identifiants locaux. Exemple avec une base `stages` :

```dotenv
APP_ENV=local
APP_DEBUG=true

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=stages
DB_USER=root
DB_PASS=
```

Le fichier `.env` est ignoré par Git. Ne jamais le commiter.

## 2. Préparer la base (si nécessaire)

```bash
mariadb -u root -e "CREATE DATABASE stages CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
mariadb -u root stages < TP3/001_schema.sql
mariadb -u root stages < TP3/002_seed.sql
```

## 3. Tester la connexion PDO

```bash
php tests/test_connexion.php
```

Sortie attendue :

```text
[OK] Connexion PDO réussie à la base « stages » (127.0.0.1:3306).
```

## 4. Lancer le serveur

```bash
php -S 127.0.0.1:8000 -t public
```

Laisser ce terminal ouvert.

## 5. Tester la route de santé

Dans un second terminal :

```bash
curl -i http://127.0.0.1:8000/api/sante
```

Réponse attendue :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"statut":"ok","base":"ok"}
```

Ou avec le script fourni :

```bash
chmod +x tests/test_sante.sh
./tests/test_sante.sh
```

## 6. Vérifier les autres routes

```bash
curl -i http://127.0.0.1:8000/
curl -i http://127.0.0.1:8000/api/demandes
curl -i -X POST http://127.0.0.1:8000/api/demandes
curl -i -X PATCH http://127.0.0.1:8000/api/demandes/2/statut
curl -i http://127.0.0.1:8000/api/inconnue
```

Résultats attendus au TP4 :

| Requête | Code | Corps |
|---|---|---|
| `GET /` | `200` | description de l'API |
| `GET /api/sante` | `200` | `{"statut":"ok","base":"ok"}` |
| `GET /api/demandes` | `501` | route prévue au TP6 |
| `POST /api/demandes` | `501` | route prévue au TP6 |
| `PATCH /api/demandes/2/statut` | `501` | route prévue au TP6 |
| `GET /api/inconnue` | `404` | `{"erreur":"Route introuvable."}` |

## 7. Tester le cas base indisponible

Arrêter MariaDB, puis relancer :

```bash
curl -i http://127.0.0.1:8000/api/sante
```

Réponse attendue : `503` avec `{"statut":"erreur","base":"indisponible"}`.

Le détail de l'erreur PDO doit apparaître dans le journal du serveur PHP, jamais dans la réponse HTTP.
