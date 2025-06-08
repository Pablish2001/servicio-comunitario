<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Persona;

class VerifyUserController extends Controller
{
    public function verify(Request $request)
    {
        $request->validate([
            'cedula' => 'required|string',
            'password' => 'required|string',
        ]);

        // Buscar el usuario por cédula
        $user = User::where('cedula', $request->cedula)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado',
            ], 404);
        }

        // Verificar la contraseña
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Contraseña incorrecta',
            ], 401);
        }
        $user->load('persona');
    return response()->json([
            'success' => true,
            'user' => [
            'cedula' => $user->cedula,
            'nombre' => $user->persona->nombre,
            'apellido' => $user->persona->apellido,
            // otros campos
        ]
    ]);
    }
}