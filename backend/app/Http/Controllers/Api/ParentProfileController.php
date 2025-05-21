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
         $parents->transform(function ($parent) {
            $parent->photo_url = $parent->photo; 
            return $parent;
        });      
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
        $profile = \App\Models\ParentProfile::with(['user', 'children', 'addresses'])->findOrFail($id);
        $profile->photo_url = $profile->photo;
        return response()->json($profile);
    }  
}
