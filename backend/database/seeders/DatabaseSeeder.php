<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     *  Заповнення БД початковими даними.
     */
    public function run(): void
    {
        // Спочатку створимо ролі
        $this->call(RolesAndPermissionsSeeder::class);
    
       // Створюємо адміна, якщо він ще не існує
       User::firstOrCreate([
        'email' => env('ADMIN_EMAIL', 'admin@example.com'),
    ], [
        'first_name' => 'Admin',
        'last_name' => 'Administrator',  
        'password' => Hash::make(env('ADMIN_PASSWORD', 'password123')),
        'role_id' => $adminRole->id ?? 1,
        'birth_date' => '1990-01-01',
        'phone' => '+1234567890',
        'city' => 'Kyiv',
        'email_verified_at' => now(), // Адмін одразу підтверджений
    ]);
    }
}
