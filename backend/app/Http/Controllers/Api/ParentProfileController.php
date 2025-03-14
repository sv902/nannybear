<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ParentProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ParentProfileController extends Controller
{
    /**
     * Отримати список всіх профілів батьків.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $parents = ParentProfile::with('user')->get();
        return response()->json($parents);
    }

    /**
     * Отримати профіль конкретного батька.
     * 
     * @param int $id - ID профілю
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $profile = ParentProfile::with('user')->findOrFail($id);
        return response()->json($profile);
    }   
}
