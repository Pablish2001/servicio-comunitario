<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\JornadaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {

    // Ruta al dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Iniciar jornada
    Route::post('/jornada/iniciar', [JornadaController::class, 'iniciar'])->name('jornada.iniciar');

    // Agregar personal a jornada
    Route::post('/jornada/agregar-personal', [JornadaController::class, 'agregarPersonal'])->name('jornada.agregar');
    Route::post('/jornada/quitar-personal', [JornadaController::class, 'quitarPersonal'])->name('jornada.quitar');
    Route::post('/jornada/agregar-personal', [JornadaController::class, 'agregarPersonal'])->name('jornada.agregar-personal');

    // Quitar personal de jornada
    Route::delete('/jornada/{jornada}/quitar-personal/{user}', [JornadaController::class, 'quitarPersonal'])->name('jornada.quitar-personal');

    Route::post('/validar-credenciales', [JornadaController::class, 'validarCredenciales'])->name('jornada.validar');

    // Vista de atención de pacientes
    Route::get('/atencion-paciente', function () {
        return Inertia::render('AtencionPaciente');
    })->name('atencion.paciente');

    // Vista de gestión de jornada (Jornadas)
    Route::get('/jornadas', [JornadaController::class, 'vista'])->name('jornadas');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
