<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class BookingController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user || !$user->parentProfile) {
            return response()->json(['error' => 'Не знайдено профіль батька'], 403);
        }

        $bookings = $user->parentProfile->bookings()
            ->with(['nanny', 'address']) // підтягуємо няню та адресу
            ->orderByDesc('date')
            ->get();

        return response()->json($bookings);
    }
    
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->parentProfile) {
            return response()->json(['error' => '❌ Тільки батьки можуть створювати бронювання'], 403);
        }

        $validated = $request->validate([
            'nanny_id' => 'required|exists:nanny_profiles,id',
            'address_id' => 'required|exists:addresses,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'payment_type' => 'required|in:card,cash',
        ]);

        // Отримуємо оплату за годину з профілю няні
        $nanny = NannyProfile::findOrFail($validated['nanny_id']);
        $hourlyRate = $nanny->hourly_rate;

        // Обчислюємо тривалість у годинах
        $duration = (strtotime($validated['end_time']) - strtotime($validated['start_time'])) / 3600;
        $total = round($duration * $hourlyRate, 2);

        $booking = Booking::create([
            'parent_id' => $user->parentProfile->id,
            'nanny_id' => $validated['nanny_id'],
            'address_id' => $validated['address_id'],
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'payment_type' => $validated['payment_type'],
            'hourly_rate' => $hourlyRate,
            'total_price' => $total,
            'status' => 'pending',
            'nanny_approval' => 'waiting',
        ]);

        return response()->json(['message' => '✅ Зустріч заплановано', 'booking' => $booking]);
    }

    public function update(Request $request, Booking $booking)
    {
        $user = Auth::user();
    
        if (!$user || $user->parentProfile->id !== $booking->parent_id) {
            return response()->json(['error' => '❌ Недоступно для цього користувача'], 403);
        }
    
        $validated = $request->validate([
            'date' => 'sometimes|date|after_or_equal:today',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'payment_type' => 'sometimes|in:card,cash',           
        ]);
    
        // Оновлюємо поля
        $booking->fill($validated);
    
        // Перевіримо, чи час змінився → якщо так, перераховуємо ціну
        if (isset($validated['start_time']) || isset($validated['end_time'])) {
            $startTime = $validated['start_time'] ?? $booking->start_time;
            $endTime = $validated['end_time'] ?? $booking->end_time;
    
            $nanny = $booking->nanny; // зв'язок з профілем няні
            $hourlyRate = $nanny->hourly_rate;
            $duration = (strtotime($endTime) - strtotime($startTime)) / 3600;
            $total = round($duration * $hourlyRate, 2);
    
            $booking->hourly_rate = $hourlyRate;
            $booking->total_price = $total;
        }
    
        $booking->save();
    
        return response()->json(['message' => '✅ Бронювання оновлено', 'booking' => $booking]);
    }
    

    public function destroy(Booking $booking)
    {
        $user = Auth::user();
        if (!$user || $user->parentProfile->id !== $booking->parent_id) {
            return response()->json(['error' => '❌ Немає прав на скасування'], 403);
        }

        $booking->delete();

        return response()->json(['message' => '✅ Бронювання скасовано']);
    }
    
    public function getBookingsForNanny()
    {
        $user = Auth::user();

        if (!$user || !$user->nannyProfile) {
            return response()->json(['error' => 'Не знайдено профіль няні'], 403);
        }

        $bookings = Booking::with(['parent.user', 'address']) // підтягуємо імʼя/фото батька та адресу
            ->where('nanny_id', $user->nannyProfile->id)
            ->with(['parent.user', 'parent.addresses'])
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($bookings);
    }


}