<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\NannyPreference;

class NannyPreferenceController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();

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

        $preference = $user->nannyPreferences()->updateOrCreate([], $validated);

        return response()->json([
            'message' => 'Критерії пошуку няні оновлено',
            'preferences' => $preference
        ]);
    }

    public function show()
    {
        $user = Auth::user();
        return response()->json([
            'preferences' => $user->nannyPreferences ?? null
        ]);
    }
}

