<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ParentProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ParentProfileController extends Controller
{
    /**
     * Отримати список всіх профілів батьків.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $parents = ParentProfile::with('user')->get();
        return response()->json($parents);
    }

    /**
     * Отримати профіль конкретного батька.
     * 
     * @param int $id - ID профілю
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $profile = ParentProfile::with('user')->findOrFail($id);
        return response()->json($profile);
    }

    /**
     * Створити профіль батька.
     * 
     * 🔹 Очікує JSON-дані в `request`:
     * {
     *   "children_count": 2,
     *   "children_ages": "[3, 6]",
     *   "special_needs": "Алергія на горіхи",
     *   "preferred_language": "uk"
     * }
     * 
     * @param Request $request - Дані для створення профілю
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Якщо користувач НЕ є батьком — повертаємо помилку
        if (!$user->isParent()) {
            return response()->json(['error' => 'Тільки батьки можуть створювати цей профіль'], 403);
        }

        // Якщо батько вже має профіль — не дозволяємо створити ще один
        if ($user->parentProfile) {
            return response()->json(['error' => 'Ви вже маєте профіль батька'], 400);
        }

        if ($user->profile_type === 'parent'){       

        $validated = $request->validate([
            'children_count' => 'nullable|integer|min:1',
            'children_ages' => 'nullable|string|max:255',
            'special_needs' => 'nullable|string|max:255',
            'preferred_language' => 'nullable|string|max:255',
        ]);

        // Якщо `children_count` не передано, підставляємо значення за замовчуванням
        $validated['children_count'] = $validated['children_count'] ?? 1;

        $profile = $user->parentProfile()->create($validated);       

        return response()->json([
            'success' => true,
            'message' => 'Профіль батька створено',
            'profile' => $profile
        ], 201);
        }
    }   
}
