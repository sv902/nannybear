<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'children_count',
        'children_ages',
        'special_needs',
        'preferred_language',
    ];

    /**
     * Відношення "один-до-багатьох": відгуки, які залишив батько.
     */
    public function reviewsGiven()
    {
        return $this->hasMany(Review::class, 'parent_id', 'user_id');
    }

    protected $casts = [
        'children_ages' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
