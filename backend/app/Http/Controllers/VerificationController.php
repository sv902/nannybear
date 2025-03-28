<?php

namespace App\Http\Controllers;

use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Models\User;

class VerificationController extends Controller
{
    /**
     * Підтвердження email з редиректом.
     */
    public function verify(Request $request)
    {
         // Отримання користувача по ID та хешу
         $user = User::findOrFail($request->route('id'));

        //  // Перевірка, чи збігається хеш з хешем у URL
         if (!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            throw new \Illuminate\Auth\Access\AuthorizationException;
        }  
        
        // Якщо email вже підтверджено
        if ($user->hasVerifiedEmail()) {
            return redirect(env('FRONTEND_URL') . '/email-verified?verified=already');
        }

       // Підтвердження email
       if ($user->markEmailAsVerified()) {
        event(new Verified($user));
        Auth::login($user);
         }

         return redirect(env('FRONTEND_URL') . '/email-verified?verified=success');
    }

    /**
     * Надіслати повторно лист для підтвердження.
     */
    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email вже підтверджено.'], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Лист для підтвердження надіслано!']);
    }
}
