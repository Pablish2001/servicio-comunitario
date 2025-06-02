<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

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
        Inertia::share([
            'auth' => function () {
                $user = Auth::user();
                
                if (!$user) {
                    return ['user' => null];
                }

                // Carga la relación persona y añade campos computados
                $user->load('persona');
                $user->nombre_completo = $user->persona->nombre.' '.$user->persona->apellido;
                $user->email = $user->persona->email;
                $user->nombre = $user->persona->nombre; // Para compatibilidad

                return [
                    'user' => $user
                ];
            },
            // ... otros shares
        ]);
    }
}