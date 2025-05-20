<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingDay;
use App\Models\WorkingHour;
use App\Models\NannyProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\BookingCancelled;

class BookingController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!$user || !$user->parentProfile) {
            return response()->json(['error' => 'Не знайдено профіль батька'], 403);
        }

        $bookings = $user->parentProfile->bookings()
            ->with(['nanny.user', 'address', 'bookingDays']) // ➕ додано 'bookingDays'
            ->orderByDesc('start_date')
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
            'address_id' => 'required|exists:parent_addresses,id',
            'payment_type' => 'required|in:card,cash',
            'booking_days' => 'required|array|min:1',
            'booking_days.*.date' => 'required|date|after_or_equal:today',
            'booking_days.*.start_time' => 'required|date_format:H:i:s',
            'booking_days.*.end_time' => 'required|date_format:H:i:s',
        ]);
    
        // Завантажуємо дані про няню
        $nanny = NannyProfile::findOrFail($validated['nanny_id']);
        // Присвоюємо значення ставки за годину
        $hourlyRate = $nanny->hourly_rate;
    
        $total = 0;
    
        foreach ($validated['booking_days'] as $day) {
            $date = $day['date'];
            $start = strtotime("$date {$day['start_time']}");
            $end = strtotime("$date {$day['end_time']}");
    
            if ($end <= $start) {
                return response()->json(['error' => "❌ Кінцевий час повинен бути після початку: $date"], 422);
            }
    
            $slotsToBook = [];
            for ($t = $start; $t < $end; $t += 3600) {
                $startFormatted = date('H:i:s', $t);
                $endFormatted = date('H:i:s', $t + 3600);
    
                $slot = WorkingHour::where([
                    'nanny_id' => $validated['nanny_id'],
                    'start_date' => $date,
                    'start_time' => $startFormatted,
                    'end_time' => $endFormatted,
                    'is_available' => true,
                ])->first();
    
                if (!$slot) {
                    return response()->json(['error' => "❌ Немає вільного слоту: $date $startFormatted - $endFormatted"], 422);
                }
    
                $slotsToBook[] = $slot;
            }
    
            // Загальна вартість
            $hours = ($end - $start) / 3600;
            $total += $hours * $hourlyRate;
    
            // Позначити як заброньовані
            foreach ($slotsToBook as $slot) {
                $slot->is_available = false;
                $slot->save();
            }
        }
    
        // Зберігаємо бронювання
        $startDate = collect($validated['booking_days'])->min('date');
        $endDate = collect($validated['booking_days'])->max('date');
    
        $booking = Booking::create([
            'parent_id' => $user->parentProfile->id,
            'nanny_id' => $validated['nanny_id'],
            'address_id' => $validated['address_id'],
            'start_date' => $startDate,
            'end_date' => $endDate,
            'start_time' => $validated['booking_days'][0]['start_time'],
            'end_time' => $validated['booking_days'][count($validated['booking_days']) - 1]['end_time'],
            'payment_type' => $validated['payment_type'],
            'hourly_rate' => $hourlyRate,
            'total_price' => $total,
            'status' => 'pending',
            'nanny_approval' => 'waiting',
        ]);
    
        foreach ($validated['booking_days'] as $day) {
            BookingDay::create([
                'booking_id' => $booking->id,
                'date' => $day['date'],
                'start_time' => $day['start_time'],
                'end_time' => $day['end_time'],
            ]);
        }
    
        return response()->json(['message' => '✅ Зустріч заплановано', 'booking' => $booking]);
    }
    
    
    public function destroy($id)
    {
        $user = Auth::user();
        $booking = Booking::with('bookingDays')->findOrFail($id);

        if (!$user || (
            (!$user->parentProfile || $user->parentProfile->id !== $booking->parent_id) &&
            (!$user->nannyProfile || $user->nannyProfile->id !== $booking->nanny_id)
        )) {
            return response()->json(['error' => '❌ Немає прав на скасування'], 403);
        }

        try {
           foreach ($booking->bookingDays as $day) {
    $start = strtotime($day->date . ' ' . $day->start_time);
    $end = strtotime($day->date . ' ' . $day->end_time);

    for ($t = $start; $t < $end; $t += 3600) {
        $slotStart = date('H:i:s', $t);
        $slotEnd = date('H:i:s', $t + 3600);

        $updated = WorkingHour::where([
            'nanny_id' => $booking->nanny_id,
            'start_date' => $day->date,
            'start_time' => $slotStart,
            'end_time' => $slotEnd,
        ])->update(['is_available' => true]);

        \Log::info("🔁 Розблоковано слот $day->date $slotStart-$slotEnd | Оновлено: $updated");
    }
}


            event(new BookingCancelled($booking));

            $booking->bookingDays()->delete();
            $booking->delete();

            

            return response()->json(['message' => '✅ Бронювання скасовано']);
        } catch (\Exception $e) {
            \Log::error('❌ Booking deletion error', ['message' => $e->getMessage()]);
            return response()->json(['error' => '❌ Помилка при скасуванні бронювання'], 500);
        }
    }    

    public function getBookingsForNanny()
    {
        $user = Auth::user();
        if (!$user || !$user->nannyProfile) {
            return response()->json(['error' => 'Не знайдено профіль няні'], 403);
        }

        $bookings = Booking::with(['parent.user', 'address', 'bookingDays'])
            ->where('nanny_id', $user->nannyProfile->id)
            ->orderBy('start_date', 'desc')
            ->get();

        return response()->json($bookings);
    }

    public function show($id)
    {
        $user = Auth::user();

        $booking = Booking::with([
            'nanny.user',
            'parent.user',
            'address',
            'bookingDays'
        ])->find($id);

        if (!$booking) {
            return response()->json(['error' => 'Бронювання не знайдено'], 404);
        }

        // Перевірка доступу (замість canAccessBooking)
        if (
            (!$user->parentProfile || $user->parentProfile->id !== $booking->parent_id) &&
            (!$user->nannyProfile || $user->nannyProfile->id !== $booking->nanny_id)
        ) {
            return response()->json(['error' => 'Доступ заборонено'], 403);
        }

        return response()->json([
            'id' => $booking->id,
            'payment_type' => $booking->payment_type,
            'total_price' => $booking->total_price,
            'hourly_rate' => $booking->hourly_rate,
            'address' => $booking->address,
            'nanny' => [
                'id' => $booking->nanny->id,
                'user_id' => $booking->nanny->user->id,
                'first_name' => $booking->nanny->user->first_name,
                'last_name' => $booking->nanny->user->last_name,
                'photo' => $booking->nanny->photo,
            ],
            'parent' => [
                'id' => $booking->parent->id,
                'user_id' => $booking->parent->user->id,
                'first_name' => $booking->parent->user->first_name,
                'last_name' => $booking->parent->user->last_name,
                'photo' => $booking->parent->photo, 
            ],

            'booking_days' => $booking->bookingDays->map(function ($day) {
                return [
                    'date' => $day->date,
                    'start_time' => $day->start_time,
                    'end_time' => $day->end_time,
                ];
            }),
        ]);
    }

    
    public function checkBookingExists(Request $request)
    {
        $nannyId = $request->nanny_id;
        $dates = collect($request->booking_days)->pluck('date');

        $exists = \App\Models\BookingDay::whereHas('booking', function ($query) use ($nannyId) {
            $query->where('nanny_id', $nannyId);
        })->whereIn('date', $dates)->exists();

        return response()->json(['exists' => $exists]);
    }

    public function getStats(Request $request)
    {
        $year = $request->query('year', now()->year);
        $nannyId = Auth::user()->nannyProfile->id;

        $stats = Booking::where('nanny_id', $nannyId)
            ->whereYear('start_date', $year)
            ->selectRaw('MONTH(start_date) as month, COUNT(*) as value')
            ->groupBy('month')
            ->pluck('value', 'month');

        $months = ['СІЧ','ЛЮТ','БЕР','КВІ','ТРА','ЧЕР','ЛИП','СЕР','ВЕР','ЖОВ','ЛИС','ГРУ'];

        $result = [];
        foreach (range(1, 12) as $i) {
            $result[] = [
                'month' => $months[$i - 1],
                'value' => $stats[$i] ?? 0,
            ];
        }

        return response()->json($result);
    }

    public function getBookingsForPublic($id)
    {
        $bookings = Booking::with('bookingDays')
            ->where('nanny_id', $id)
            ->where('status', '!=', 'cancelled') // або без фільтру
            ->get();

        return response()->json($bookings);
    }

}
