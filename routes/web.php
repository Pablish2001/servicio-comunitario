<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\JornadaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AtencionController;
use App\Http\Controllers\PacienteLookupController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {

    // Ruta para obtener usuarios presentes en la jornada actual
    Route::get('/usuarios-presentes', [UserController::class, 'presentesEnJornadaActual']);

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

    Route::resource('atencions', AtencionController::class)->only(['create','store']);

    // Para autocompletar por cédula (paciente existente)
    Route::get('/pacientes/lookup/{cedula}', [PacienteLookupController::class, 'show'])
        ->name('pacientes.lookup');

    });

// Middleware para asegurar que la jornada le pertenece a la session
route::middleware(['auth', 'jornada.activa'])->group(function () {
    Route::get('/carreras', [\App\Http\Controllers\CarreraController::class, 'index'])->name('carreras.index');
    Route::get('/jornadas', [JornadaController::class, 'vista'])->name('jornadas');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
