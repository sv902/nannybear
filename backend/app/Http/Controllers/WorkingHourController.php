<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WorkingHour;
use Illuminate\Support\Facades\Auth;

class WorkingHourController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nanny_id'    => 'required|exists:nanny_profiles,id',
            'start_date'  => 'required|date',
            'start_time'  => 'required|date_format:H:i',
            'end_time'    => 'required|date_format:H:i|after:start_time',
        ]);

        if ($validated['start_time'] === $validated['end_time']) {
            return response()->json(['error' => '❌ Початковий і кінцевий час не можуть бути однаковими'], 422);
        }

        $exists = WorkingHour::where('nanny_id', $validated['nanny_id'])
            ->where('start_date', $validated['start_date'])
            ->where('start_time', $validated['start_time'])
            ->where('end_time', $validated['end_time'])
            ->first();

        if ($exists) {
            return response()->json(['error' => '❌ Такий слот уже існує'], 409);
        }

        $validated['is_available'] = true;

        $slot = WorkingHour::create($validated);

        return response()->json(['message' => '✅ Слот збережено', 'slot' => $slot], 201);
    }

    public function getAvailableHours($nannyId, $date)
    {
        $hours = WorkingHour::where('nanny_id', $nannyId)
            ->where('start_date', $date)
            ->where('is_available', true)
            ->orderBy('start_time')
            ->get(['start_time', 'end_time']);

        return response()->json($hours);
    }

    public function destroy($id)
    {
        $slot = WorkingHour::find($id);
        if (!$slot) {
            return response()->json(['error' => 'Слот не знайдено'], 404);
        }

        $slot->delete();
        return response()->json(['message' => '✅ Слот видалено']);
    }

    public function getByMonth($year, $month)
    {
        $user = auth()->user();

        if (!$user || !$user->nannyProfile) {
            return response()->json(['message' => 'Няня не знайдена'], 403);
        }
        
        $nannyId = $user->nannyProfile->id;

        try {
            $hours = WorkingHour::where('nanny_id', $nannyId)
                ->whereYear('start_date', $year)
                ->whereMonth('start_date', $month)
                ->orderBy('start_date')
                ->orderBy('start_time')
                ->get();

            return response()->json($hours);
        } catch (\Exception $e) {
            \Log::error('❌ ПОМИЛКА getByMonth: ' . $e->getMessage());
            return response()->json(['message' => 'Помилка сервера'], 500);
        }
    }

    public function storeBulk(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'hours'      => 'nullable|array',
            'hours.*.start_time' => 'required_with:hours.*.end_time|date_format:H:i',
            'hours.*.end_time'   => 'required_with:hours.*.start_time|date_format:H:i|after:hours.*.start_time',
        ]);

        $user = Auth::user();
        if (!$user || !$user->nannyProfile) {
            return response()->json(['error' => '❌ Немає профілю няні'], 403);
        }

        $nannyId = $user->nannyProfile->id;

        // Уникнення дублікатів у масиві
        $seen = [];
        foreach ($validated['hours'] as $hour) {
            if ($hour['start_time'] === $hour['end_time']) {
                return response()->json(['error' => '❌ Час початку і завершення не можуть бути однаковими'], 422);
            }
            $key = $hour['start_time'] . '-' . $hour['end_time'];
            if (in_array($key, $seen)) {
                return response()->json(['error' => '❌ Дублікат слоту: ' . $key], 422);
            }
            $seen[] = $key;
        }

        // Очистка попередніх слотів на цю дату
        WorkingHour::where('nanny_id', $nannyId)
            ->where('start_date', $validated['start_date'])
            ->delete();

        // Створення нових слотів
        foreach ($validated['hours'] as $hour) {
            WorkingHour::create([
                'nanny_id'    => $nannyId,
                'start_date'  => $validated['start_date'],
                'start_time'  => $hour['start_time'],
                'end_time'    => $hour['end_time'],
                'is_available'=> true,
            ]);
        }

        return response()->json(['message' => '✅ Години оновлено']);
    }

    public function destroyByDate($date)
    {
        $user = auth()->user();

        if (!$user || !$user->nannyProfile) {
            return response()->json(['message' => 'Няня не знайдена'], 403);
        }

        $nannyId = $user->nannyProfile->id;

        $deleted = WorkingHour::where('nanny_id', $nannyId)
            ->where('start_date', $date)
            ->delete();

        return response()->json(['message' => "✅ Видалено $deleted слотів"]);
    }

    public function getByNanny($nannyId)
    {
        $hours = WorkingHour::where('nanny_id', $nannyId)->get();
        return response()->json($hours);
    }

    public function checkAvailability(Request $request)
    {
        $validated = $request->validate([
            'nanny_id'   => 'required|exists:nanny_profiles,id',
            'date'       => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time'   => 'required|date_format:H:i|after:start_time',
        ]);

        $available = WorkingHour::where('nanny_id', $validated['nanny_id'])
            ->where('start_date', $validated['date'])
            ->where('start_time', '<=', $validated['start_time'])
            ->where('end_time', '>=', $validated['end_time'])
            ->where('is_available', true)
            ->exists();

        return response()->json(['available' => $available]);
    }
}
