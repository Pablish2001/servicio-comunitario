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

        // Buscar jornada activa (de hoy, sin cerrar, en esta sede)
        $jornadaActiva = Jornada::whereDate('fecha_inicio', today())
            ->where('sede_id', $sedeId)
            ->whereNull('fecha_fin')
            ->first();

        if ($jornadaActiva) {
            // Verificar si el usuario ya está relacionado a la jornada
            $yaRelacionado = $jornadaActiva->users()->where('users.id', $user->id)->exists();

            // Si no está, lo agregamos a la jornada
            if (! $yaRelacionado) {
                $jornadaActiva->users()->attach($user->id, [
                    'joined_at' => now(),
                    'status' => 'presente',
                ]);
            }

            return redirect('/atencion-paciente');
        }

        // Si no hay jornada activa, renderiza el dashboard
        return Inertia::render('dashboard', [
            'auth' => ['user' => $user],
            'personal' => [],
            'jornada' => null,
        ]);
    }
}
