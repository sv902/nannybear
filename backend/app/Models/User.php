<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\CustomVerifyEmail;
use Illuminate\Auth\Events\Registered;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * Масив атрибутів, які можна заповнювати через масове призначення.
     * Це означає, що ці поля можна передавати при створенні або оновленні користувача.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',        // Ім'я користувача
        'email',       // Email
        'password',    // Пароль
        'phone',       // Телефонний номер
        'city',        // Місто проживання
        'district',    // Район проживання
        'street',      // Вулиця
        'house',       // Будинок
        'profile_type',// Тип профілю (няня або батько)
        'google_id',   // ID Google-акаунту (якщо реєстрація через Google)
        'apple_id',    // ID Apple-акаунту (якщо реєстрація через Apple)
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

    /**
     * Перевіряє, чи користувач є адміністратором.
     * Використовується для перевірки доступу до адмін-панелі.
     */
    public function isAdmin()
    {
        return $this->role && $this->role->name === 'admin';
    }

    /**
     * Перевіряє, чи користувач є няньою.
     * Використовується для обмеження функціоналу лише для нянь.
     */
    public function isNanny()
    {
        return $this->role && $this->role->name === 'nanny';
    }

    /**
     * Перевіряє, чи користувач є батьком.
     * Використовується для визначення доступу до замовлень.
     */
    public function isParent()
    {
        return $this->role && $this->role->name === 'parent';
    }

    /**
     * Відношення "один-к-одному": якщо користувач – няня, у нього є профіль няні.
     * Профіль няні містить додаткову інформацію (наприклад, досвід роботи).
     */
    public function nannyProfile()
    {
        return $this->hasOne(NannyProfile::class);
    }

    /**
     * Відношення "один-к-одному" з профілем батьків.
     * Профіль містить інформацію про дітей, контакти тощо.
     */
    public function parentProfile()
    {
        return $this->hasOne(ParentProfile::class);
    }

    /**
     * Відношення "один-до-багатьох": батьки можуть створювати замовлення (шукати няню).
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'parent_id');
    }

    /**
     * Відношення "один-до-багатьох": нянь може отримувати замовлення від батьків.
     */
    public function nannyOrders()
    {
        return $this->hasMany(Order::class, 'nanny_id');
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

    public function getProfileTypeAttribute()
    {
        // Якщо роль користувача - це 'nanny', то профіль буде 'nanny'
        // Якщо роль користувача - це 'parent', то профіль буде 'parent'
        // Можна додати й інші перевірки для інших ролей, якщо потрібно

        if ($this->role && $this->role->name === 'parent') {
            return 'parent';
        } elseif ($this->role && $this->role->name === 'nanny') {
            return 'nanny';
        }

        // За замовчуванням повертаємо NULL або будь-яке інше значення
        return null;
    }
}
