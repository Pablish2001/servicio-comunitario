<?php

namespace App\Http\Middleware;

use App\Models\Sede;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class EnsureSedeExists
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::check()) {
            return $next($request);
        }
        $sede = session('sede');

        // Si no hay sede o la sede ya no existe en DB
        if (! $sede || ! Sede::where('id', $sede['id'])->exists()) {
            session()->forget('sede');
            Auth::logout();
            Session::invalidate();
            Session::regenerateToken();

            return $next($request);
        }

        return $next($request);
    }
}
