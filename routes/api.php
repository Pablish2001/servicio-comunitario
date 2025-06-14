<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SedeController;
use App\Http\Controllers\Api\JornadaController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('sedes', SedeController::class);

    // Rutas para Jornadas (CRUD completo)
Route::apiResource('jornadas', JornadaController::class);

    // Rutas para Usuarios (Básico, puedes expandir)
Route::apiResource('users', UserController::class)->only(['index', 'show']);

    // Rutas específicas para gestionar las asignaciones (JornadaUser)
    // Estas permiten añadir, actualizar o eliminar una asignación específica
// Esta línea es crucial y debe existir para que tu frontend pueda hacer POST a /api/jornadas
Route::post('jornadas', [JornadaController::class, 'store']);

// ... tus otras rutas existentes para jornadas ...
Route::post('jornadas/{jornada}/assign-user', [JornadaController::class, 'assignUser']);
Route::put('jornada-user/{jornadaUser}', [JornadaController::class, 'updateJornadaUser']);
Route::delete('jornada-user/{jornadaUser}', [JornadaController::class, 'detachUser']);

Route::post('auth/verify-jornada-user', [AuthController::class, 'verifyJornadaUser']);
