<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(Order::with(['parent', 'nanny'])->get());
    }

    public function store(Request $request)
    {
        $order = Order::create($request->all());
        return response()->json(['message' => 'Замовлення створено', 'order' => $order], 201);
    }

    public function show($id)
    {
        return response()->json(Order::with(['parent', 'nanny'])->findOrFail($id));
    }
}
