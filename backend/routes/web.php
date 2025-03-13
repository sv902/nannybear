<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Auth;

// Головна сторінка або статус API
Route::get('/', function () {
    return response()->json(['message' => 'API працює! 🎉']);
});

// Маршрут для підтвердження email
Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])  
    ->name('verification.verify');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Доступ до дашборду дозволено']);
    });
});

// Адмін-панель (лише для адмінів)
// Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
//     Route::get('/users', [AdminController::class, 'index'])->name('admin.users'); // Отримати список користувачів
//     Route::get('/users/{id}', [UserController::class, 'show']); // Отримати конкретного користувача
//     Route::put('/users/{id}', [UserController::class, 'update']); // Оновити користувача
//     Route::delete('/users/{id}', [AdminController::class, 'destroy']); // Видалити користувача
//     Route::patch('/users/{id}/role', [AdminController::class, 'updateRole'])->name('admin.users.role'); // Змінити роль
// });


// Передача всіх маршрутів фронтенду React
Route::get('/{any}', function () {
   // return view('app'); // Віддає головний файл React (якщо використовуєш Blade)
})->where('any', '.*');
