<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\Booking;

class ReviewController extends Controller
{
    /**
     * Отримання всіх відгуків для конкретної няні
     */
    public function index($nanny_id)
    {
        // $reviews = Review::with(['parent:id,name'])
        $reviews = Review::with([
            'parentProfile:id,user_id,first_name,last_name,photo'
        ])
        ->where('nanny_id', $nanny_id)
        ->orderBy('created_at', 'desc')
        ->get();

         $reviews->each(function ($review) {
        if ($review->parentProfile) {
                $review->parentProfile->append('photo_url');
            }
        });

        return response()->json($reviews);
    }

    /**
     * Створення нового відгуку
     */
   public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasRole('parent')) {
            return response()->json(['error' => 'Лише батьки можуть залишати відгуки'], 403);
        }

        $validated = $request->validate([
            'nanny_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000'
        ]);

        // Перевірка: чи вже існує відгук
        $existingReview = Review::where('parent_id', $user->id)
            ->where('nanny_id', $validated['nanny_id'])
            ->first();

        if ($existingReview) {
            return response()->json(['error' => 'Ви вже залишили відгук для цієї няні'], 400);
        }

        // 🔍 Перевірка — чи є завершене бронювання
        $bookingExists = Booking::where('parent_id', $user->id)
            ->where('nanny_id', $validated['nanny_id'])
            ->whereHas('bookingDays', function ($query) {
                $query->where(function ($q) {
                    $q->whereDate('date', '<', now()->toDateString())
                    ->orWhere(function ($q2) {
                        $q2->whereDate('date', now()->toDateString())
                            ->whereTime('end_time', '<=', now()->toTimeString());
                    });
                });
            })
            ->exists();

        if (!$bookingExists) {
            return response()->json(['error' => 'Ви можете залишити відгук лише після зустрічі з нянею'], 403);
        }

        $review = Review::create([
            'parent_id' => $user->id,
            'nanny_id' => $validated['nanny_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment']
        ]);

        return response()->json([
            'message' => 'Відгук додано успішно',
            'review' => $review
        ], 201);
    }

    /**
     * Оновлення існуючого відгуку
     */
    public function update(Request $request, $review_id)
    {
        $user = Auth::user();

        try {
            $review = Review::findOrFail($review_id);

            // Перевірка, що відгук належить поточному користувачеві
            if ($review->parent_id !== $user->id) {
                return response()->json(['error' => 'Ви не можете редагувати чужий відгук'], 403);
            }

            $validated = $request->validate([
                'rating' => 'sometimes|integer|min:1|max:5',
                'comment' => 'sometimes|string|max:1000'
            ]);

            $review->update($validated);

            return response()->json([
                'message' => 'Відгук оновлено успішно',
                'review' => $review
            ]);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    /**
     * Видалення відгуку
     */
    public function destroy($review_id)
    {
        $user = Auth::user();

        $review = Review::findOrFail($review_id);

        // Перевірка, що відгук належить поточному користувачеві
        if ($review->parent_id !== $user->id) {
            return response()->json(['error' => 'Ви не можете видалити чужий відгук'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Відгук видалено успішно']);
    }

    /**
     * Додавання відповіді від няні на відгук
     */
    public function reply(Request $request, $review_id)
    {
        $user = Auth::user();

        try {
            $review = Review::findOrFail($review_id);

            // Перевірка, що поточний користувач є нянею, якій належить відгук
            if ($review->nanny_id !== $user->id) {
                return response()->json(['error' => 'Ви не можете відповідати на чужий відгук'], 403);
            }

            $validated = $request->validate([
                'reply' => 'required|string|max:1000'
            ]);

            $review->update(['reply' => $validated['reply']]);

            return response()->json([
                'message' => 'Відповідь додано успішно',
                'review' => $review
            ]);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }
    
    public function getParentReviews($user_id)
    {
        $reviews = Review::with('nanny_profile') // якщо є зв’язок
            ->where('parent_profile_id', function ($q) use ($user_id) {
                $q->select('id')
                ->from('parent_profiles')
                ->where('user_id', $user_id)
                ->limit(1);
            })
            ->latest()
            ->get();

             $reviews->each(function ($review) {
            if ($review->parentProfile) {
                    $review->parentProfile->append('photo_url');
                }
            });

        return response()->json($reviews);
    }

    public function getReviewsAboutNanny($user_id)
    {
        $reviews = Review::with('parentProfile') // підтягуємо дані про батька
            ->where('nanny_id', $user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Додай фото_url
        $reviews->each(function ($review) {
            if ($review->parentProfile) {
                $review->parentProfile->append('photo_url');
            }
        });

        return response()->json($reviews);
    }

}
