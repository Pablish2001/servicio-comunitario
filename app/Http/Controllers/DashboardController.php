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
        $sedeId = session('sede.id');

        if (! $sedeId) {
            abort(403, 'No hay sede activa en sesión.');
        }

        // Buscar si el usuario tiene una jornada activa (por ejemplo, iniciada hoy y no cerrada)
        $jornadaActiva = Jornada::whereDate('fecha_inicio', today())
            ->where('sede_id', $sedeId)
            ->whereHas('users', function ($q) use ($user) {
                $q->where('users.id', $user->id);
            })
            ->whereNull('fecha_fin')
            ->first();

        if ($jornadaActiva) {
            return redirect('/atencion-paciente');
        }

        return Inertia::render('dashboard', [
            'auth' => ['user' => $user],
            'personal' => [],
            'jornada' => null,
        ]);
    }
}
