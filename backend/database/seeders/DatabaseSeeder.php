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
        $this->call(RoleSeeder::class);

        // Створюємо адміністратора
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
        ]);
        $admin->assignRole('admin');

        // Створюємо 3 батьків
        User::factory(3)->create()->each(function ($user) {
            $user->assignRole('parent');
        });

        // Створюємо 3 нянь
        User::factory(3)->create()->each(function ($user) {
            $user->assignRole('nanny');
        });
    }
}
