<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FavoriteNanny;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteNannyController extends Controller
{
    // Додати в улюблені
    public function store(Request $request)
    {
        \Log::info('Запит до /favorite-nannies', ['request' => $request->all()]);

        // Валідація вхідних даних
        $request->validate([
            'nanny_id' => 'required|exists:nanny_profiles,id',
        ]);

        $user = auth()->user();
        $nannyId = $request->nanny_id;

        // Перевіряємо чи ця няня не була вже додана до улюблених
        if (!$user->favoriteNannies()->where('nanny_id', $nannyId)->exists()) {
            $user->favoriteNannies()->create(['nanny_id' => $nannyId]);
        }
        \Log::info('Няня вже в улюблених', ['user_id' => $user->id, 'nanny_id' => $nannyId]);

        return response()->json(['message' => 'Няню додано до улюблених.']);
    }


    // Видалити з улюблених
    public function destroy($id)
    {
        $user = auth()->user();

        // Видаляємо улюблену няню
        $deleted = $user->favoriteNannies()->where('nanny_id', $id)->delete();

        if ($deleted) {
            return response()->json(['message' => 'Няня видалена з улюблених.']);
        }

        return response()->json(['message' => 'Няня не була знайдена серед улюблених.'], 404);
    }


    // Отримати всі улюблені
    public function index()
    {
        $user = auth()->user(); // Отримуємо поточного користувача
        
        if (!$user) {
            return response()->json(['message' => 'Користувач не авторизований'], 401);
        }
        
        // Пагінація результатів
        $favorites = $user->favoriteNannies()->with('nanny')->get();
        $favorites = $user->favoriteNannies()->with('nanny')->paginate(10); // 10 на сторінку

        return response()->json($favorites);
    }
}
