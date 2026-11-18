<?php

declare(strict_types=1);

namespace App;

use PDO;
use PDOException;
use RuntimeException;

/**
 * Connexion unique à la base de données.
 *
 * PDO est configuré pour lever des exceptions : une erreur SQL ne passe
 * jamais silencieusement. Les requêtes préparées sont utilisées partout
 * dans les dépôts (voir src/Repositories).
 */
final class Database
{
    private static ?PDO $connexion = null;

    /**
     * @param array<string, mixed> $config
     */
    public static function connexion(array $config): PDO
    {
        if (self::$connexion instanceof PDO) {
            return self::$connexion;
        }

        /** @var array<string, mixed> $db */
        $db = $config['db'];
        $socket = (string) ($db['socket'] ?? '');

        $dsn = $socket !== ''
            ? sprintf(
                'mysql:unix_socket=%s;dbname=%s;charset=utf8mb4',
                $socket,
                (string) $db['name']
            )
            : sprintf(
                'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
                (string) $db['host'],
                (int) $db['port'],
                (string) $db['name']
            );

        try {
            self::$connexion = new PDO(
                $dsn,
                (string) $db['user'],
                (string) $db['pass'],
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $e) {
            throw new RuntimeException('Connexion à la base de données impossible.', 0, $e);
        }

        return self::$connexion;
    }
}
