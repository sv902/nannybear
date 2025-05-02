<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'nanny_id',
    ];

    /**
     * Зв’язок: чат між батьком і нянею.
     */
    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    public function nanny()
    {
        return $this->belongsTo(User::class, 'nanny_id');
    }

    /**
     * Зв’язок: чат має багато повідомлень.
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
