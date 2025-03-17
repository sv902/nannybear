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
        'qualification',
        'education',// Освіта
        'languages',
        'availability',
        'nanny_type',        // Тип няні
        'schedule_type',     // Графік роботи
        'employment_duration', // Тривалість роботи
        'additional_skills', // Додаткові навички
        'experience_years',  // Досвід роботи
        'gender',            // Стать    
        'payment_level',     // Рівень оплати
    ];

    protected $casts = [
        'availability' => 'array',
        'survey_answers' => 'array', // JSON → Масив
        'languages' => 'array',       // Мови
        'nanny_type' => 'array',      // Типи няні (масив)
        'additional_skills' => 'array', // Додаткові навички (масив)
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
