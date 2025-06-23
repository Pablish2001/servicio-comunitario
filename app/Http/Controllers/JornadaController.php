<?php

namespace App\Http\Controllers;

use App\Models\Jornada;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class JornadaController extends Controller
{
    // Inicia la jornada o actualiza la jornada pendiente
        public function iniciar(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $jornada = Jornada::create([
            'sede_id' => 1,
            'fecha_inicio' => now(),
        ]);

        foreach ($request->user_ids as $id) {
            $jornada->users()->attach($id, [
                'joined_at' => now(),
                'status' => 'presente',
            ]);
        }

        return redirect()->back()->with('success', 'Jornada iniciada.');
    }

    // Agrega personal a la jornada pendiente o recién creada
    public function agregarPersonal(Request $request)
    {
        $request->validate([
            'cedula' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('cedula', $request->cedula)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return back()->withErrors(['cedula' => 'Credenciales inválidas']);
        }

        // Obtener la jornada más reciente (iniciada o pendiente)
        $jornada = Jornada::latest()->first();

        if (!$jornada) {
            // Crear jornada pendiente si no existe ninguna
            $jornada = Jornada::create([
                'sede_id' => 1,
                'fecha_inicio' => null,
            ]);
        }

        // Verificar si el usuario ya está agregado
        if ($jornada->users()->where('user_id', $user->id)->exists()) {
            return back()->withErrors(['cedula' => 'Usuario ya está en la jornada.']);
        }

        // Agregar usuario con estado 'pendiente' (porque la jornada no inició)
        $jornada->users()->attach($user->id, [
            'joined_at' => now(),
            'status' => 'pendiente',
        ]);

        return redirect()->back()->with('success', 'Personal agregado a la jornada.');
    }
    

    // Quitar personal de una jornada específica
    public function quitarPersonal(Jornada $jornada, User $user)
    {
        $jornada->users()->detach($user->id);

        return redirect()->back()->with('success', 'Usuario eliminado de la jornada.');
    }

    // Validar credenciales y devolver datos reales del usuario
    public function validarCredenciales(Request $request)
    {
        $request->validate([
            'cedula' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('cedula', $request->cedula)->with('persona')->first();

        if (!$user || !\Hash::check($request->password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Credenciales inválidas'], 401);
        }

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'cedula' => $user->cedula,
                'persona' => [
                    'nombre' => $user->persona->nombre,
                    'apellido' => $user->persona->apellido,
                ]
            ]
        ]);
    }
}
