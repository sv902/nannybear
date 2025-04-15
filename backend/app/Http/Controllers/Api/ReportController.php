<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'reported_user_id' => 'required|exists:users,id',
            'reason' => 'required|string|max:255',
            'details' => 'nullable|string',
        ]);
    
        $report = Report::create([
            'reported_user_id' => $request->reported_user_id,
            'submitted_by_id' => $request->user()->id,
            'reason' => $request->reason,
            'details' => $request->details,
        ]);
    
        return response()->json(['message' => 'Скаргу успішно надіслано'], 201);
    }
}
