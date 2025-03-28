<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\CustomVerifyEmail;
use App\Notifications\CustomResetPassword;
use Illuminate\Auth\Events\Registered;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasRoles;
    
    protected $guard_name = 'web';
    /**
     * Масив атрибутів, які можна заповнювати через масове призначення.
     * Це означає, що ці поля можна передавати при створенні або оновленні користувача.
     *
     * @var array<string>
     */
    protected $fillable = [        
        'email',        // Email
        'password',    // Пароль     
        'google_id',   // ID Google-акаунту (якщо реєстрація через Google)
        'facebook_id',  // ID Facebook-акаунту (якщо реєстрація через Facebook)
        'role_id',     // ID ролі користувача
    ];

    /**
     * Масив атрибутів, які повинні бути приховані під час серіалізації.
     * Це важливо для безпеки, наприклад, щоб приховати пароль.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Автоматичне перетворення типів для певних атрибутів.
     * перетворення пароля у хеш та дати у формат `datetime`.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime', // Автоматичне перетворення дати
            'password' => 'hashed',           // Автоматичне хешування пароля            
        ];
    }

    /**
     * Відношення "один-к-одному" з роллю користувача.
     * Кожен користувач має лише **одну роль**.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function hasRole($role)
    {
        return $this->roles()->where('name', $role)->exists();
    }

    /**
     * Перевіряє, чи користувач є адміністратором.
     * Використовується для перевірки доступу до адмін-панелі.
     */
    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    /**
     * Перевіряє, чи користувач є няньою.
     * Використовується для обмеження функціоналу лише для нянь.
     */
    public function isNanny()
    {
        return $this->hasRole('nanny');
    }

    /**
     * Перевіряє, чи користувач є батьком.
     * Використовується для визначення доступу до замовлень.
     */
    public function isParent()
    {
        return $this->hasRole('parent');
    }

    public function parentProfile()
    {
        return $this->hasOne(\App\Models\ParentProfile::class);
    }

    public function nannyProfile()
    {
        return $this->hasOne(\App\Models\NannyProfile::class);
    }

    // Визначає, який профіль має користувач
    public function profile()
    {
        if ($this->role && $this->role->name === 'nanny') {
            return $this->hasOne(NannyProfile::class, 'user_id');
        } else {
            return $this->hasOne(ParentProfile::class, 'user_id');
        }
    }
    
    public function nannyPreferences()
    {
        return $this->hasOne(NannyPreference::class);
    }
   
    /**
     * Відношення "один-до-багатьох": відгуки, які отримала няня.
     * Відгуки залишають батьки після надання послуг.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class, 'nanny_id');
    }

    /**
     * Відношення "один-до-багатьох": відгуки, які залишив батько няням.
     */
    public function givenReviews()
    {
        return $this->hasMany(Review::class, 'parent_id');
    }

    /**
     * Надсилає email для підтвердження реєстрації користувача.
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new CustomVerifyEmail);
    } 
    /**
     * Надсилає email для скидання пароля користувача.
    */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new CustomResetPassword($token));
    } 

    public function getProfileTypeAttribute()
    {
        // Якщо роль користувача - це 'nanny', то профіль буде 'nanny'
        // Якщо роль користувача - це 'parent', то профіль буде 'parent'       

        if ($this->role && $this->role->name === 'parent') {
            return 'parent';
        } elseif ($this->role && $this->role->name === 'nanny') {
            return 'nanny';
        }
   
        return null;
    }
    
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($user) {
            $user->profile()?->delete(); // Видаляємо профіль користувача
        });
    }

    // Для адміна
    public function mustVerifyEmail()
    {
        return $this->role?->name !== 'admin'; 
    }    
}
