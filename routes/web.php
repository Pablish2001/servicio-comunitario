<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DonacionController;
use App\Http\Controllers\JornadaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AtencionController;
use App\Http\Controllers\PacienteLookupController;
use App\Http\Controllers\PacienteController;
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

    Route::get('/donaciones', [DonacionController::class, 'index'])->name('donaciones.index');
    Route::post('/donaciones', [DonacionController::class, 'store']);

    // --- Rutas de Jornada ---
    Route::controller(JornadaController::class)->prefix('jornada')->name('jornada.')->group(function () {
        // Rutas que NO requieren una jornada activa
        Route::post('/iniciar', 'iniciar')->name('iniciar');
        Route::post('/validar-credenciales', 'validarCredenciales')->name('validar');
    });

    Route::resource('atencions', AtencionController::class)->only(['create','store']);

    // Para autocompletar por cédula (paciente existente)
    Route::get('/pacientes/lookup/{cedula}', [PacienteLookupController::class, 'show'])
        ->name('pacientes.lookup');

    // Historial de pacientes
    Route::get('/historial-pacientes', [PacienteController::class, 'historial'])
        ->name('historial.pacientes');
    Route::post('/historial-pacientes/buscar', [PacienteController::class, 'buscarHistorial'])
        ->name('historial.pacientes.buscar');
    Route::get('/detalle-atencion/{id}', [PacienteController::class, 'detalleAtencion'])
        ->name('detalle.atencion');

});

// Rutas que requieren una jornada activa
Route::middleware(['auth', 'jornada.activa'])->group(function () {
    Route::get('/carreras', [\App\Http\Controllers\CarreraController::class, 'index'])->name('carreras.index');

    Route::controller(JornadaController::class)->prefix('jornada')->name('jornada.')->group(function () {
        Route::get('/', 'vista')->name('vista');
        Route::post('/agregar-personal', 'agregarPersonal')->name('agregar-personal');
        Route::post('/quitar-personal', 'quitarPersonal')->name('quitar-personal');
        Route::post('/finalizar', 'finalizar')->name('finalizar');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
