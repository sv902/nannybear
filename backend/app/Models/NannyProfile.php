<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NannyProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'photo',
        'experience',
        'qualification',
        'education',
        'languages',
        'availability',
        'hourly_rate',
    ];

    protected $casts = [
        'survey_answers' => 'array', // JSON → Масив
    ];

    /**
     * Зв’язок: профіль няні належить користувачеві.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'nanny_id');
    }

    public function schedule()
    {
        return $this->hasMany(Schedule::class, 'nanny_id');
    }
}
