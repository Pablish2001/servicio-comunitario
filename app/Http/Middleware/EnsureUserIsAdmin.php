<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $user = auth()->user();

        if (! $user || ! $user->isAdmind) {
            session()->flash('not_admin', 'No tienes permisos para acceder al panel de administración.');

            return redirect('/dashboard');
        }

        return $next($request);
    }
}
