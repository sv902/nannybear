<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Створення ролей
        $roles = [
            ['name' => 'admin'],
            ['name' => 'parent'],
            ['name' => 'nanny'],
        ];

        DB::table('roles')->insert($roles);

        // Створення дозволів
        $permissions = [
            ['name' => 'create_profile'],
            ['name' => 'edit_profile'],
            ['name' => 'view_profile'],
            ['name' => 'delete_profile'],
            ['name' => 'manage_users'],  // Додав дозвол на керування користувачами
            ['name' => 'manage_roles'],  // Додав дозвол на керування ролями
        ];

        DB::table('permissions')->insert($permissions);

        // Прив'язка ролей до користувачів
        // Припустимо, що id 1 - це батько, id 2 - няня, а id 3 - адміністратор
        DB::table('model_has_roles')->insert([
            ['role_id' => 1, 'model_id' => 1, 'model_type' => 'App\Models\User'], // Батько
            ['role_id' => 2, 'model_id' => 2, 'model_type' => 'App\Models\User'], // Няня
            ['role_id' => 3, 'model_id' => 3, 'model_type' => 'App\Models\User'], // Адміністратор
        ]);

        // Прив'язка дозволів до ролей
        DB::table('role_has_permissions')->insert([
            ['role_id' => 1, 'permission_id' => 1], // Батько може створювати профіль
            ['role_id' => 1, 'permission_id' => 2], // Батько може редагувати профіль
            ['role_id' => 2, 'permission_id' => 3], // Няня може переглядати профіль
            ['role_id' => 2, 'permission_id' => 4], // Няня може видаляти профіль
            ['role_id' => 3, 'permission_id' => 5], // Адміністратор може керувати користувачами
            ['role_id' => 3, 'permission_id' => 6], // Адміністратор може керувати ролями
        ]);
    }
}
