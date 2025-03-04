<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index($nanny_id)
    {
        return response()->json(Review::where('nanny_id', $nanny_id)->get());
    }

    public function store(Request $request)
    {
        $review = Review::create($request->all());
        return response()->json(['message' => 'Відгук додано', 'review' => $review], 201);
    }
}
