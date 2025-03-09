<?php

use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\NannyController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\NannyProfileController;
use App\Http\Controllers\Api\ParentProfileController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\VerificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Тут розміщені всі маршрути для API.
| Всі маршрути мають префікс `/api`, тому в Postman викликати їх треба так:
| http://127.0.0.1:8000/api/{маршрут}
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/users/{user}/role', [UserController::class, 'updateRole']);
});

/**
 *  АВТОРИЗАЦІЯ ТА РЕЄСТРАЦІЯ
 */
Route::post('/register', [AuthController::class, 'register']); // Реєстрація нового користувача
Route::post('/login', [AuthController::class, 'login'])->name('login'); // Вхід у систему
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum'); // Вихід

/**
 *  ВЕРИФІКАЦІЯ EMAIL (автоматично відправляється при реєстрації)
 */
Route::middleware(['auth:sanctum'])->group(function () {
    // Підтвердження email через отримане посилання
    Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
        $request->fulfill();
        return response()->json(['message' => 'Email успішно підтверджено!']);
    })->name('verification.verify'); 
    
    // Повторна відправка листа для верифікації
    Route::post('/email/resend', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Лист для підтвердження надіслано!']);
    })->name('verification.resend');
});

/**
 *  КЕРУВАННЯ КОРИСТУВАЧАМИ (тільки для авторизованих)
 */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/users', [UserController::class, 'index']); // Отримати список всіх користувачів (тільки адмін)
    Route::get('/users/{id}', [UserController::class, 'show']); // Отримати конкретного користувача
    Route::put('/users/{id}', [UserController::class, 'update']); // Оновити користувача
    Route::delete('/users/{id}', [UserController::class, 'destroy']); // Видалити користувача
    Route::patch('/users/{id}/role', [UserController::class, 'updateRole']); // Оновити роль користувача
    });

/**
 * ПРОФІЛІ
 */
Route::middleware('auth:sanctum')->group(function () {
    // Створення профілю
    Route::post('/profile/nanny', [NannyProfileController::class, 'create']);
    Route::post('/profile/parent', [ParentProfileController::class, 'create']);

    Route::get('/profile/nanny/{id}', [NannyProfileController::class, 'show']);
    Route::get('/profile/parent/{id}', [ParentProfileController::class, 'show']);
    
    // Загальні маршрути
    Route::post('/profile/check', [ProfileController::class, 'createProfileIfNotExists']);
    Route::put('/profile/update', [ProfileController::class, 'updateProfile']);
    Route::delete('/profile/delete', [ProfileController::class, 'deleteProfile']);
});

/**
 *  ЧАТ ТА ПОВІДОМЛЕННЯ
 */
Route::middleware('auth:sanctum')->group(function () {
    // Отримати всі чати поточного користувача
    Route::get('/chats', [ChatController::class, 'index']);

    // Створити новий чат (між батьком і нянею)
    Route::post('/chats', [ChatController::class, 'store']);

    // Отримати всі повідомлення конкретного чату
    Route::get('/messages/{chat_id}', [MessageController::class, 'index']);

    // Надіслати нове повідомлення
    Route::post('/messages', [MessageController::class, 'store']);
});

/**
 *  АВТОРИЗАЦІЯ ЧЕРЕЗ GOOGLE
 */
Route::get('/auth/google', [AuthController::class, 'googleRedirect']); // Перенаправлення на Google
Route::get('/auth/google/callback', [AuthController::class, 'googleCallback']); // Обробка відповіді від Google

/**
 *  АВТОРИЗАЦІЯ ЧЕРЕЗ APPLE
 */
Route::get('/auth/apple', [AuthController::class, 'redirectToApple']);
Route::get('/auth/apple/callback', [AuthController::class, 'handleAppleCallback']);

/**
 *  ОГОЛОШЕННЯ (Список доступних нянь)
 */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/nannies', [ListingController::class, 'index']); // Отримати список всіх нянь
    Route::get('/nanny/{id}', [ListingController::class, 'show']); // Отримати деталі няні
});

/**
 *  ЗАМОВЛЕННЯ (Бронювання няні)
 */
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/order', [OrderController::class, 'store']); // Створити нове замовлення
    Route::get('/orders', [OrderController::class, 'index']); // Отримати всі замовлення
});

/**
 *  ВІДГУКИ
 */
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/reviews', [ReviewController::class, 'store']); // Залишити відгук
    Route::get('/nanny/{id}/reviews', [ReviewController::class, 'index']); // Отримати всі відгуки про няню
});


