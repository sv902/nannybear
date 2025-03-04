<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NannyProfile;
use Illuminate\Http\Request;

class NannyProfileController extends Controller
{
    /**
     * Отримати список всіх профілів нянь.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $nannies = NannyProfile::with('user')->get();
        return response()->json($nannies);
    }

    /**
     * Отримати конкретний профіль няні за ID.
     * 
     * @param int $id - ID профілю няні
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $nanny = NannyProfile::with('user')->findOrFail($id);
        return response()->json($nanny);
    }

    /**
     * Створити новий профіль няні.   
     * }
     * 
     * @param Request $request - Дані для створення профілю
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Якщо користувач НЕ є няньою — повертаємо помилку
        if (!$user->isNanny()) {
            return response()->json(['error' => 'Тільки няні можуть створювати цей профіль'], 403);
        }

        // Якщо няня вже має профіль — не дозволяємо створити ще один
        if ($user->nannyProfile) {
            return response()->json(['error' => 'Ви вже маєте профіль няні'], 400);
        }


        if ($user->profile_type === 'nanny') {
        $validated = $request->validate([
            'photo' => 'ullable|string',
            'experience' => 'nullable|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'education' => 'rnullable|string|max:255',
            'languages' => 'nullable|string|max:255',
            'availability' => 'nullable|string|max:255',
            'hourly_rate' => 'nullable|numeric|min:0',
        ]);

        \Log::info('Validated Data:', $validated);

        $profile = $user->nannyProfile()->create($validated);       
        }
        return response()->json([
            'success' => true,
            'message' => 'Профіль няні створено',
            'profile' => $profile
        ], 201);
    }    
}
