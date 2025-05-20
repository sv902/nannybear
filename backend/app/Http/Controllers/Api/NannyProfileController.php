<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NannyProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NannyProfileController extends Controller
{
    /**
     * Отримати список всіх профілів нянь.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $nannies = NannyProfile::with('user')
        ->withAvg('reviews', 'rating') 
        ->paginate(15);
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
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Неавторизовано'], 401);
        }

        $profile = NannyProfile::with('educations')->findOrFail($id);

        if (
            $user->hasRole('parent') ||
            ($user->hasRole('nanny') && $user->nannyProfile && $user->nannyProfile->id == $id)
        ) {
            // Додай URL-адреси до медіа
            $profile->photo = $profile->getPhotoUrl();
            $profile->video = $profile->getVideoUrl();
            $profile->gallery = $profile->getGalleryUrls();

            return response()->json($profile);
        }

        return response()->json(['message' => '🚫 Доступ заборонено'], 403);
    }      
         
    /**
     * Фільтри нянь
     */
    public function filterNannies(Request $request)
    {
        \Log::info('Received filter data', ['filters' => $request->all()]);
    
        $nannies = NannyProfile::query();
        
        // Перевірка і фільтрація за статтю
        if ($request->filled('gender') && $request->gender !== 'Немає значення') {
            $gender = is_array($request->gender) ? $request->gender[0] : $request->gender;
            \Log::info('Фільтрація за статтю', ['gender' => $gender]);
            $nannies->where('gender', $gender);
        }
    
        // Перевірка і фільтрація за спеціалізацією (JSON-масив)
        if ($request->has('specialization') && is_array($request->specialization) && count($request->specialization) > 0) {
            foreach ($request->specialization as $spec) {
                \Log::info('Фільтрація за спеціалізацією', ['specialization' => $spec]);
                $nannies->orWhereJsonContains('specialization', $spec);
            }
        }
    
        // Фільтрація за досвідом роботи
        if ($request->filled('experience_years')) {
            $nannies->where('experience_years', '>=', $request->experience_years);
        }
    
        // Фільтрація за годинною ставкою
        if ($request->filled('hourly_rate')) {
            $nannies->where('hourly_rate', '<=', $request->hourly_rate);
        }
    
        // Фільтрація за мовами (JSON-масив)
        if ($request->has('languages') && is_array($request->languages) && count($request->languages) > 0) {
            $nannies->where(function ($query) use ($request) {
                foreach ($request->languages as $lang) {
                    \Log::info('Фільтрація за мовами', ['language' => $lang]);
                    $query->orWhereJsonContains('languages', strtolower($lang));
                }
            });
        }
    
        // Фільтрація за графіком роботи
        if ($request->has('work_schedule') && is_array($request->work_schedule) && count($request->work_schedule) > 0) {
            foreach ($request->work_schedule as $schedule) {
                \Log::info('Фільтрація за графіком роботи', ['schedule' => $schedule]);
                $nannies->orWhereJsonContains('work_schedule', $schedule);
            }
        }
    
        // Фільтрація за освітою
        if ($request->has('education') && is_array($request->education) && count($request->education) > 0) {
            foreach ($request->education as $edu) {
                \Log::info('Фільтрація за освітою', ['education' => $edu]);
                $nannies->whereHas('educations', function ($query) use ($edu) {
                    $query->where('specialty', 'like', "%$edu%");
                });
            }
        }
         // Завантаження зв’язків
         $filteredNannies = $nannies->with(['user', 'educations'])->get();
    
        // Пагінація
        $perPage = 15; // Кількість результатів на сторінку
        $nanniesPaginated = $nannies->with(['user', 'educations'])->paginate($perPage);
    
        // Логи
        \Log::info('📥 Отримано фільтри', ['filters' => $request->all()]);
        \Log::info('🎯 Кількість знайдених нянь', ['count' => $nanniesPaginated->count()]);
    
        return response()->json($nanniesPaginated);
    }   
    
    public function updateHourlyRate(Request $request)
    {
        $request->validate([
            'hourly_rate' => 'required|numeric|min:0',
        ]);
    
        $nannyProfile = auth()->user()->nannyProfile;
        $nannyProfile->hourly_rate = $request->hourly_rate;
        $nannyProfile->save();
    
        return response()->json(['success' => true]);
    }

    public function getNannyProfile(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('nanny')) {
            \Log::warning("403: Доступ заборонено для користувача", ['user_id' => $user?->id]);
            return response()->json(['message' => 'Доступ заборонено'], 403);
        }

        $profile = $user->nannyProfile()->with('educations')->first();

        if (!$profile) {
            return response()->json(['message' => 'Профіль не знайдено'], 404);
        }

        // Додаємо URL-и
        $profile->photo = $profile->getPhotoUrl();
        $profile->video = $profile->getVideoUrl();
        $profile->gallery = $profile->getGalleryUrls();

        return response()->json([
            'profile' => $profile,
        ]);
    }      
               
}
