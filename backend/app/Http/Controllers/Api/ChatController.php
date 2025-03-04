<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    /**
     * Отримати всі чати користувача
     */
    public function index()
    {
        $user = Auth::user();
        $chats = Chat::where('parent_id', $user->id)
            ->orWhere('nanny_id', $user->id)
            ->with(['parent', 'nanny'])
            ->get();

        return response()->json($chats);
    }

    /**
     * Створити новий чат або отримати існуючий
     */
    public function store(Request $request)
    {
        $request->validate([
            'nanny_id' => 'required|exists:users,id',
        ]);

        $chat = Chat::where('parent_id', Auth::id())
            ->where('nanny_id', $request->nanny_id)
            ->first();

        if (!$chat) {
            $chat = Chat::create([
                'parent_id' => Auth::id(),
                'nanny_id' => $request->nanny_id,
            ]);
        }

        return response()->json($chat, 201);
    }
}
