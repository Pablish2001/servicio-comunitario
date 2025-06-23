<?php

namespace App\Http\Controllers;

use App\Models\Jornada;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user()->load('persona');

        // No crear jornada pendiente automáticamente, ni agregar usuarios a ninguna jornada.
        // Solo pasar el usuario autenticado y una lista vacía de personal.
        return Inertia::render('dashboard', [
            'auth' => ['user' => $user],
            'personal' => [],
            'jornada' => null,
        ]);
    }
}
