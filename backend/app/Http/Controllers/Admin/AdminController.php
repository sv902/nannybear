<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
     /**
     * Отримати список всіх користувачів.
     */
    public function index()
    {       

        if (!Auth::user()->isAdmin()) {
        Log::warning('Користувач ' . Auth::id() . ' намагається отримати доступ без прав адміністратора.');
        return response()->json(['message' => 'Доступ заборонено'], 403);
    }    
        $users = User::with('role')->get();
        return response()->json($users);
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

    /**
    * Видалити користувача.
    */
    public function destroy($id)
   {          
       $authUser = Auth::user();
              
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

       // Видаляємо профіль, якщо він існує
        if ($user->nannyProfile) {
            $user->nannyProfile->delete();
        }

        if ($user->parentProfile) {
            $user->parentProfile->delete();
        }

       // Видаляємо користувача
       $user->delete();
       Log::info("Користувач {$id} видалений адміністратором {$authUser->id}");

       // Повертаємо підтвердження видалення
       return response()->json(['message' => 'Користувача видалено']);
   }
    
    public function __construct()
    {
        $this->middleware(['auth:sanctum', 'role:admin']);
    }
}
