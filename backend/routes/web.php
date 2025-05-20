<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Models\User;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\File;

use Illuminate\Support\Facades\Storage;

// Підтвердження email через посилання
Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    $user = User::findOrFail($id);

    if (!hash_equals($hash, sha1($user->getEmailForVerification()))) {
        abort(403, 'Недійсне посилання для підтвердження email');
    }

    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        event(new \Illuminate\Auth\Events\Verified($user));
    }

    // ✅ Передача email і ролі у URL frontend-сторінки
    return redirect()->to(env('FRONTEND_URL') . '/email-verified?email=' . urlencode($user->email) . '&role=' . $user->getRoleNames()->first());
})->middleware('signed')->name('verification.verify');

// Повторна відправка листа
Route::post('/email/resend', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Лист для підтвердження надіслано!']);
})->name('verification.resend');

// відновлення паролю
Route::get('/reset-password/{token}', function () {
    return File::get(public_path('index.html'));
})->where('token', '.*');


// Route::middleware(['auth', 'profile.complete'])->group(function () {
//     Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
// });

// Адмін-панель (лише для адмінів)
// Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
//     Route::get('/users', [AdminController::class, 'index'])->name('admin.users'); // Отримати список користувачів
//     Route::get('/users/{id}', [UserController::class, 'show']); // Отримати конкретного користувача
//     Route::put('/users/{id}', [UserController::class, 'update']); // Оновити користувача
//     Route::delete('/users/{id}', [AdminController::class, 'destroy']); // Видалити користувача
//     Route::patch('/users/{id}/role', [AdminController::class, 'updateRole'])->name('admin.users.role'); // Змінити роль
// });

Route::get('/s3-test-upload', function () {
    try {
        $filename = 'test/' . uniqid() . '.txt';
        $content = 'Це тестовий файл';

        $stream = fopen('php://temp', 'r+');
        fwrite($stream, $content);
        rewind($stream);

        $stored = Storage::disk('s3')->put($filename, $stream);
        fclose($stream);
        dd(config('filesystems.default')); 

        if ($stored) {
            return "✅ Файл збережено: <a href='" . Storage::disk('s3')->url($filename) . "' target='_blank'>відкрити</a>";
        }

        return '❌ Не вдалося зберегти файл';
    } catch (\Throwable $e) {
        Log::error('S3 Error: ' . $e->getMessage());
        return response()->json([
            'message' => '❌ Помилка збереження',
            'error' => $e->getMessage(),
        ], 500);
    }
});


Route::get('/debug-s3', function () {
    return [
        'disk' => config('filesystems.default'),
        'key' => config('filesystems.disks.s3.key'),
        'bucket' => config('filesystems.disks.s3.bucket'),
        'env_loaded' => env('AWS_ACCESS_KEY_ID'),
    ];
});

Route::get('/clear-config', function () {
    \Artisan::call('config:clear');
    \Artisan::call('config:cache');
    return '✅ Конфіг очищено і закешовано';
});


// Передача всіх маршрутів фронтенду React
Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '.*');
