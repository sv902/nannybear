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
use Illuminate\Support\Facades\Log;


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
        $profileType = match ($role->name) {
            'nanny' => 'nanny',
            'parent' => 'parent',
            'admin' => 'admin', // Тепер адміністратор отримує правильний тип профілю
            default => null,
        };

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),            
            'phone' => $validated['phone'],
            'city' => $validated['city'] ?? null,
            'district' => $validated['district'] ?? null,
            'street' => $validated['street'] ?? null,
            'house' => $validated['house'] ?? null,
            'profile_type' => $profileType, 
            'role_id' => $role->id,      
        ]);        

        // Призначаємо роль через Spatie
        $user->assignRole($validated['role']);

        Log::info('Роль користувача після реєстрації: ', [$user->roles]);
        
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
        
        Log::info('Аутентифікований користувач: ' . $request->email); 
       

        // Перевірка на правильність облікових даних
        if (Auth::guard('web')->attempt($credentials)) {
            $user = Auth::user();// Отримуємо користувача після успішного логіну
            
            // Логування ролі користувача
            Log::info('Роль користувача: ' . $user->role->name);


            // Перевірка, чи користувач існує і чи підтвердив email
            if (!$user) {
                return response()->json(['message' => 'Користувача не знайдено.'], 404);
            }

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

    /**
     * Apple авторизація.
     */
    public function redirectToApple()
    {
        return Socialite::driver('apple')->stateless()->redirect();
    }

    public function handleAppleCallback()
    {
        $appleUser = Socialite::driver('apple')->stateless()->user();

        // Перевірка, чи існує користувач з таким Apple email
        $user = User::firstOrCreate([
            'email' => $appleUser->getEmail(),
        ], [
            'name' => $appleUser->getName() ?? 'Apple User',
            'password' => bcrypt(str()->random(16)), // Генерація випадкового пароля
        ]);

        Auth::login($user); // Авторизація користувача

        $token = $user->createToken('Apple Token')->plainTextToken;

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
