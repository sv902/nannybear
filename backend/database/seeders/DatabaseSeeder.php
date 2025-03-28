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
        $adminEmail = env('ADMIN_EMAIL', 'admin@example.com');
        $adminPassword = env('ADMIN_PASSWORD', 'password123');

        $admin = User::where('email', $adminEmail)->first();

        if (!$admin) {
            $admin = User::create([
                'email' => $adminEmail,
                'password' => Hash::make($adminPassword),
                'email_verified_at' => now(), // Адмін одразу підтверджений
            ]);
        }

        // Призначаємо роль
        $role = Role::where('name', 'admin')->first();

        if ($role) {
            $admin->role_id = $role->id;
            $admin->save();
            $admin->assignRole('admin');
        }
    }
}
