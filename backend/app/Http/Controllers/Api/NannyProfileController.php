<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NannyProfile;
use Illuminate\Http\Request;

class NannyProfileController extends Controller
{
    /**
     * Отримати список всіх профілів нянь.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $nannies = NannyProfile::with('user')->get();
        return response()->json($nannies);
    }

    /**
     * Отримати конкретний профіль няні за ID.
     * 
     * @param int $id - ID профілю няні
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $nanny = NannyProfile::with('user')->findOrFail($id);
        return response()->json($nanny);
    }   
}
