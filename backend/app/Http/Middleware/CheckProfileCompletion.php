<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckProfileCompletion
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if ($user && !$user->profile) {
            return redirect()->route('profile.create')->with('error', 'Будь ласка, заповніть ваш профіль.');
        }

        return $next($request);
    }
}
