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
        'name' => 'Admin',
        'password' => Hash::make(env('ADMIN_PASSWORD', 'password123')),
        'role' => 'admin',
        'email_verified_at' => now(), // Адмін одразу підтверджений
    ]);
    }
}
