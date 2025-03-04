<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'nanny_id',
        'rating',
        'comment',
        'reply'
    ];

    /**
     * Зв’язок: відгук належить батькові.
     */
    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    /**
     * Зв’язок: відгук належить няні.
     */
    public function nanny()
    {
        return $this->belongsTo(User::class, 'nanny_id');
    }
}
