<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Auth;

// Головна сторінка або статус API
Route::get('/', function () {
    return response()->json(['message' => 'API працює! 🎉']);
});

//Auth::routes(['verify' => true]);

// Маршрут для підтвердження email
Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])  
    ->name('verification.verify');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Доступ до дашборду дозволено']);
    });
});

// Адмін панель (тільки для адміністраторів)
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
   // Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/users', [UserController::class, 'index'])->name('admin.users');
    Route::post('/users/{user}/role', [UserController::class, 'updateRole'])->name('admin.users.role');
});
//Auth::routes();
// Передача всіх маршрутів фронтенду React
Route::get('/{any}', function () {
   // return view('app'); // Віддає головний файл React (якщо використовуєш Blade)
})->where('any', '.*');
