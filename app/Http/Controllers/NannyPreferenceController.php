<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\NannyPreference;

class NannyPreferenceController extends Controller
{
    public function store(Request $request)
{
        try {
            $user = Auth::user();

            $parent = $user->parentProfile;
            if (!$parent) {
                return response()->json(['error' => 'Профіль батька не знайдено'], 422);
            }

            $validated = $request->validate([
                'gender' => 'nullable|in:male,female,no_matter',
                'specialization' => 'nullable|string|max:255',
                'work_schedule' => 'nullable|string|max:255',
                'education' => 'nullable|string|max:255',
                'languages' => 'nullable|string|max:255',
                'additional_skills' => 'nullable|string|max:255',
                'experience_years' => 'nullable|numeric|min:0|max:5',
                'hourly_rate' => 'nullable|numeric|min:0|max:500',
            ]);

            $validated['parent_id'] = $parent->id;

            $preference = NannyPreference::updateOrCreate(
                ['parent_id' => $parent->id],
                $validated
            );

            return response()->json([
                'message' => 'Критерії пошуку няні оновлено',
                'preferences' => $preference
            ]);
        } catch (\Throwable $e) {
            \Log::error("❌ NannyPreferences store error: " . $e->getMessage());
            return response()->json(['error' => 'Server error', 'message' => $e->getMessage()], 500);
        }
    }


    public function show()
    {
        $user = Auth::user();
    
        if (!$user || !$user->parentProfile) {
            return response()->json(['preferences' => null], 200);
        }
    
        $preferences = \App\Models\NannyPreference::where('parent_id', $user->parentProfile->id)->first();
    
        return response()->json(['preferences' => $preferences]);
    }
    
}

