<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Отримати список всіх користувачів (доступно тільки для адмінів).
     */
    public function index()
    {
        if (!Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Доступ заборонено'], 403);
        }

        $users = User::with('role')->get();
        return response()->json($users);
    }

   /**
     * Отримати інформацію про конкретного користувача.
     */
    public function show($id)
    {
        $user = User::with('role')->find($id);

        if (!$user) {
            return response()->json(['message' => 'Користувача не знайдено'], 404);
        }

        return response()->json($user);
    }


    /**
     * Оновити профіль користувача.
     */
    public function update(Request $request, $id)
    {
        // Шукаємо користувача за його ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Користувача не знайдено'], 404);
        }

        // Валідація вхідних даних
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string|min:10|max:15|unique:users,phone,' . $user->id,
            'city' => 'nullable|string|max:100',
            'district' => 'nullable|string|max:100',
            'street' => 'nullable|string|max:100',
            'house' => 'nullable|string|max:10',
        ]);

         // Оновлюємо дані користувача
        $user->update($validated);

         // Повертаємо відповідь із оновленими даними
        return response()->json(['message' => 'Профіль оновлено', 'user' => $user]);
    }

    /**
     * Видалити користувача (доступно тільки адміну).
     */
    public function destroy($id)
    {
        // Шукаємо користувача за ID
        $user = User::find($id);

        // Якщо користувача не знайдено, повертаємо помилку
        if (!$user) {
            return response()->json(['message' => 'Користувача не знайдено'], 404);
        }

        if (!Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Доступ заборонено'], 403);
        }

        // Видаляємо користувача
        $user->delete();

        // Повертаємо підтвердження видалення
        return response()->json(['message' => 'Користувача видалено']);
    }

    /**
    * Оновити роль користувача (доступно тільки для адміна).
    */
   public function updateRole(Request $request, $id)
   {
       // Валідація даних:
       $request->validate([
           'role' => 'required|in:parent,nanny,admin',
       ]);

       // Шукаємо користувача за ID
       $user = User::find($id);

       if (!$user) {
           return response()->json(['message' => 'Користувача не знайдено'], 404);
       }

       if (!Auth::user()->isAdmin()) {
           return response()->json(['message' => 'Доступ заборонено'], 403);
       }

       // Оновлюємо роль користувача
       $role = Role::where('name', $request->role)->first();
       $user->role_id = $role->id;
       $user->save();

       // Повертаємо відповідь із підтвердженням оновлення ролі
       return response()->json(['message' => 'Роль оновлено', 'user' => $user]);
   }
}
