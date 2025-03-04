<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Перевірка та автоматичне створення профілю після підтвердження email.
     */
    public function createProfileIfNotExists()
    {
        $user = Auth::user();

        if ($user->role->name === 'nanny' && !$user->nannyProfile) {
            $user->nannyProfile()->create([
                'photo' => '',
                'experience' => '',
                'qualification' => '',
                'education' => '',
                'languages' => '',
               'availability' => json_encode(['status' => 'unavailable']),
                'hourly_rate' => 0,
            ]);
        } elseif ($user->role->name === 'parent' && !$user->parentProfile) {
            $user->parentProfile()->create([
                'children_count' => 1,
                'children_ages' => '[]',
                'special_needs' => '',
                'preferred_language' => 'uk',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Профіль перевірено або створено',
            'user' => $user->load(['nannyProfile', 'parentProfile']),
        ]);
    }

    /**
     * Оновлення профілю.
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        if ($user->role->name === 'nanny' && $user->nannyProfile) {
            $validated = $request->validate([
                'photo' => 'nullable|string',
                'experience' => 'nullable|string|max:255',
                'qualification' => 'nullable|string|max:255',
                'education' => 'nullable|string|max:255',
                'languages' => 'nullable|string|max:255',
                'availability' => 'nullable|string|max:255',
                'hourly_rate' => 'nullable|numeric|min:0',
            ]);
            $user->nannyProfile->update($validated);
        } elseif ($user->role->name === 'parent' && $user->parentProfile) {
            $validated = $request->validate([
                'children_count' => 'nullable|integer|min:1',
                'children_ages' => 'nullable|string|max:255',
                'special_needs' => 'nullable|string|max:255',
                'preferred_language' => 'nullable|string|max:255',
            ]);
            $user->parentProfile->update($validated);
        } else {
            return response()->json(['error' => 'Профіль не знайдено'], 404);
        }

        return response()->json(['message' => 'Профіль оновлено успішно']);
    }

    /**
     * Видалення профілю.
     */
    public function deleteProfile()
    {
        $user = Auth::user();

        if ($user->nannyProfile) {
            $user->nannyProfile->delete();
        } elseif ($user->parentProfile) {
            $user->parentProfile->delete();
        } else {
            return response()->json(['error' => 'Профіль не знайдено'], 404);
        }

        return response()->json(['message' => 'Профіль видалено успішно']);
    }
}
