<?php

namespace App\Http\Controllers;

use App\Models\Jornada;
use App\Models\JornadaUserAccion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class JornadaController extends Controller
{
    // Muestra la vista de gestión de jornada
    public function vista(Request $request)
    {
        $user = Auth::user()->load('persona');
        $jornadaActiva = Jornada::whereDate('fecha_inicio', today())
            ->whereNull('fecha_fin')
            ->with(['users.persona'])
            ->first();

        // Traer todos los usuarios del sistema con su persona
        $todosUsuarios = \App\Models\User::with('persona')->get();

        // Si hay jornada activa, cargar acciones y agruparlas por usuario
        $accionesPorUsuario = [];
        if ($jornadaActiva) {
            $acciones = $jornadaActiva->acciones()->orderBy('timestamp')->get();
            foreach ($acciones as $accion) {
                $accionesPorUsuario[$accion->user_id][] = [
                    'tipo' => $accion->tipo,
                    'timestamp' => $accion->timestamp,
                ];
            }
            // Adjuntar historial a cada usuario
            $jornadaActiva->users->map(function ($u) use ($accionesPorUsuario) {
                $u->acciones = $accionesPorUsuario[$u->id] ?? [];

                return $u;
            });
        }

        return \Inertia\Inertia::render('Jornadas', [
            'auth' => ['user' => $user],
            'jornada' => $jornadaActiva,
            'todosUsuarios' => $todosUsuarios,
        ]);
    }

    // Inicia la jornada o actualiza la jornada pendiente
    public function iniciar(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        // Verifica si ya existe una jornada para hoy
        $jornada = Jornada::whereDate('fecha_inicio', today())->first();
        $sede = session('sede.id');

        if ($jornada) {
            // Si existe, actualiza la jornada pendiente
            return redirect()->back()->withErrors(['jornada' => 'Ya existe una jornada para hoy.']);
        } elseif ($sede) {
            $jornada = Jornada::create([
                'sede_id' => $sede,
                'fecha_inicio' => today(),
            ]);
        } else {
            // Si no hay sede, redirige con error
            return redirect()->back()->withErrors(['sede' => 'No hay sede seleccionada.']);
        }
        foreach ($request->user_ids as $id) {
            $jornada->users()->attach($id, [
                'joined_at' => now(),
                'status' => 'presente',
            ]);
            // Registrar acción de entrada para historial
            JornadaUserAccion::create([
                'jornada_id' => $jornada->id,
                'user_id' => $id,
                'tipo' => 'entrada',
                'timestamp' => now(),
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

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return back()->withErrors(['cedula' => 'Credenciales inválidas']);
        }

        // Obtener la jornada más reciente (iniciada o pendiente)
        $jornada = Jornada::latest()->first();

        if (! $jornada) {
            // Crear jornada pendiente si no existe ninguna
            $jornada = Jornada::create([
                'sede_id' => 1,
                'fecha_inicio' => null,
            ]);
        }

        // Verificar si el usuario ya está agregado
        $pivot = $jornada->users()->where('user_id', $user->id)->first();
        if ($pivot) {
            // Si está como ausente, reactívalo
            if ($pivot->pivot->status === 'ausente') {
                $jornada->users()->updateExistingPivot($user->id, [
                    'status' => 'presente',
                    'joined_at' => now(),
                ]);
                JornadaUserAccion::create([
                    'jornada_id' => $jornada->id,
                    'user_id' => $user->id,
                    'tipo' => 'entrada',
                    'timestamp' => now(),
                ]);

                return redirect()->back()->with('success', 'Personal reingresado a la jornada.');
            }

            return back()->withErrors(['cedula' => 'Usuario ya está en la jornada.']);
        }
        // Agregar usuario con estado 'pendiente' (porque la jornada no inició)
        $jornada->users()->attach($user->id, [
            'joined_at' => now(),
            'status' => 'pendiente',
        ]);
        // Registrar acción de entrada
        JornadaUserAccion::create([
            'jornada_id' => $jornada->id,
            'user_id' => $user->id,
            'tipo' => 'entrada',
            'timestamp' => now(),
        ]);

        return redirect()->back()->with('success', 'Personal agregado a la jornada.');
    }

    // Quitar personal de la jornada activa (marca salida, no elimina)
    public function quitarPersonal(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $jornada = Jornada::whereDate('fecha_inicio', today())
            ->whereNull('fecha_fin')
            ->first();

        if (! $jornada) {
            return response()->json(['success' => false, 'message' => 'No hay jornada activa.'], 404);
        }

        $userId = $request->user_id;
        $pivot = $jornada->users()->where('user_id', $userId)->first();
        if (! $pivot) {
            return response()->json(['success' => false, 'message' => 'Usuario no está en la jornada.'], 404);
        }

        // Actualiza solo el status en el pivot (no hay columna left_at)
        $jornada->users()->updateExistingPivot($userId, [
            'status' => 'ausente',
        ]);
        // Registrar acción de salida para historial
        JornadaUserAccion::create([
            'jornada_id' => $jornada->id,
            'user_id' => $userId,
            'tipo' => 'ausente',
            'timestamp' => now(),
        ]);

        return redirect()->back()->with('success', 'Usuario marcado como ausente.');
    }

    // Validar credenciales y devolver datos reales del usuario
    public function validarCredenciales(Request $request)
    {
        $request->validate([
            'cedula' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('cedula', $request->cedula)->with('persona')->first();

        if (! $user || ! \Hash::check($request->password, $user->password)) {
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
                ],
            ],
        ]);
    }
}
