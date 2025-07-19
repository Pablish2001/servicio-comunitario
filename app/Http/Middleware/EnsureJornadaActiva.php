<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Jornada;
use Illuminate\Support\Facades\Auth;

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
