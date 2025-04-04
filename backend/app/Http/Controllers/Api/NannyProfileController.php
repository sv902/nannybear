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
     * Фільтри нянь
     */
    public function filterNannies(Request $request)
    {
        $nannies = NannyProfile::query();

        // ✅ Стать (string або масив з одним елементом)
        if ($request->filled('gender')) {
            $gender = is_array($request->gender) ? $request->gender[0] : $request->gender;
            $nannies->where('gender', $gender);
        }

        // ✅ Спеціалізація (JSON-масив)
        if ($request->has('specialization') && is_array($request->specialization)) {
            $nannies->where(function ($query) use ($request) {
                foreach ($request->specialization as $spec) {
                    $nannies->whereJsonContains('specialization', strtolower($spec));
                }
            });
        }

        // ✅ Графік роботи (JSON-масив)
        if ($request->has('work_schedule') && is_array($request->work_schedule)) {
            $nannies->where(function ($query) use ($request) {
                foreach ($request->work_schedule as $schedule) {
                    $query->orWhereJsonContains('work_schedule', $schedule);
                }
            });
        }

        // ✅ Ставка
        if ($request->filled('hourly_rate')) {
            $nannies->where('hourly_rate', '<=', $request->hourly_rate);
        }

        // ✅ Досвід
        if ($request->filled('experience_years')) {
            $nannies->where('experience_years', '>=', $request->experience_years);
        }

        // ✅ Навички (JSON-масив)
        if ($request->has('additional_skills') && is_array($request->additional_skills)) {
            $nannies->where(function ($query) use ($request) {
                foreach ($request->additional_skills as $skill) {
                    $query->orWhereJsonContains('additional_skills', $skill);
                }
            });
        }

        // ✅ Освіта (зв’язок)
        if ($request->has('education') && is_array($request->education)) {
            $nannies->whereHas('educations', function ($q) use ($request) {
                $q->whereIn('specialty', $request->education);
            });
        }

        // ✅ Мови (JSON-масив)
        if ($request->has('languages') && is_array($request->languages)) {
            $nannies->where(function ($query) use ($request) {
                foreach ($request->languages as $lang) {
                    $query->orWhereJsonContains('languages', $lang);
                }
            });
        }

        // ✅ Локація (опціонально)
        if ($request->filled('location_preference')) {
            $nannies->where(function ($query) use ($request) {
                $query->where('city', 'like', '%' . $request->location_preference . '%')
                    ->orWhere('district', 'like', '%' . $request->location_preference . '%');
            });
        }

        // 🔁 Завантаження зв’язків
        $filteredNannies = $nannies->with(['user', 'educations'])->get();

        // 🔍 Логи
        \Log::info('📥 Отримано фільтри', ['filters' => $request->all()]);
        \Log::info('🎯 Кількість знайдених нянь', ['count' => $filteredNannies->count()]);
        \Log::info('🧪 specialization', ['value' => $request->specialization ?? []]);

        return response()->json($filteredNannies);
    }    
}
