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
     * вивести профіль саме залогіненого користувача (няні) 
     */

    public function me()
    {
        $user = auth()->user();

        \Log::info('Отримано профіль користувача:', [$user]);

        if (!$user || !$user->nannyProfile) {
            return response()->json(['message' => 'Профіль няні не знайдено'], 404);
        }

        return response()->json($user->nannyProfile->load('user'));
    }

    
    /**
     * Фільтри нянь
     */

     public function filterNannies(Request $request)
     {
         // Створюємо базовий запит на отримання всіх нянь
         $nannies = NannyProfile::query();
     
         // Фільтрація за спеціалізацією (масив JSON)
         if ($request->filled('specialization')) {
             $nannies->whereJsonContains('specialization', $request->input('specialization'));
         }
     
         // Фільтрація за графіком (масив JSON)
         if ($request->filled('work_schedule')) {
             $nannies->whereJsonContains('work_schedule', $request->input('work_schedule'));
         }
     
         // Фільтрація за погодинною оплатою (діапазон)
         if ($request->has('hourly_rate')) {
             $nannies->where('hourly_rate', '>=', $request->input('hourly_rate'));
         }
     
         // Фільтрація за додатковими навичками (масив JSON)
         if ($request->has('additional_skills')) {
             $nannies->whereJsonContains('additional_skills', $request->input('additional_skills'));
         }
     
         // Фільтрація за освітою (масив JSON)
         if ($request->has('education')) {
             $nannies->whereJsonContains('education', $request->input('education'));
         }
     
         // Фільтрація за досвідом роботи (діапазон)
         if ($request->has('experience_years')) {
             $nannies->where('experience_years', '>=', $request->input('experience_years'));
         }
     
         // Фільтрація за статтю
         if ($request->has('gender')) {
             $nannies->where('gender', $request->input('gender'));
         }
     
         // Фільтрація за мовами (масив JSON)
         if ($request->has('languages')) {
             $nannies->whereJsonContains('languages', $request->input('languages'));
         }
     
         // Фільтрація за місцем проживання
         if ($request->filled('location_preference')) {
             $nannies->where('city', 'like', '%'.$request->input('location_preference').'%')
                     ->orWhere('district', 'like', '%'.$request->input('location_preference').'%');
         }
     
         // Отримуємо результат
         $filteredNannies = $nannies->get();
     
         return response()->json($filteredNannies);
     }     
}
