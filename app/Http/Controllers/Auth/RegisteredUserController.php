<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Persona;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        logger()->debug('Datos recibidos:', $request->all());
        $request->validate([
            // Datos de la persona
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:personas,email',
            'contacto' => 'required|string|max:50',
            'genero' => 'required|in:masculino,femenino',

            // Datos del usuario
            'cedula' => 'required|string|max:20|unique:users,cedula',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        DB::beginTransaction();

        try {
            $persona = Persona::create([
                'nombre' => $request->nombre,
                'apellido' => $request->apellido,
                'email' => $request->email,
                'contacto' => $request->contacto,
                'genero' => $request->genero,
            ]);

            $user = User::create([
                'cedula' => $request->cedula,
                'password' => Hash::make($request->password),
                'status' => 'activo',
                'isAdmind' => false,
                'persona_id' => $persona->id,
                'remember_token' => Str::random(60),
            ]);

            event(new Registered($user));
            Auth::login($user);
            DB::commit();

            return to_route('dashboard');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Error al registrar usuario: '.$e->getMessage()]);
        }
    }
}
