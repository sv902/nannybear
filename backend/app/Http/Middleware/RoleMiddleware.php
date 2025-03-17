<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    // public function handle($request, Closure $next, $role)
    // {
    //     if (!$request->user()->hasRole($role)) {
    //         return redirect('home');
    //     }
    
    //     return $next($request);
    // }

    public function handle(Request $request, Closure $next, $role): Response {
        // Перевіряємо, чи є користувач авторизований і чи має він відповідну роль
        if (!auth()->check() || !auth()->user()->hasRole($role)) {
            return response()->json(['message' => 'Доступ заборонений.'], 403);
        }

        return $next($request);
    }
}
