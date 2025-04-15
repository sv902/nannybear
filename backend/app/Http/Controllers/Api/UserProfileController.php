<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserProfileController extends Controller
{
    public function show($id)
    {
        $user = User::with(['nannyProfile', 'parentProfile'])->find($id);
    
        if (!$user) {
            return response()->json(['message' => 'Користувача не знайдено'], 404);
        }
    
        // Визначити роль (вона є в users.role)
        $role = $user->role;
    
        // Ім'я та прізвище — беремо з профілю залежно від ролі
        if ($role === 'nanny' && $user->nannyProfile) {
            $firstName = $user->nannyProfile->first_name;
            $lastName = $user->nannyProfile->last_name;
        } elseif ($role === 'parent' && $user->parentProfile) {
            $firstName = $user->parentProfile->first_name;
            $lastName = $user->parentProfile->last_name;
        } else {
            return response()->json(['message' => 'Профіль не знайдено'], 404);
        }
    
        return response()->json([
            'id' => $user->id,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'role' => $role,
        ]);
    }    

}
