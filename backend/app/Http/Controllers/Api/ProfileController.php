<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Автоматичне створення профілю після підтвердження email.
     */
    public function createProfileIfNotExists()
    {
        $user = Auth::user();

        if ($user->hasRole('nanny') && !$user->nannyProfile) {
            $profile = $user->nannyProfile()->create([
                'photo' => '',              
                'qualification' => '',
                'education' => '',
                'languages' => json_encode([]),
                'availability' => json_encode(['status' => 'unavailable']),
                'nanny_type' => json_encode([]),
                'schedule_type' => '',
                'employment_duration' => '',
                'additional_skills' => json_encode([]),
                'experience_years' => 0,
                'gender' => null,
                'payment_level' => '',
            ]);
            return response()->json(['message' => 'Профіль няні створено', 'profile' => $profile], 201);
        }

        if ($user->hasRole('parent') && !$user->parentProfile) {
            $profile = $user->parentProfile()->create([
                'children_count' => 1,
                'children_ages' => '[]',
                'special_needs' => '',
                'preferred_language' => 'uk',
            ]);
            return response()->json(['message' => 'Профіль батька створено', 'profile' => $profile], 201);
        }

        return response()->json(['error' => 'Профіль вже існує або створення неможливе'], 400);
    }


    /**
     * Оновлення профілю.
     */
    public function update(Request $request)
    {
        $user = Auth::user();

         // Перевірка для няні
        if ($user->hasRole('nanny') && $user->nannyProfile) {
        // Перевірка, чи профіль належить цьому користувачеві
        if ($user->nannyProfile->user_id !== $user->id) {
            return response()->json(['error' => 'Ви не можете редагувати профіль іншої няні'], 403);
        }    

            $validated = $request->validate([
                'photo' => 'nullable|string',             
                'qualification' => 'nullable|string|max:255',
                'education' => 'nullable|string|max:255',
                'languages' => 'nullable|array',
                'availability' => 'nullable|array',
                'nanny_type' => 'nullable|array',
                'schedule_type' => 'nullable|string',
                'employment_duration' => 'nullable|string',
                'additional_skills' => 'nullable|array',
                'experience_years' => 'nullable|integer|min:0',
                'gender' => 'nullable|in:male,female,other',
                'payment_level' => 'nullable|string',
            ]);
    
            $user->nannyProfile->update($validated);
    
            return response()->json(['message' => 'Профіль няні оновлено', 'profile' => $user->nannyProfile]);
        }
    
        
        if ($user->hasRole('parent') && $user->parentProfile) {
        // Перевірка, чи профіль належить цьому користувачеві
        if ($user->parentProfile->user_id !== $user->id) {
            return response()->json(['error' => 'Ви не можете редагувати профіль іншого батька'], 403);
        }

            $validated = $request->validate([
                'children_count' => 'nullable|integer|min:1',
                'children_ages' => 'nullable|string|max:255',
                'special_needs' => 'nullable|string|max:255',
                'preferred_language' => 'nullable|string|max:255',
            ]);
    
            $user->parentProfile->update($validated);
    
            return response()->json(['message' => 'Профіль батька оновлено', 'profile' => $user->parentProfile]);
        }
    
        return response()->json(['error' => 'Профіль не знайдено'], 404);
    }
    
    /**
     * Видалення профілю.
     */
    public function destroy()
    {
        $user = Auth::user();

        if ($user->nannyProfile) {
            $user->nannyProfile->delete();
            return response()->json(['message' => 'Профіль няні видалено']);
        }

        if ($user->parentProfile) {
            $user->parentProfile->delete();
            return response()->json(['message' => 'Профіль батька видалено']);
        }

        return response()->json(['error' => 'Профіль не знайдено'], 404);
    }

}