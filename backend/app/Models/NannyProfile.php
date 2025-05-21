<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
        'languages', // Мови
        'additional_skills', // Додаткові навички
        'experience_years',  // Досвід роботи
        'hourly_rate',     // Оплата за годину
        'availability',
        'goat', //мета няні
        'about_me', // як проходить робота  
        'video', // відео-презентація
        'gallery', // масив фото з дітьми    
    ];

    protected $casts = [
        'birth_date' => 'date',
        'specialization' => 'array',      // Спеціалізація (масив)
        'work_schedule' => 'array', // JSON → Масив        
        'languages' => 'array',       // Мови
        'additional_skills' => 'array', // Додаткові навички (масив)
        'availability' => 'array',
        'gallery' => 'array',
    ];  

    /**
     * Зв’язок: профіль няні належить користувачеві.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function educations()
    {
        return $this->hasMany(Education::class);
    }

    public function reviews()
    {        
        return $this->hasMany(Review::class, 'nanny_id', 'user_id');
    }

    public function schedule()
    {
        return $this->hasMany(Schedule::class, 'nanny_id');
    }

    // Зв'язок з улюбленими
    public function favorites()
    {
        return $this->hasMany(FavoriteNanny::class);
    }

    public function parentReviews()
    {
        return $this->hasMany(\App\Models\ParentReview::class);
    }
    
    public function getPhotoUrl()
    {
        $defaultKey = config('files.default_nanny_photo', 'photos/nannies/default-avatar.jpg');

        if (empty($this->photo) || $this->photo === 'default-avatar.jpg' || $this->photo === $defaultKey) {
            return Storage::disk('s3')->url($defaultKey);
        }

        return Storage::disk('s3')->url($this->photo);
    }

    public function getVideoUrl()
    {
        return $this->video ? Storage::disk('s3')->url($this->video) : null;
    }


   public function getGalleryUrls()
    {
        $paths = is_array($this->gallery) ? $this->gallery : json_decode($this->gallery ?? '[]', true);

        return collect($paths ?? [])
            ->filter(fn($path) => !empty($path))
            ->map(fn($path) => Storage::disk('s3')->url($path))
            ->values()
            ->toArray();
    }

    protected $appends = ['photo_url'];

    public function getPhotoUrlAttribute()
    {
        $defaultKey = config('files.default_nanny_photo', 'photos/nannies/default-avatar.jpg');

        if (empty($this->photo) || $this->photo === 'default-avatar.jpg' || $this->photo === $defaultKey) {
            return Storage::disk('s3')->url($defaultKey);
        }

        return Storage::disk('s3')->url($this->photo);
    }

}
