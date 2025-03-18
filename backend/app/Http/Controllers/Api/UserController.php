<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{   
    /**
     * Отримати інформацію про конкретного користувача.
     */
    public function show($id)
    {
         // Перевірка, чи користувач намагається переглянути свій профіль або є адміністратором
        $user = Auth::user(); // Отримуємо аутентифікованого користувача

        if ($user->id != $id && !$user->isAdmin()) {
            return response()->json(['message' => 'У вас немає прав доступу до цього користувача'], 403); // Доступ заборонено
        }

        // Отримуємо інформацію про користувача разом з ролями
        $userToShow = User::with('roles')->findOrFail($id);

        return response()->json($userToShow);
    }

    /**
     * Оновити профіль користувача.
     */
    public function update(Request $request, $id)
    {
        // Отримуємо аутентифікованого користувача
        $user = Auth::user();

        // Перевірка, чи користувач намагається оновити свій профіль або є адміністратором
        if ($user->id != $id && !$user->isAdmin()) {
            return response()->json(['message' => 'У вас немає прав доступу до цього користувача'], 403); // Доступ заборонено
        }

        // Шукаємо користувача за його ID
        $userToUpdate = User::find($id);

        if (!$userToUpdate) {
            return response()->json(['message' => 'Користувача не знайдено'], 404);
        }

        // Валідація вхідних даних
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $userToUpdate->id,
            'birth_date' => 'nullable|date|before:today',
            'phone' => 'sometimes|string|min:10|max:15|unique:users,phone,' . $userToUpdate->id,
            'city' => 'nullable|string|max:100',
            'district' => 'nullable|string|max:100',
            'street' => 'nullable|string|max:100',
            'house' => 'nullable|string|max:10',
        ]);

         // Оновлюємо дані користувача
         $userToUpdate->update($validated);

         // Повертаємо відповідь із оновленими даними
         return response()->json(['message' => 'Профіль оновлено', 'user' => $userToUpdate]);
    }

    /**
     * Видалити власний акаунт.
     */
    public function destroySelf(Request $request)
    {
            $user = Auth::user(); // Отримуємо аутентифікованого користувача
            Log::info('Аутентифікований користувач: ', [$user]);
        
             // Адміну заборонено видаляти свій акаунт
            if ($user->hasRole('admin')) {
            return response()->json(['error' => 'Адміністратор не може видалити свій акаунт'], 403);
        }
        
            if (!$user) {
            return response()->json(['message' => 'Користувач не знайдений'], 404);
        }

        $user->delete(); // Видаляємо користувача
        $request->user()->tokens()->delete();// Виходимо з системи після видалення
        Log::info('Користувач успішно видалений: ', [$user]);

        return response()->json([
            'message' => 'Ваш обліковий запис було успішно видалено.'
        ], 200);
    }
    
    public function __construct()
    {
        $this->middleware('auth:sanctum');       
       
    }
}
