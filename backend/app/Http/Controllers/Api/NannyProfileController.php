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
         // Створюємо базовий запит на отримання всіх нянь
         $nannies = NannyProfile::query();
     
         // Фільтрація за типом няні
         if ($request->has('nanny_type')) {
             $nannies->whereIn('nanny_type', $request->input('nanny_type'));
         }
     
         // Фільтрація за графіком
         if ($request->has('schedule_type')) {
             $nannies->whereIn('schedule_type', $request->input('schedule_type'));
         }
     
         // Фільтрація за тривалістю найму
         if ($request->has('employment_duration')) {
             $nannies->where('employment_duration', $request->input('employment_duration'));
         }
     
         // Фільтрація за додатковими навичками
         if ($request->has('additional_skills')) {
             $nannies->whereJsonContains('additional_skills', $request->input('additional_skills'));
         }
     
         // Фільтрація за освітою
         if ($request->has('education')) {
             $nannies->where('education', $request->input('education'));
         }
     
         // Фільтрація за досвідом роботи
         if ($request->has('experience_years')) {
             $nannies->where('experience_years', '>=', $request->input('experience_years'));
         }
     
         // Фільтрація за статтю
         if ($request->has('gender')) {
             $nannies->where('gender', $request->input('gender'));
         }
     
         // Фільтрація за мовами
         if ($request->has('languages')) {
             $nannies->whereJsonContains('languages', $request->input('languages'));
         }
     
         // Фільтрація за місцем проживання
         if ($request->has('location_preference')) {
             $nannies->where('location_preference', $request->input('location_preference'));
         }
     
         // Фільтрація за рівнем оплати
         if ($request->has('payment_level')) {
             $nannies->where('payment_level', '>=', $request->input('payment_level'));
         }
     
         // Отримуємо результат
         $filteredNannies = $nannies->get();
     
         return response()->json($filteredNannies);
     }
     
}
