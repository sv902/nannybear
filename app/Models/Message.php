<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_id',
        'sender_id',
        'message',
    ];

    /**
     * Зв’язок: повідомлення належить чату.
     */
    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }

    /**
     * Зв’язок: повідомлення має відправника.
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
