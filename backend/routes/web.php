<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Auth;

// Головна сторінка
Route::get('/', function () {
    return view('welcome');
});

Auth::routes(['verify' => true]);

// Маршрут для підтвердження email
Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])  
    ->name('verification.verify');

// Логін
// Route::get('/login', function () {
//     return view('auth.login');
// })->name('login');
Route::get('/', function () {
    return response()->json(['message' => 'API працює! 🎉']);
});

// Група для підтверджених користувачів
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    });
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users');
    Route::post('/admin/users/{user}/role', [UserController::class, 'updateRole'])->name('admin.users.role');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/users', [AdminController::class, 'users'])->name('admin.users');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
