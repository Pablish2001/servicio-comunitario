<?php

namespace App\Http\Middleware;

use App\Models\Jornada;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureJornadaActiva
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $sede = session('sede');
        $user = Auth::user();
        $jornada = Jornada::whereDate('fecha_inicio', today())
            ->where('sede_id', $sede['id'])
            ->whereHas('users', function ($q) use ($user) {
                $q->where('users.id', $user->id);
            })
            ->whereNull('fecha_fin')
            ->first();

        if (! $jornada) {
            return redirect('/dashboard')->with('error', 'No tenés una jornada activa en esta sede.');
        }

        return $next($request);
    }
}
