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
            'reason' => 'required|array|min:1',
            'details' => 'required|string|max:1100',
        ]);

        $report = Report::create([
            'reported_user_id' => $request->reported_user_id,
            'reason' => json_encode($request->reason),
            'details' => $request->details,
            'reporter_user_id' => auth()->id(), 
        ]);

        return response()->json([
            'message' => 'Скаргу успішно надіслано',
            'report' => $report,
        ], 201);
    }    
       
}
