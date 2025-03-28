<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
     /**
     * Створення профілю, якщо не існує
     */
    public function create()
    {
        $user = Auth::user();

        if ($user->role?->name === 'parent' && !$user->parentProfile) {
            $user->parentProfile()->create();
            return response()->json(['message' => 'Профіль батька створено']);
        }

        if ($user->role?->name === 'nanny' && !$user->nannyProfile) {
            $user->nannyProfile()->create();
            return response()->json(['message' => 'Профіль няні створено']);
        }

        return response()->json(['message' => 'Профіль вже існує або роль невідома']);
    }
   
    /**
     * Оновлення або збереження профілю батька
     */
    public function storeParentProfile(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => '❌ User not authenticated'], 401);
        }

        // ✅ Спочатку валідація
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'district' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',           
            'floor' => 'nullable|integer|min:1',
            'apartment' => 'nullable|string|max:10',
            'phone' => 'required|string|min:10|max:15|unique:parent_profiles,phone,' . $user->id . ',user_id',
            'birth_date' => 'required|date|before:today',
            'children' => 'nullable|array',
            'children.*.name' => 'sometimes|required|string|max:255',
            'children.*.birth_date' => 'sometimes|required|date|before:today',
            'photo' => 'nullable|string',
        ]);

        // ✅ Якщо профіль ще не створений — створюємо з validated
        if (!$user->parentProfile) {
            $profile = $user->parentProfile()->create($validated);
        } else {
            $profile = $user->parentProfile;
            $profile->update($validated);
        }

        // ✅ Оновлення дітей (якщо є)
        if (isset($validated['children'])) {
            $profile->children()->delete();
            $profile->children()->createMany($validated['children']);
        }

        return response()->json([
            'message' => 'Профіль батька збережено',
            'profile' => $profile->load('children'),
        ]);
    }
    
    /**
     * Оновлення або збереження профілю няні
     */
    public function storeNannyProfile(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => '❌ User not authenticated'], 401);
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'photo' => 'nullable|string',
            'city' => 'required|string|max:100',
            'district' => 'required|string|max:100',
            'phone' => 'required|string|min:10|max:15|unique:nanny_profiles,phone,' . $user->id . ',user_id',
            'birth_date' => 'required|date|before:today',
            'gender' => 'required|in:male,female,other',
            'specialization' => 'required|array',
            'work_schedule' => 'required|array',
            'work_schedule.*' => 'string|max:255',
            'education' => 'required|array',
            'languages' => 'required|array',
            'additional_skills' => 'required|array',
            'experience_years' => 'required|numeric|min:0|max:50',
            'hourly_rate' => 'required|numeric|min:0|max:500',
            'availability' => 'nullable|array',
        ]);

         // ✅ Якщо профіль ще не створений — створюємо з validated
         if (!$user->nannyProfile) {
            $profile = $user->nannyProfile()->create($validated);
        } else {
            $profile = $user->nannyProfile;
            $profile->update($validated);
        }        

        return response()->json([
            'message' => 'Профіль няні оновлено',
            'profile' => $user->nannyProfile,
        ]);
    }

    /**
     * Видалення профілю батька або няні
     */
    public function destroy()
    {
        $user = Auth::user();
        $deleted = false;

        if ($user->nannyProfile) {
            $user->nannyProfile->delete();
            $deleted = true;
        }

        if ($user->parentProfile) {
            $user->parentProfile->nannyPreference()?->delete();
            $user->parentProfile->children()?->delete();
            $user->parentProfile->delete();
            $deleted = true;
        }

        if ($deleted) {
            return response()->json(['message' => 'Профіль успішно видалено']);
        }

        return response()->json(['error' => 'Профіль не знайдено'], 404);
    }
}