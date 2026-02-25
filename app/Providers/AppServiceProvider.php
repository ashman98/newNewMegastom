<?php

namespace App\Providers;

use Illuminate\Routing\UrlGenerator;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

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
    public function boot(UrlGenerator $url): void
    {
        if (config('app.env') === 'production' || str_contains(request()->header('host'), 'sharedwithexpose.com')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
            request()->server->set('HTTPS', true); // Добавьте это
        }

        Vite::prefetch(concurrency: 3);

    }
}
