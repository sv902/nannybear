<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use App\Events\UserRegistered;
use App\Listeners\SendWelcomeEmail;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Автоматичне створення символічного лінку storage -> public/storage
        if (app()->environment('production') && !file_exists(public_path('storage'))) {
            \Artisan::call('storage:link');
        }
        
        Event::listen(
            UserRegistered::class,
            SendWelcomeEmail::class
        );
        $this->app['router']->aliasMiddleware('role', \App\Http\Middleware\RoleMiddleware::class);
    }
}
