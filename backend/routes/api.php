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
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ParentReviewController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\WorkingHourController;

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

Route::post('/change-password', [AuthController::class, 'changePassword']);

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
// routes/api.php
Route::get('/nanny-profiles/user/{user_id}', function ($user_id) {
    return \App\Models\NannyProfile::where('user_id', $user_id)->firstOrFail();
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
    Route::get('/parent/profile', [ProfileController::class, 'getParentProfile']); 
    Route::get('/parent-profiles', [ParentProfileController::class, 'index']); // всі
    Route::get('/parent-profiles/{id}', [ParentProfileController::class, 'show']); // один

    // === НЯНІ ===
    Route::post('/nanny/profile', [ProfileController::class, 'storeNannyProfile']); // створити/оновити
    Route::get('/nanny/profile', [NannyProfileController::class, 'getNannyProfile']); //Особистий профіль для редагування 
    Route::get('/nanny-profiles', [NannyProfileController::class, 'index']); // всі
    Route::get('/nanny-profiles/{id}', [NannyProfileController::class, 'show']); // Перегляд профілю няні батьком
    Route::post('/nanny-profiles/filter', [NannyProfileController::class, 'filterNannies']); // фільтр
   
    Route::post('/nanny-preferences', [NannyPreferenceController::class, 'store']);
    Route::get('/nanny-preferences', [NannyPreferenceController::class, 'show']);
  
    // Вподобані няні
    Route::post('/favorite-nannies', [FavoriteNannyController::class, 'store']); // Додавання в улюблені
    Route::delete('/favorite-nannies/{id}', [FavoriteNannyController::class, 'destroy']); // Видалення з улюблених
    Route::get('/favorite-nannies', [FavoriteNannyController::class, 'index']); // Отримання списку улюблених

    Route::get('/profile/{id}', [UserProfileController::class, 'show']);    
   
    Route::put('/nanny/profile/hourly-rate', [NannyProfileController::class, 'updateHourlyRate']);
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
    
    Route::get('/reviews/parent/{user_id}', [ReviewController::class, 'getParentReviews']);
    Route::get('/reviews/about-parent/{user_id}', [ParentReviewController::class, 'getReviewsAboutParent']);

    Route::post('/parent-reviews', [ParentReviewController::class, 'store']);
    Route::get('/reviews/parent/{userId}', [ParentReviewController::class, 'showByParent']);

    // Додаткова можливість - відповідь від няні
    Route::post('/reviews/{review_id}/reply', [ReviewController::class, 'reply']);
});

// бронювання
Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/parent/bookings', [BookingController::class, 'index']);
    // Створення нового бронювання
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);

    // Отримання бронювань для батька (історія замовлень)
    Route::get('/bookings', [BookingController::class, 'index']);

    // Оновлення бронювання
    Route::put('/bookings/{id}', [BookingController::class, 'update']);

    // Видалення бронювання
    Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);

    Route::get('/nanny/bookings', [BookingController::class, 'getBookingsForNanny']);
    Route::post('/check-booking-exists', [BookingController::class, 'checkBookingExists']);
    Route::get('/nanny/bookings/stats', [BookingController::class, 'getStats']);

    Route::post('/booking-address', [ProfileController::class, 'storeAdditionalAddress']);
    Route::put('/parent/addresses/{id}', [ProfileController::class, 'updateAddress']);
    Route::delete('/parent/addresses/{id}', [ProfileController::class, 'deleteAddress']);


    Route::post('/working-hours', [WorkingHourController::class, 'store']);
    Route::get('/working-hours/{nannyId}/{date}', [WorkingHourController::class, 'getAvailableHours']);
   
    Route::get('/nanny/working-hours/{year}/{month}', [WorkingHourController::class, 'getByMonth']);
    Route::post('/working-hours/bulk', [WorkingHourController::class, 'storeBulk']);

  
    Route::delete('/working-hours/{date}', [WorkingHourController::class, 'destroyByDate']);
    Route::delete('/working-hours/{id}', [WorkingHourController::class, 'destroy']); 
    Route::get('/nanny-working-hours/{nannyId}', [WorkingHourController::class, 'getByNanny']);

});

Route::get('/nanny/{id}/bookings', [BookingController::class, 'getBookingsForPublic']);

///////////////////
Route::post('/test-video-upload', function (Request $request) {
    if (!$request->hasFile('video')) {
        return response()->json(['error' => '📭 Файл "video" не передано'], 400);
    }

    $video = $request->file('video');

    if (!$video->isValid()) {
        return response()->json(['error' => '❌ Файл пошкоджений'], 400);
    }

    $filename = 'test/video_direct_upload_' . Str::random(6) . '.' . $video->getClientOriginalExtension();
    $stream = fopen($video->getRealPath(), 'r');
    $stored = Storage::disk('s3')->put($filename, $stream);

    if (is_resource($stream)) {
        fclose($stream);
    }

    return $stored
        ? response()->json(['message' => '✅ Завантажено!', 'url' => Storage::disk('s3')->url($filename)])
        : response()->json(['error' => '❌ Не вдалося зберегти'], 500);
});