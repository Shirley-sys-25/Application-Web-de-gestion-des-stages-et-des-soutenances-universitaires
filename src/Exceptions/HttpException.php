<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * Exception portant un code HTTP.
 *
 * Les services peuvent ainsi signaler une erreur métier (400, 401, 403,
 * 404, 409) sans connaître le routeur. Le point d'entrée HTTP la traduit
 * en réponse JSON.
 */
final class HttpException extends RuntimeException
{
    public function __construct(
        public readonly int $status,
        string $message
    ) {
        parent::__construct($message);
    }
}
