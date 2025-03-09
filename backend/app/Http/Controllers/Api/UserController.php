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
     * Отримати список всіх користувачів (доступно тільки для адмінів).
     */
    public function index()
    {
        Log::info('Початок виклику index() для користувача ' . Auth::id());

        if (!Auth::user()->isAdmin()) {
        Log::warning('Користувач ' . Auth::id() . ' намагається отримати доступ без прав адміністратора.');
        return response()->json(['message' => 'Доступ заборонено'], 403);
    }

        Log::info('Адміністратор має доступ.');
        $users = User::with('role')->get();
        return response()->json($users);
    }

   /**
     * Отримати інформацію про конкретного користувача.
     */
    public function show($id)
    {
        $user = User::with('roles')->findOrFail($id);
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
        
        $authUser = Auth::user();

        // Логування для перевірки
        Log::info("Користувач {$authUser->id} перевіряється на роль admin");

        // if (!$authUser->hasRole('admin')) {
        //     Log::warning("Користувач {$authUser->id} не має прав для видалення користувачів.");
        //     return response()->json(['message' => 'Доступ заборонено'], 403);
        // }
         // Перевірка ролі користувача
         if ($authUser->role->name !== 'admin') {
            Log::warning("Користувач {$authUser->id} не має прав адміністратора для видалення користувачів.");
            return response()->json(['message' => 'Доступ заборонено'], 403);
        }
        
         // Логування, якщо у користувача є права адміністратора
         Log::info("Користувач {$authUser->id} має права адміністратора");
        
        // Шукаємо користувача за ID
        $user = User::find($id);

        Log::info("Користувач {$authUser->id} ({$authUser->role->name}) намагається видалити {$id}");

        // Якщо користувача не знайдено, повертаємо помилку
        if (!$user) {
            Log::warning("Користувача з ID {$id} не знайдено");
            return response()->json(['message' => 'Користувача не знайдено'], 404);
        }          

         // Перевірка, чи не намагається адміністратор видалити самого себе
        if ($authUser->id == $user->id) {
            Log::warning("Адміністратор {$authUser->id} намагався видалити себе!");
            return response()->json(['message' => 'Ви не можете видалити самого себе'], 403);
        }

        // Видаляємо користувача
        $user->delete();
        Log::info("Користувач {$id} видалений адміністратором {$authUser->id}");

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
   
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        
        $this->middleware(function ($request, $next) {
            if (!auth()->user() || !auth()->user()->isAdmin()) {
                return response()->json(['message' => 'Доступ заборонено'], 403);
            }

            return $next($request);
        });
    }
}
