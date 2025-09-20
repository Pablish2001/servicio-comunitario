<?php

use App\Http\Controllers\AtencionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DonacionController;
use App\Http\Controllers\JornadaController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\PacienteLookupController;
use App\Http\Controllers\UserController;
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

    // Ruta para crear una nueva jornada
    Route::post('/jornada/iniciar', [JornadaController::class, 'iniciar'])->name('jornada.iniciar');

    Route::get('/donaciones', [DonacionController::class, 'index'])->name('donaciones.index');
    Route::post('/donaciones', [DonacionController::class, 'store']);

    // Agregar personal a jornada
    Route::post('/jornada/agregar-personal', [JornadaController::class, 'agregarPersonal'])->name('jornada.agregar');
    Route::post('/jornada/quitar-personal', [JornadaController::class, 'quitarPersonal'])->name('jornada.quitar');
    Route::post('/jornada/agregar-personal', [JornadaController::class, 'agregarPersonal'])->name('jornada.agregar-personal');

    // Quitar personal de jornada
    Route::delete('/jornada/{jornada}/quitar-personal/{user}', [JornadaController::class, 'quitarPersonal'])->name('jornada.quitar-personal');

    Route::post('/validar-credenciales', [JornadaController::class, 'validarCredenciales'])->name('jornada.validar');

    Route::resource('atencions', AtencionController::class)->only(['create', 'store']);

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

// Middleware para asegurar que la jornada le pertenece a la session
route::middleware(['auth', 'jornada.activa'])->group(function () {
    Route::get('/carreras', [\App\Http\Controllers\CarreraController::class, 'index'])->name('carreras.index');
    Route::get('/jornadas', [JornadaController::class, 'vista'])->name('jornadas');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
