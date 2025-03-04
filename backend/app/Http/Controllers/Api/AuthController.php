<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Laravel\Socialite\Facades\Socialite;
use App\Models\Role;

class AuthController extends Controller
{
    /**
     * Реєстрація нового користувача.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|min:6|confirmed',
            'role' => 'required|in:parent,nanny,admin',
            'phone' => 'required|string|min:10|max:15|unique:users',
            'city' => 'required|string|max:100',
            'district' => 'nullable|string|max:100',
            'street' => 'nullable|string|max:100',
            'house' => 'nullable|string|max:10',                    
        ]);

        $role = Role::where('name', $validated['role'])->first();        

        if (!$role) {
            return response()->json(['error' => 'Роль не знайдена'], 400);
        }

        // Автоматичне визначення profile_type
        $profileType = ($role->name == 'nanny') ? 'nanny' : 'parent';

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $role->id,
            'phone' => $validated['phone'],
            'city' => $validated['city'] ?? null,
            'district' => $validated['district'] ?? null,
            'street' => $validated['street'] ?? null,
            'house' => $validated['house'] ?? null,
            'profile_type' => $profileType,       
        ]);        

        event(new Registered($user));

        return response()->json([
            'success' => true,
            'message' => 'Користувач зареєстрований. Перевірте email для підтвердження.',
            'user' => $user,
        ], 201);
    }

    /**
     * Авторизація користувача.
     */
        public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::guard('web')->attempt($credentials)) {
            $user = Auth::user();
            
            // Перевірка email на підтвердження
            if (!$user->hasVerifiedEmail()) {
                return response()->json(['message' => 'Email не підтверджено'], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            // Викликаємо автоматичне створення профілю
            (new ProfileController())->createProfileIfNotExists();

            return response()->json([
                'token' => $token,
                'user' => $user
            ]);
        }

        return response()->json(['message' => 'Невірний email або пароль'], 401);
    }

    /**
     * Вихід із системи (видалення токенів).
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Вихід виконано успішно']);
    }
    
    /**
     * Google авторизація.
     */
    public function googleRedirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Google Callback.
     */
        public function googleCallback()
    {
            $googleUser = Socialite::driver('google')->stateless()->user();

        // Перевірка, чи існує вже користувач з таким Google email
        $user = User::firstOrCreate([
            'email' => $googleUser->getEmail(),
        ], [
            'name' => $googleUser->getName(),
            'password' => bcrypt(str_random(16)), // Генерація випадкового пароля
        ]);

        Auth::login($user); // Авторизація користувача

        $token = $user->createToken('Google Token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

        public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['login', 'register']);
    }   

}
