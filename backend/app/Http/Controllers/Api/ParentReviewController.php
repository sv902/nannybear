<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ParentReview;

class ParentReviewController extends Controller
{
    public function showByParent($userId)
    {
        $reviews = \App\Models\ParentReview::with([
            'nanny.user',              // дані про користувача няні
            'parent.user',             // дані про користувача батька
        ])
        ->whereHas('parent', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })
        ->orderByDesc('created_at')
        ->get();

         $reviews->each(function ($review) {
                if ($review->nanny) {
                    $review->nanny->append('photo_url');
                }
            
            });

        return response()->json($reviews);
    }


    public function store(Request $request)
    {
        $nanny = Auth::user()->nannyProfile;

        if (!$nanny) {
            return response()->json(['error' => 'Тільки няня може залишити відгук'], 403);
        }

        $validated = $request->validate([
            'parent_profile_id' => 'required|exists:parent_profiles,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'is_anonymous' => 'nullable|boolean',
        ]);

        // 👉 Перевірка: чи вже існує такий відгук
        $existingReview = ParentReview::where('nanny_profile_id', $nanny->id)
            ->where('parent_profile_id', $validated['parent_profile_id'])
            ->first();

        if ($existingReview) {
            return response()->json(['error' => 'Ви вже залишили відгук цьому батькові'], 400);
        }

        // Створення відгуку
        $review = $nanny->parentReviews()->create([
            'parent_profile_id' => $validated['parent_profile_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'is_anonymous' => $validated['is_anonymous'] ?? false,
        ]);

        return response()->json(['message' => 'Відгук збережено', 'review' => $review]);
    }

    public function getReviewsAboutParent($user_id)
    {
        $reviews = ParentReview::with('nanny') // Підтягнемо ім’я та фото няні
            ->whereHas('parent', function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            })
            ->orderBy('created_at', 'desc')
            ->get();

             $reviews->each(function ($review) {
                if ($review->nanny) {
                    $review->nanny->append('photo_url');
                }
            
            });

        return response()->json($reviews);
    }

}
