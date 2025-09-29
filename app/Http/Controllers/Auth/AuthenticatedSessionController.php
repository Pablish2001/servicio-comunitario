<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Sede;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $sedeCodigo = $request->input('sede');

        if (! $sedeCodigo) {
            throw ValidationException::withMessages([
                'cedula' => 'ingrese la sede en la URL "login?sede=VAsede"',
            ]);
        }

        $sede = Sede::where('invocador', $sedeCodigo)->first();

        if (! $sede) {
            throw ValidationException::withMessages([
                'cedula' => 'Sede incorrecta.',
            ]);
        }

        // ✅ Autenticar (cedula + password)
        $request->authenticate();

        $request->session()->regenerate();

        // ✅ Guardar usuario + sede
        $user = User::with('persona')->where('cedula', $request->cedula)->first();
        $request->session()->put('user_data', $user->toArray());
        $request->session()->put('sede', $sede->toArray());

        // ✅ Agregar automáticamente a jornada activa si existe
        $jornadaActiva = \App\Models\Jornada::whereDate('fecha_inicio', today())
            ->whereNull('fecha_fin')
            ->first();

        if ($jornadaActiva) {
            // Verificar si el usuario ya está en la jornada
            $yaEnJornada = $jornadaActiva->users()->where('user_id', $user->id)->exists();
            
            if (!$yaEnJornada) {
                // Agregar usuario a la jornada
                $jornadaActiva->users()->attach($user->id, [
                    'joined_at' => now(),
                    'status' => 'presente',
                ]);

                // Registrar acción de entrada
                \App\Models\JornadaUserAccion::create([
                    'jornada_id' => $jornadaActiva->id,
                    'user_id' => $user->id,
                    'tipo' => 'entrada',
                    'timestamp' => now(),
                ]);
            }
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // Eliminar jornada pendiente de la sede 1 antes de cerrar sesión
        $jornadaPendiente = \App\Models\Jornada::where('sede_id', 1)->whereNull('fecha_inicio')->first();
        if ($jornadaPendiente) {
            // Eliminar relaciones en tabla pivote primero
            $jornadaPendiente->users()->detach();
            $jornadaPendiente->delete();
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
