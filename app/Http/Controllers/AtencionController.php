<?php

namespace App\Http\Controllers;

use App\Models\Carrera;
use App\Models\Paciente;
// profesionales
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AtencionController extends Controller
{
    public function create()
    {
        $jornadaId = session('jornada_id_actual');
        $jornada = null;

        if (! $jornadaId) {
            $jornada = \App\Models\Jornada::activa();
            if ($jornada) {
                $jornadaId = $jornada->id;
                session(['jornada_id_actual' => $jornadaId]);
            }
        } else {
            $jornada = \App\Models\Jornada::find($jornadaId);
        }

        $professionals = collect();
        if ($jornada) {
            // Obtener solo los usuarios que están presentes (más entradas que salidas)
            $users = $jornada->usuariosPresentes(); 
            
            $professionals = $users->map(function($u) {
                return [
                    'id' => $u->id,
                    'nombre' => $u->persona ? $u->persona->nombre . ' ' . $u->persona->apellido : '(sin nombre)',
                ];
            });
        }

        return Inertia::render('AtencionPaciente', [
            'careers'       => Carrera::select('id', 'nombre')->orderBy('nombre')->get(),
            'professionals' => $professionals->values()->all(),
            'jornadaId'     => $jornadaId,
        ]);
    }

    public function store(Request $request)
    {
        $jornadaId = session('jornada_id_actual');

        $data = $request->validate([

            'cedula' => ['required', 'string'],
            'nombres' => ['required', 'string', 'max:255'],
            'apellidos' => ['required', 'string', 'max:255'],
            'genero' => ['nullable', Rule::in(['masculino', 'femenino'])],
            'fecha_nacimiento' => ['nullable', 'date'],
            'contacto' => ['nullable', 'string'],
            'email' => ['nullable', 'email'],
            'is_student' => ['boolean'],
            'carrera_id' => ['nullable', 'exists:carreras,id'],
            'semestre' => ['nullable', 'integer'],

            'sintomas' => ['required', 'string'],
            'diagnostico' => ['nullable', 'string'],
            'tratamiento' => ['nullable', 'string'],
            'presion_arterial' => ['nullable', 'string'],
            'temperatura' => ['nullable', 'integer'],
            'frecuencia_cardiaca' => ['nullable', 'integer'],
            'frecuencia_respiratoria' => ['nullable', 'integer'],
            'peso' => ['nullable', 'integer'],
            'saturacion' => ['nullable', 'string'],
            'profesional_id' => ['required', 'exists:users,id'],
            'jornada_id' => ['required', 'exists:jornadas,id'],

        ]);

        // Limpiar y convertir campos numéricos
        $data['temperatura'] = $this->cleanNumericValue($data['temperatura']);
        $data['frecuencia_cardiaca'] = $this->cleanNumericValue($data['frecuencia_cardiaca']);
        $data['frecuencia_respiratoria'] = $this->cleanNumericValue($data['frecuencia_respiratoria']);
        $data['peso'] = $this->cleanNumericValue($data['peso']);

        $paciente = \App\Models\Paciente::where('cedula', $data['cedula'])->first();

        if ($paciente) {

            $persona = $paciente->persona;
        } else {
            // Verificar si ya existe una persona con este email
            $persona = null;
            if (! empty($data['email'])) {
                $persona = \App\Models\Persona::where('email', $data['email'])->first();
            }

            // Si no existe persona con ese email, crear una nueva
            if (! $persona) {
                $persona = \App\Models\Persona::create([
                    'nombre' => $data['nombres'],
                    'apellido' => $data['apellidos'],
                    'genero' => $data['genero'] ?? null,
                    'email' => $data['email'] ?? null,
                    'contacto' => $data['contacto'] ?? null,
                ]);
            }

            // Luego crea el paciente
            $paciente = \App\Models\Paciente::create([
                'cedula' => $data['cedula'],
                'fecha_nacimiento' => $data['fecha_nacimiento'] ?? null,
                'contacto' => $data['contacto'] ?? null,
                'carrera_id' => $data['is_student'] ? ($data['carrera_id'] ?? null) : null,
                'persona_id' => $persona->id,
            ]);
        }

        \App\Models\Atencion::create([
            'paciente_id' => $paciente->id,
            'sintomas' => $data['sintomas'],
            'diagnostico' => $data['diagnostico'] ?? null,
            'tratamiento' => $data['tratamiento'] ?? null,
            'presion_arterial' => $data['presion_arterial'] ?? null,
            'temperatura' => $data['temperatura'] ?? null,
            'frecuencia_cardiaca' => $data['frecuencia_cardiaca'] ?? null,
            'frecuencia_respiratoria' => $data['frecuencia_respiratoria'] ?? null,
            'peso' => $data['peso'] ?? null,
            'saturacion' => $data['saturacion'] ?? null,
            'profesional_id' => $data['profesional_id'],
            'jornada_id' => $data['jornada_id'],
            'fecha_atencion' => now(),
        ]);

        return redirect()->route('atencions.create')
            ->with('success', 'Atención registrada correctamente.');
    }

    /**
     * Limpia valores numéricos removiendo símbolos y caracteres no numéricos
     */
    private function cleanNumericValue($value)
    {
        if (empty($value)) {
            return null;
        }

        // Remover todos los caracteres que no sean dígitos, puntos o comas
        $cleaned = preg_replace('/[^\d.,]/', '', $value);

        // Si está vacío después de limpiar, devolver null
        if (empty($cleaned)) {
            return null;
        }

        // Convertir coma a punto para decimales
        $cleaned = str_replace(',', '.', $cleaned);

        // Si contiene punto, es decimal, sino es entero
        if (strpos($cleaned, '.') !== false) {
            return (float) $cleaned;
        } else {
            return (int) $cleaned;
        }
    }
}
