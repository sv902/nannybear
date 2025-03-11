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
use Illuminate\Support\Str;

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
        Log::info('Запуск googleCallback');
        try {            
    
            $googleUser = Socialite::driver('google')                
                ->stateless()
                ->user();
            Log::info('Дані користувачів Google отримано');
               
            Log::info('Google User: ', [
                'email' => $googleUser->getEmail(),
                'name' => $googleUser->getName(),
            ]);

            // Перевірка, чи існує вже користувач з таким Google email
            $user = User::firstOrCreate([             
                'email' => $googleUser->getEmail(),
            ], [
                'name' => $googleUser->getName(),
                'password' => bcrypt(Str::random(16)),  // Генерація випадкового пароля
            ]);             
          
            Log::info('Користувач створений або знайдений: ', ['user' => $user]);
              

             // Отримуємо роль з запиту (або встановлюємо за замовчуванням "parent")
            $roleName = request()->input('role', 'parent'); // Якщо роль не передано, встановлюється "parent"
            
            // Перевіряємо, чи є роль в базі
            $role = Role::where('name', $roleName)->first();
            if ($role) {
                $user->role_id = $role->id;
                $user->save();
                Log::info('Роль користувача встановлена: ' . $role->name);
            } else {
                Log::error('Роль "' . $roleName . '" не знайдена');
            }
    
            // Автоматичне визначення profile_type
            if (isset($role)) {
                $profileType = match ($role->name) {
                    'nanny' => 'nanny',
                    'parent' => 'parent',
                    'admin' => 'admin',
                    default => null,
                };
                $user->profile_type = $profileType;
                $user->save();
                Log::info('Profile type збережено: ' . $user->profile_type);
            }

            // Призначення ролі через Spatie (якщо роль була знайдена)
            if (isset($role)) {
                $user->assignRole($role->name);
                Log::info('Роль користувача призначена через Spatie');
            }    
           
            Auth::login($user); // Авторизація користувача
            if (Auth::check()) {
                Log::info('Користувач успішно авторизований');
            } else {
                Log::error('Не вдалося авторизувати користувача');
            }
                
            // Перевіряємо email та автоматично підтверджуємо його
            if (!$user->hasVerifiedEmail()) {
                $user->markEmailAsVerified();
                Log::info('Електронна пошта підтверджена');
            }
    
            $token = $user->createToken('Google Token')->plainTextToken;
            Log::info('Створено Token'); 
    
            Log::info('Відповідь надіслано');
            return response()->json([
                'token' => $token,
                'user' => $user,
            ]);
    
        } catch (\Exception $e) {          
            Log::error('Google callback error: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Error authenticating with Google'], 500);
        }
    }
    

    /**
     * Перенаправлення на Facebook для авторизації.
     */
    public function facebookRedirect()
    {
        return Socialite::driver('facebook')->stateless()->redirect();
    }

    /**
     * Обробка callback-даних від Facebook.
     */
    public function facebookCallback()
    {
        Log::info('Запуск facebookCallback');
        try {
            // Отримуємо дані користувача через Socialite
            $facebookUser = Socialite::driver('facebook')->stateless()->user();
            Log::info('Дані користувачів Facebook отримано');

            Log::info('Facebook User: ', [
                'email' => $facebookUser->getEmail(),
                'name' => $facebookUser->getName(),
            ]);

            // Перевірка, чи існує вже користувач з таким Facebook email
            $user = User::firstOrCreate([
                'email' => $facebookUser->getEmail(),
            ], [
                'name' => $facebookUser->getName(),
                'password' => bcrypt(Str::random(16)),  // Генерація випадкового пароля
            ]);

            Log::info('Користувач створений або знайдений: ', ['user' => $user]);

            // Отримуємо роль з запиту (або встановлюємо за замовчуванням "parent")
            $roleName = request()->input('role', 'parent');
            $role = Role::where('name', $roleName)->first();
            if ($role) {
                $user->role_id = $role->id;
                $user->save();
                Log::info('Роль користувача встановлена: ' . $role->name);
            } else {
                Log::error('Роль "' . $roleName . '" не знайдена');
            }

            // Автоматичне визначення profile_type
            if (isset($role)) {
                $profileType = match ($role->name) {
                    'nanny' => 'nanny',
                    'parent' => 'parent',
                    'admin' => 'admin',
                    default => null,
                };
                $user->profile_type = $profileType;
                $user->save();
                Log::info('Profile type збережено: ' . $user->profile_type);
            }

            // Призначення ролі через Spatie (якщо роль була знайдена)
            if (isset($role)) {
                $user->assignRole($role->name);
                Log::info('Роль користувача призначена через Spatie');
            }

            Auth::login($user); // Авторизація користувача
            if (Auth::check()) {
                Log::info('Користувач успішно авторизований');
            } else {
                Log::error('Не вдалося авторизувати користувача');
            }

            // Перевіряємо email та автоматично підтверджуємо його
            if (!$user->hasVerifiedEmail()) {
                $user->markEmailAsVerified();
                Log::info('Електронна пошта підтверджена');
            }

            $token = $user->createToken('Facebook Token')->plainTextToken;
            Log::info('Створено Token');

            Log::info('Відповідь надіслано');
            return response()->json([
                'token' => $token,
                'user' => $user,
            ]);
        } catch (\Exception $e) {
            Log::error('Facebook callback error: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Error authenticating with Facebook'], 500);
        }
    }

        public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['login', 'register', 'googleCallback', 'facebookCallback']);
    }   

}
