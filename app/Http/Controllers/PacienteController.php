<?php

namespace App\Http\Controllers;

use App\Models\Atencion;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PacienteController extends Controller
{
    public function historial()
    {
        return Inertia::render('HistorialPacientes');
    }

    public function buscarHistorial(Request $request)
    {
        $cedula = $request->input('cedula');
        
        if ($cedula) {
            // Buscar por cédula específica
            $paciente = Paciente::with('persona')->where('cedula', $cedula)->first();
            
            if ($paciente) {
                $atenciones = Atencion::where('paciente_id', $paciente->id)
                    ->with(['paciente.persona', 'profesional.persona'])
                    ->orderBy('fecha_atencion', 'desc')
                    ->get()
                    ->map(function ($atencion) {
                        // Función helper para formatear fechas de manera segura
                        $formatDate = function($date) {
                            if (!$date) return null;
                            if (is_string($date)) {
                                $date = \Carbon\Carbon::parse($date);
                            }
                            return $date->format('d/m/Y');
                        };

                        $formatTime = function($date) {
                            if (!$date) return null;
                            if (is_string($date)) {
                                $date = \Carbon\Carbon::parse($date);
                            }
                            return $date->format('H:i:s');
                        };

                        return [
                            'id' => $atencion->id,
                            'paciente_nombre' => $atencion->paciente->persona->nombre . ' ' . $atencion->paciente->persona->apellido,
                            'fecha' => $formatDate($atencion->fecha_atencion) ?? $formatDate($atencion->created_at),
                            'hora' => $formatTime($atencion->fecha_atencion) ?? $formatTime($atencion->created_at),
                            'atendido_por' => $atencion->profesional ? ($atencion->profesional->persona->nombre . ' ' . $atencion->profesional->persona->apellido) : 'No especificado',
                            'diagnostico' => $atencion->diagnostico ?? 'Sin diagnóstico',
                            'sintomas' => $atencion->sintomas ?? 'Sin síntomas',
                            'tratamiento' => $atencion->tratamiento ?? 'Sin tratamiento',
                        ];
                    });
                
                // Función helper para formatear fecha de nacimiento de manera segura
                $formatBirthDate = function($date) {
                    if (!$date) return 'No especificada';
                    if (is_string($date)) {
                        $date = \Carbon\Carbon::parse($date);
                    }
                    return $date->format('d/m/Y');
                };

                $calculateAge = function($date) {
                    if (!$date) return null;
                    if (is_string($date)) {
                        $date = \Carbon\Carbon::parse($date);
                    }
                    return $date->age;
                };

                return response()->json([
                    'success' => true,
                    'atenciones' => $atenciones,
                    'paciente' => [
                        'id' => $paciente->id,
                        'nombre' => $paciente->persona->nombre . ' ' . $paciente->persona->apellido,
                        'cedula' => $paciente->cedula,
                        'fecha_nacimiento' => $formatBirthDate($paciente->fecha_nacimiento),
                        'edad' => $calculateAge($paciente->fecha_nacimiento),
                        'genero' => $paciente->persona->genero ?? 'No especificado',
                        'telefono' => $paciente->persona->telefono ?? 'No especificado',
                        'direccion' => $paciente->persona->direccion ?? 'No especificada',
                        'email' => $paciente->persona->email ?? 'No especificado'
                    ]
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Paciente no encontrado con la cédula proporcionada'
                ]);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Por favor, ingrese una cédula para buscar'
            ]);
        }
    }

    public function detalleAtencion($id)
    {
        $atencion = Atencion::with(['paciente.persona', 'paciente.carrera', 'profesional.persona'])
            ->findOrFail($id);

        // Función helper para formatear fechas de manera segura
        $formatDate = function($date) {
            if (!$date) return null;
            if (is_string($date)) {
                $date = \Carbon\Carbon::parse($date);
            }
            return $date->format('d/m/Y');
        };

        $formatTime = function($date) {
            if (!$date) return null;
            if (is_string($date)) {
                $date = \Carbon\Carbon::parse($date);
            }
            return $date->format('H:i:s');
        };

        $formatBirthDate = function($date) {
            if (!$date) return 'No especificada';
            if (is_string($date)) {
                $date = \Carbon\Carbon::parse($date);
            }
            return $date->format('Y-m-d');
        };

        $detalleAtencion = [
            'id' => $atencion->id,
            'fecha' => $formatDate($atencion->fecha_atencion) ?? $formatDate($atencion->created_at),
            'hora' => $formatTime($atencion->fecha_atencion) ?? $formatTime($atencion->created_at),
            'atendido_por' => $atencion->profesional ? ($atencion->profesional->persona->nombre . ' ' . $atencion->profesional->persona->apellido) : 'No especificado',
            'paciente' => [
                'nombre' => $atencion->paciente->persona->nombre . ' ' . $atencion->paciente->persona->apellido,
                'cedula' => $atencion->paciente->cedula,
                'genero' => $atencion->paciente->persona->genero ?? 'No especificado',
                'fecha_nacimiento' => $formatBirthDate($atencion->paciente->fecha_nacimiento),
                'facultad' => $atencion->paciente->carrera->nombre ?? 'No especificada',
            ],
            'signos_vitales' => [
                'presion_arterial' => $atencion->presion_arterial ?? 'No registrada',
                'temperatura' => $atencion->temperatura ?? 'No registrada',
                'ritmo_cardiaco' => $atencion->frecuencia_cardiaca ?? 'No registrado',
                'frecuencia_respiratoria' => $atencion->frecuencia_respiratoria ?? 'No registrada',
                'saturacion_o2' => $atencion->saturacion ?? 'No registrada',
            ],
            'consulta' => [
                'sintomas' => $atencion->sintomas ?? 'Sin síntomas',
                'diagnostico' => $atencion->diagnostico ?? 'Sin diagnóstico',
                'tratamiento' => $atencion->tratamiento ?? 'Sin tratamiento',
            ],
        ];

        return Inertia::render('DetalleAtencion', [
            'atencion' => $detalleAtencion
        ]);
    }
}
