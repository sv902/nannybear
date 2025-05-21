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
use Illuminate\Support\Facades\Log;

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

Route::get('/s3-log-test', function () {
    $logData = [
        'test' => 'Це тестовий лог',
        'time' => now()->toDateTimeString(),
    ];

    $filename = 'test/video_upload_log_' . Str::random(6) . '.json';

    $stored = Storage::disk('s3')->put($filename, json_encode($logData, JSON_PRETTY_PRINT), [
        
    ]);

    return $stored
        ? ['message' => '✅ Збережено в S3', 'url' => Storage::disk('s3')->url($filename)]
        : ['error' => '❌ Не вдалося зберегти log у S3'];
});



Route::get('/clear-config', function () {
    \Artisan::call('config:clear');
    \Artisan::call('config:cache');
    return '✅ Конфіг очищено і закешовано';
});

///////////////////

Route::post('/test-video-upload', function (Request $request) {
    if (!$request->hasFile('video')) {
        return response()->json(['error' => '📭 Файл "video" не передано'], 400)
            ->withHeaders([
                'Access-Control-Allow-Origin' => 'https://nanny-bear.onrender.com',
                'Access-Control-Allow-Credentials' => 'true',
            ]);
    }

    $video = $request->file('video');

    if (!$video->isValid()) {
        return response()->json(['error' => '❌ Файл пошкоджений'], 400)
            ->withHeaders([
                'Access-Control-Allow-Origin' => 'https://nanny-bear.onrender.com',
                'Access-Control-Allow-Credentials' => 'true',
            ]);
    }

    $filename = 'test/video_direct_upload_' . Str::random(6) . '.' . $video->getClientOriginalExtension();
    $stream = fopen($video->getRealPath(), 'r');
    $stored = Storage::disk('s3')->put($filename, $stream);

    if (is_resource($stream)) {
        fclose($stream);
    }

    return $stored
        ? response()->json([
            'message' => '✅ Завантажено!',
            'url' => Storage::disk('s3')->url($filename)
        ])->withHeaders([
            'Access-Control-Allow-Origin' => 'https://nanny-bear.onrender.com',
            'Access-Control-Allow-Credentials' => 'true',
        ])
        : response()->json(['error' => '❌ Не вдалося зберегти'], 500)
        ->withHeaders([
            'Access-Control-Allow-Origin' => 'https://nanny-bear.onrender.com',
            'Access-Control-Allow-Credentials' => 'true',
        ]);
});

Route::options('/test-video-upload', function () {
    return response('', 204)->withHeaders([
        'Access-Control-Allow-Origin' => 'https://nanny-bear.onrender.com',
        'Access-Control-Allow-Methods' => 'POST, OPTIONS',
        'Access-Control-Allow-Headers' => 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials' => 'true',
    ]);
});


Route::options('/test-cors', function () {
    return response()->json(['message' => 'CORS OK'])->withHeaders([
        'Access-Control-Allow-Origin' => 'https://nanny-bear.onrender.com',
        'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers' => 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials' => 'true',
    ]);
});


// Передача всіх маршрутів фронтенду React
Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '.*');
