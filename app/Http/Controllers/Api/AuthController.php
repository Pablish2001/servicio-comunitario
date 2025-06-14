<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function verifyJornadaUser(Request $request)
    {
        try {
            $request->validate([
                'cedula' => 'required|string|exists:users,cedula',
                'password' => 'required|string',
            ]);

            // Cargar ansiosamente la relación 'persona'
            $user = User::where('cedula', $request->cedula)
                        ->with('persona') 
                        ->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'cedula' => ['Las credenciales proporcionadas son incorrectas.'],
                ]);
            }

            return new UserResource($user);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno del servidor al verificar usuario.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
