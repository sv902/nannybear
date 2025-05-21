<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use App\Http\Middleware\DisableCsrfForApi;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', 
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();
        
        // Додаємо middleware для ролей
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'disable-csrf-api' => DisableCsrfForApi::class, 
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            // Додаємо кастомний middleware VerifyCsrfToken
            'verify_csrf' => \App\Http\Middleware\VerifyCsrfToken::class,

            'profile.complete' => \App\Http\Middleware\CheckProfileCompletion::class,
        ]);
    })   

    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
