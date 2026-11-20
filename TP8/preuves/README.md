# TP8 — Preuves

## Fichiers

| Fichier | Contenu |
|---|---|
| `tests_tp8.txt` | Sortie complète de `tests/test_api_tp8.sh` : cas limites, autorisation, injection, CSRF, rôles, date de soutenance |
| `mots_de_passe.txt` | Sortie SQL et PHP prouvant les hashes bcrypt et l'absence de mot de passe en clair |
| `etudiant-b-acces-interdit.png` | Capture de l'étudiant B ouvrant le dossier de l'étudiant A : `403` affiché sans donnée |

## Commandes

```bash
# Base rechargée (voir TP8/README.md)
BASE_URL=http://127.0.0.1:8010 ./tests/test_api_tp8.sh | tee TP8/preuves/tests_tp8.txt
```

La preuve des mots de passe a été produite avec :

```bash
mariadb --socket=/run/mysqld/mysqld.sock -u stages -pmotdepasse stages \
  -e "SELECT email, LEFT(mot_de_passe_hash, 7) AS prefixe, CHAR_LENGTH(mot_de_passe_hash) AS longueur FROM utilisateur ORDER BY id;"

php -r '
$config = require "bootstrap.php";
$pdo = App\Database::connexion($config);
$attendus = [
  "etudiant1@univ.test" => "etudiant123",
  "etudiant2@univ.test" => "etudiant123",
  "etudiant3@univ.test" => "etudiant123",
  "responsable@univ.test" => "responsable123",
  "admin@univ.test" => "admin123",
  "developpeur@univ.test" => "developpeur123",
];
foreach ($pdo->query("SELECT email, mot_de_passe_hash FROM utilisateur ORDER BY id") as $ligne) {
    printf("%-24s verifie=%s prefixe=%s\n", $ligne["email"],
        password_verify($attendus[$ligne["email"]], $ligne["mot_de_passe_hash"]) ? "oui" : "non",
        substr($ligne["mot_de_passe_hash"], 0, 4));
}
'
```

## Remarque

Le test TP8 crée une demande, la valide et programme une soutenance. Recharger le jeu d'essai
avant de rejouer le script pour retrouver les identifiants et les statuts de démonstration.
