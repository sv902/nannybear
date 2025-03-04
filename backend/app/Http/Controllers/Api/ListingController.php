<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    public function index()
    {
        return response()->json(Listing::with('user')->get());
    }

    public function store(Request $request)
    {
        $listing = Listing::create($request->all());
        return response()->json(['message' => 'Оголошення створено', 'listing' => $listing], 201);
    }

    public function show($id)
    {
        return response()->json(Listing::with('user')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $listing = Listing::findOrFail($id);
        $listing->update($request->all());
        return response()->json(['message' => 'Оголошення оновлено', 'listing' => $listing]);
    }

    public function destroy($id)
    {
        Listing::destroy($id);
        return response()->json(['message' => 'Оголошення видалено']);
    } 
}
