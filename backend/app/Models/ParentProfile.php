<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',   // Ім'я користувача
        'last_name',    // Прізвище користувача
        'phone',       // Телефонний номер
        'birth_date',  // Дата народження
        'city',        // Місто проживання
        'district',    // Район проживання
        'address',      // Вулиця та будинок       
        'floor',       // Поверх
        'apartment',   // Квартира
        'children',
        'children.*.name', 
        'children.*.birth_date',
        'photo',               
    ];

    protected $casts = [
        'birth_date' => 'date',
        'children' => 'array',       
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function children()
    {
        return $this->hasMany(Child::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($parentProfile) {
            $parentProfile->nannyPreference?->delete(); // Видаляємо критерії няні
        });
    }
    
    /**
     * Відношення "один-до-багатьох": відгуки, які залишив батько.
     */
    public function reviewsGiven()
    {
        return $this->hasMany(Review::class, 'parent_id', 'user_id');
    }  
    
    public function preferences()
    {
        return $this->hasOne(\App\Models\NannyPreference::class, 'parent_id');
    }

    public function addresses()
    {
        return $this->hasMany(ParentAddress::class);
    }

    public function reviewsFromNannies()
    {
        return $this->hasMany(ParentReview::class);
    }

    public function parentReviews()
    {
        return $this->hasMany(ParentReview::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'parent_id');
    }

}
