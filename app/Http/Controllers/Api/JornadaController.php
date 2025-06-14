<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jornada;
use App\Models\User;
use App\Models\JornadaUser;
use App\Http\Resources\JornadaResource;
use App\Http\Resources\JornadaUserResource;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB; // ¡Asegúrate de importar DB para las transacciones!

class JornadaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jornadas = Jornada::with(['sede', 'jornadaUsers.user.persona'])->paginate(10);
        return JornadaResource::collection($jornadas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Envuelve la lógica en una transacción para asegurar la atomicidad
            return DB::transaction(function () use ($request) {
                $validatedData = $request->validate([
                    'fecha' => 'required|date_format:Y-m-d', // Fecha de la jornada principal (ej: '2025-06-13')
                    'sede_id' => 'required|exists:sedes,id',
                    'asignaciones' => 'array',
                    'asignaciones.*.user_cedula' => 'required|string|exists:users,cedula',
                    'asignaciones.*.status' => 'nullable|string|in:presente,ausente,presente,ausente',
                ]);

                // Crea la jornada principal
                $jornada = Jornada::create([
                    'fecha' => $validatedData['fecha'],
                    'sede_id' => $validatedData['sede_id'],
                ]);

                // Procesa las asignaciones si existen
                if (isset($validatedData['asignaciones'])) { 
                    $jornadaUsersToInsert = [];
                    $now = Carbon::now(); // Captura la fecha y hora exacta del servidor en este momento

                    foreach ($validatedData['asignaciones'] as $asignacion) {
                        $user = User::where('cedula', $asignacion['user_cedula'])->first();

                        if (!$user) {
                            // Esta validación ya la cubre 'exists', pero es una salvaguarda.
                            throw ValidationException::withMessages(['user_cedula' => 'La cédula ' . $asignacion['user_cedula'] . ' no existe.']);
                        }

                        $jornadaUsersToInsert[] = [
                            'user_id' => $user->id,
                            'jornada_id' => $jornada->id,
                            // **CORRECCIÓN #2:** ELIMINA esta línea. No tienes columna 'fecha' en 'jornada_user'.
                            // 'fecha' => $asignacion['fecha'],
                            'status' => $asignacion['status'] ?? 'presente',
                            'assigned_at' => $now, // Usamos la columna 'assigned_at' para la marca de tiempo de la asignación
                            'created_at' => $now, // Laravel poblará esto automáticamente con insert(), pero lo explicitamos
                            'updated_at' => $now, // Laravel poblará esto automáticamente con insert(), pero lo explicitamos
                        ];
                    }
                    JornadaUser::insert($jornadaUsersToInsert); // Inserta todas las asignaciones de una vez
                }

                // Carga las relaciones para la respuesta Resource
                $jornada->load(['sede', 'jornadaUsers.user.persona']);
                
                return new JornadaResource($jornada);

            }); // Fin de la transacción

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // En producción, considera registrar el error completo y solo mostrar un mensaje genérico al usuario.
            return response()->json([
                'message' => 'Error al crear la jornada',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Jornada $jornada)
    {
        $jornada->load(['sede', 'jornadaUsers.user.persona']);
        return new JornadaResource($jornada);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Jornada $jornada)
    {
        try {
            $validatedData = $request->validate([
                'fecha' => 'sometimes|required|date_format:Y-m-d',
                'sede_id' => 'sometimes|required|exists:sedes,id',
                'asignaciones' => 'array',
                'asignaciones.*.id' => 'nullable|exists:jornada_user,id',
                'asignaciones.*.user_cedula' => 'required|string|exists:users,cedula',
                // **CORRECCIÓN #3:** Cambia 'fecha' por 'assigned_at' en la validación si es lo que usas.
                'asignaciones.*.assigned_at' => 'required|date_format:Y-m-d H:i:s', // Asegúrate que el formato coincida con datetime
                'asignaciones.*.status' => 'nullable|string|in:presente,ausente,presente,ausente', // Asegura tus valores ENUM
            ]);

            // **Uso de transacciones aquí también es altamente recomendado para el UPDATE**
            return DB::transaction(function () use ($jornada, $validatedData) {
                $jornada->update($validatedData);

                if (isset($validatedData['asignaciones'])) {
                    $existingJornadaUserIds = $jornada->jornadaUsers()->pluck('id')->toArray();
                    $incomingJornadaUserIds = [];
                    $now = Carbon::now(); // Para nuevas asignaciones en el update

                    foreach ($validatedData['asignaciones'] as $asignacion) {
                        $user = User::where('cedula', $asignacion['user_cedula'])->first();

                        if (!$user) {
                            throw ValidationException::withMessages(['user_cedula' => 'La cédula ' . $asignacion['user_cedula'] . ' no existe.']);
                        }

                        if (isset($asignacion['id'])) {
                            // Intenta actualizar una asignación existente
                            $jornadaUser = JornadaUser::find($asignacion['id']);
                            if ($jornadaUser && $jornadaUser->jornada_id === $jornada->id) {
                                $jornadaUser->update([
                                    'user_id' => $user->id,
                                    // **CORRECCIÓN #4:** Cambia 'fecha' por 'assigned_at' si es lo que vas a actualizar.
                                    // Ten en cuenta que si assigned_at es la fecha de creación, actualizarla es raro.
                                    // Si no deberías poder cambiarla, quítala del update.
                                    'assigned_at' => $asignacion['assigned_at'], // Si el frontend envía 'assigned_at'
                                    'status' => $asignacion['status'] ?? 'presente',
                                ]);
                                $incomingJornadaUserIds[] = $jornadaUser->id;
                            }
                        } else {
                            // Antes de crear, verificar unicidad por user_id, jornada_id y assigned_at
                            // **CORRECCIÓN #5:** Cambia 'fecha' por 'assigned_at' en la comprobación de unicidad.
                            // Si 'assigned_at' captura el momento exacto, la unicidad exacta es posible.
                            // Si solo te importa la fecha (no la hora), deberías usar Carbon::parse($asignacion['assigned_at'])->toDateString()
                            // y definir assigned_at como DATE en la DB.
                            $existingAssignment = JornadaUser::where('jornada_id', $jornada->id)
                                                            ->where('user_id', $user->id)
                                                            ->where('assigned_at', $asignacion['assigned_at']) // Usar el valor que viene en la petición
                                                            ->first();
                            if ($existingAssignment) {
                                $incomingJornadaUserIds[] = $existingAssignment->id;
                                continue;
                            }

                            // Crea una nueva asignación
                            $newJornadaUser = JornadaUser::create([
                                'user_id' => $user->id,
                                'jornada_id' => $jornada->id,
                                // **CORRECCIÓN #6:** Si es una nueva asignación en el update, usa $now para 'assigned_at'
                                // a menos que el frontend deba enviar la fecha y hora de asignación para los nuevos.
                                'assigned_at' => $now, // O $asignacion['assigned_at'] si el frontend la envía para nuevos
                                'status' => $asignacion['status'] ?? 'presente',
                            ]);
                            $incomingJornadaUserIds[] = $newJornadaUser->id;
                        }
                    }

                    // Eliminar las asignaciones que ya no están en la lista
                    $jornadaUserIdsToDelete = array_diff($existingJornadaUserIds, $incomingJornadaUserIds);
                    if (!empty($jornadaUserIdsToDelete)) {
                        JornadaUser::destroy($jornadaUserIdsToDelete);
                    }
                }

                $jornada->load(['sede', 'jornadaUsers.user.persona']);
                return new JornadaResource($jornada);
            }); // Fin de la transacción

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar la jornada',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Jornada $jornada)
    {
        $jornada->delete();
        return response()->json(null, 204);
    }

    /**
     * Assign a user to a specific jornada with custom pivot data, using cedula.
     * Endpoint: POST api/jornadas/{jornada}/assign-user
     */
    public function assignUser(Request $request, Jornada $jornada)
    {
        try {
            $validatedData = $request->validate([
                'user_cedula' => 'required|string|exists:users,cedula',
                // **CORRECCIÓN #7:** Si 'assigned_at' es tu campo de fecha/hora, cambia 'fecha' por 'assigned_at'
                // y su formato. Si quieres que se capture automáticamente aquí, elimínalo de la validación.
                'assigned_at' => 'required|date_format:Y-m-d H:i:s', // Si esperas que el frontend la envíe
                'status' => 'nullable|string|in:presente,ausente,presente,ausente', // Asegura tus valores ENUM
            ]);

            $user = User::where('cedula', $validatedData['user_cedula'])->first();

            if (!$user) {
                throw ValidationException::withMessages(['user_cedula' => 'La cédula ' . $validatedData['user_cedula'] . ' no existe.']);
            }

            // Comprobar si la asignación ya existe para la unicidad (user_id, jornada_id, assigned_at)
            // **CORRECCIÓN #8:** Cambia 'fecha' por 'assigned_at' en la comprobación de unicidad.
            $existingAssignment = JornadaUser::where('jornada_id', $jornada->id)
                                            ->where('user_id', $user->id)
                                            ->where('assigned_at', $validatedData['assigned_at']) // Usa el campo correcto
                                            ->first();

            if ($existingAssignment) {
                return response()->json([
                    'message' => 'El usuario ya está asignado a esta jornada en la fecha y hora especificadas.',
                    'jornada_user' => new JornadaUserResource($existingAssignment->load('user.persona'))
                ], 409);
            }
            
            // **CORRECCIÓN #9:** Si 'assigned_at' no viene del request, usa Carbon::now().
            $assignedAt = $validatedData['assigned_at'] ?? Carbon::now();

            $jornadaUser = JornadaUser::create([
                'jornada_id' => $jornada->id,
                'user_id' => $user->id,
                // **CORRECCIÓN #10:** ELIMINA esta línea. No tienes columna 'fecha'.
                // 'fecha' => $validatedData['fecha'],
                'assigned_at' => $assignedAt, // Usa el campo y valor correctos
                'status' => $validatedData['status'] ?? 'presente',
            ]);

            return new JornadaUserResource($jornadaUser->load('user.persona'));
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al asignar usuario a jornada',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update a specific jornada_user assignment.
     * Endpoint: PUT api/jornada-user/{jornadaUser}
     */
    public function updateJornadaUser(Request $request, JornadaUser $jornadaUser)
    {
        try {
            $validatedData = $request->validate([
                // **CORRECCIÓN #11:** Cambia 'fecha' por 'assigned_at' en la validación.
                'assigned_at' => 'sometimes|required|date_format:Y-m-d H:i:s', // Asegura el formato de datetime
                'status' => 'sometimes|required|string|in:presente,ausente,presente,ausente', // Asegura tus valores ENUM
                'user_id' => 'sometimes|required|exists:users,id',
            ]);

            // Comprobación de unicidad para actualizaciones
            if (isset($validatedData['user_id']) || isset($validatedData['assigned_at'])) {
                $query = JornadaUser::where('jornada_id', $jornadaUser->jornada_id)
                                    ->where('user_id', $validatedData['user_id'] ?? $jornadaUser->user_id)
                                    // **CORRECCIÓN #12:** Cambia 'fecha' por 'assigned_at' en la unicidad.
                                    ->where('assigned_at', $validatedData['assigned_at'] ?? $jornadaUser->assigned_at)
                                    ->where('id', '!=', $jornadaUser->id);
                if ($query->exists()) {
                    return response()->json([
                        'message' => 'Ya existe una asignación con este usuario y fecha/hora para esta jornada.'
                    ], 409);
                }
            }

            $jornadaUser->update($validatedData);

            return new JornadaUserResource($jornadaUser->load('user.persona'));
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar la asignación de jornada-usuario',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Detach (delete) a specific jornada_user assignment.
     */
    public function detachUser(JornadaUser $jornadaUser)
    {
        try {
            $jornadaUser->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al desvincular el usuario de la jornada',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}