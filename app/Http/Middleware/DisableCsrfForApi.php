<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class DisableCsrfForApi extends Middleware
{
    protected $except = [
        'api/*', // ❗ Все в API без CSRF
    ];
}

