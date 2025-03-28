<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NannyProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',   // Ім'я користувача
        'last_name',    // Прізвище користувача
        'phone',       // Телефонний номер
        'birth_date',  // Дата народження
        'gender',      // Стать 
        'specialization', // Спеціалізація   
        'city',        // Місто проживання
        'district',    // Район проживання       
        'photo',        
        'work_schedule',     // Графік роботи
        'education',// Освіта
        'languages', // Мови
        'additional_skills', // Додаткові навички
        'experience_years',  // Досвід роботи
        'hourly_rate',     // Оплата за годину
        'availability',       
    ];

    protected $casts = [
        'birth_date' => 'date',
        'specialization' => 'array',      // Спеціалізація (масив)
        'work_schedule' => 'array', // JSON → Масив
        'education' => 'array',
        'languages' => 'array',       // Мови
        'additional_skills' => 'array', // Додаткові навички (масив)
        'availability' => 'array',
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
