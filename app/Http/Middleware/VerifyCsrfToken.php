<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * Масив URI, які повинні бути виключені з перевірки CSRF.
     *
     * @var array
     */
    protected $except = [
       'api/*', // виключаємо API маршрути з перевірки CSRF
    ];
}
