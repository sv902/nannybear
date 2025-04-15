<?php

use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Admin\AdminController;
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
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\NannyPreferenceController;
use App\Http\Controllers\Api\FavoriteNannyController;
use App\Http\Controllers\Api\UserProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Тут розміщені всі маршрути для API.
| Всі маршрути мають префікс `/api`, тому в Postman викликати їх треба так:
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/users/{user}/role', [UserController::class, 'updateRole']);
});

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});

/**
 *  АВТОРИЗАЦІЯ ТА РЕЄСТРАЦІЯ
 */
Route::post('/register', [AuthController::class, 'register']); // Реєстрація нового користувача
Route::post('/login', [AuthController::class, 'login'])->name('login'); // Вхід у систему
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum'); // Вихід

/**
 *  АВТОРИЗАЦІЯ ЧЕРЕЗ GOOGLE
 */

Route::get('/google/redirect', [AuthController::class, 'googleRedirect']); // Перенаправлення на Google
Route::get('/google/callback', [AuthController::class, 'googleCallback']); // Обробка відповіді від Google
Route::post('/google/login', [AuthController::class, 'googleCallback']);

/**
 *  АВТОРИЗАЦІЯ ЧЕРЕЗ Facebook
 */
Route::get('/facebook/redirect', [AuthController::class, 'facebookRedirect']);
Route::get('/facebook/callback', [AuthController::class, 'facebookCallback']);
Route::post('/facebook/login', [AuthController::class, 'facebookCallback']);

/**
 * ВІДНОВЛЕННЯ ПАРОЛЮ
 */
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

/**
 *  КОРИСТУВАЧІ (няні, батьки)
 */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user/{id}', [UserController::class, 'show']); // Отримати конкретного користувача
    Route::put('/user/{id}', [UserController::class, 'update']); // Оновити користувача
    Route::delete('/user', [UserController::class, 'destroySelf']); // Видалити користувача
    });

/**
 * АДМІНІСТРАТОР
 */
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/users', [AdminController::class, 'index']); // Отримати список всіх користувачів
    Route::patch('/users/{id}/role', [AdminController::class, 'updateRole']); // Оновити роль користувача
    Route::delete('/users/{id}', [AdminController::class, 'destroy']); // Видалити користувача
    });

/**
 * ПРОФІЛІ
 */
Route::middleware('auth:sanctum')->group(function () {
    // === Загальні профільні операції ===
    Route::post('/profile/create', [ProfileController::class, 'create']); 
    Route::delete('/profile/delete', [ProfileController::class, 'destroy']);

    // === БАТЬКИ ===
    Route::post('/parent/profile', [ProfileController::class, 'storeParentProfile']); // створити/оновити
    Route::get('/parent-profiles', [ParentProfileController::class, 'index']); // всі
    Route::get('/parent-profiles/{id}', [ParentProfileController::class, 'show']); // один

    // === НЯНІ ===
    Route::post('/nanny/profile', [ProfileController::class, 'storeNannyProfile']); // створити/оновити
    Route::get('/nanny/profile', [ProfileController::class, 'getNannyProfile']); 
    Route::get('/nanny-profiles', [NannyProfileController::class, 'index']); // всі
    Route::get('/nanny-profiles/{id}', [NannyProfileController::class, 'show']); // один
    Route::post('/nanny-profiles/filter', [NannyProfileController::class, 'filterNannies']); // фільтр
   
    Route::post('/nanny-preferences', [NannyPreferenceController::class, 'store']);
    Route::get('/nanny-preferences', [NannyPreferenceController::class, 'show']);

    // Вподобані няні
    Route::post('/favorite-nannies', [FavoriteNannyController::class, 'store']); // Додавання в улюблені
    Route::delete('/favorite-nannies/{id}', [FavoriteNannyController::class, 'destroy']); // Видалення з улюблених
    Route::get('/favorite-nannies', [FavoriteNannyController::class, 'index']); // Отримання списку улюблених

    Route::get('/profile/{id}', [UserProfileController::class, 'show']);
});

// Скарга на профіль
Route::middleware('auth:sanctum')->post('/reports', [ReportController::class, 'store']);

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
 *  ВІДГУКИ
 */
Route::get('/reviews/{nanny_id}', [ReviewController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    // CRUD для відгуків
    // Route::get('/reviews/{nanny_id}', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{review_id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{review_id}', [ReviewController::class, 'destroy']);

    // Додаткова можливість - відповідь від няні
    Route::post('/reviews/{review_id}/reply', [ReviewController::class, 'reply']);
});
