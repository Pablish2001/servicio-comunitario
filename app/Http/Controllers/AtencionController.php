<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use App\Models\Persona;
use App\Models\Atencion;
use App\Models\Carrera;
use App\Models\User; // profesionales
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class AtencionController extends Controller
{
    public function create()
{
    $jornadaId = session('jornada_id_actual');
    $jornada = null;

    
    if (!$jornadaId) {
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
        // Debug: Vamos a ver qué está pasando
        \Log::info('Jornada ID: ' . $jornada->id);
        
        // Probar la consulta simple primero
        $usersSimple = $jornada->users()->with('persona')->get();
        \Log::info('Usuarios en jornada (simple): ' . $usersSimple->count());
        
        // Probar el método usuariosPresentes
        $users = $jornada->usuariosPresentes(); 
        \Log::info('Usuarios presentes (método): ' . $users->count());
        
        $professionals = $usersSimple->map(function($u) {
            return [
                'id' => $u->id,
                'nombre' => $u->persona ? $u->persona->nombre . ' ' . $u->persona->apellido : '(sin nombre)',
            ];
        });
        
        \Log::info('Profesionales mapeados: ' . $professionals->count());
    }

    return Inertia::render('AtencionPaciente', [
        'careers'       => Carrera::select('id', 'nombre')->orderBy('nombre')->get(),
        'professionals' => $professionals->values()->all(),
        'jornadaId'     => $jornadaId,
        'debug' => [
            'jornada_exists' => $jornada ? true : false,
            'jornada_id' => $jornada ? $jornada->id : null,
            'users_count' => $jornada ? $jornada->users()->count() : 0,
            'professionals_count' => $professionals->count()
        ]
    ]);
}

public function store(Request $request)
{
    $jornadaId = session('jornada_id_actual');

    
    $data = $request->validate([
        
        'cedula'            => ['required', 'string'],
        'nombres'           => ['required', 'string', 'max:255'],
        'apellidos'         => ['required', 'string', 'max:255'],
        'genero' => ['nullable', Rule::in(['masculino','femenino'])],
        'fecha_nacimiento' => ['nullable', 'date'],
        'contacto'          => ['nullable', 'string'],
        'email'             => ['nullable', 'email'],
        'is_student'        => ['boolean'],
        'carrera_id'        => ['nullable', 'exists:carreras,id'],
        'semestre'          => ['nullable', 'integer'], 

        
        'sintomas'                  => ['required', 'string'],
        'diagnostico'               => ['nullable', 'string'],
        'tratamiento'               => ['nullable', 'string'],
        'presion_arterial'          => ['nullable', 'string'],
        'temperatura'               => ['nullable', 'integer'],
        'frecuencia_cardiaca'       => ['nullable', 'integer'],
        'frecuencia_respiratoria'   => ['nullable', 'integer'],
        'peso'                      => ['nullable', 'integer'],
        'saturacion'                => ['nullable', 'string'],
        'profesional_id'            => ['required', 'exists:users,id'],
        'jornada_id'                => ['required', 'exists:jornadas,id'],
        
    ]);

    $paciente = \App\Models\Paciente::where('cedula', $data['cedula'])->first();

    if ($paciente) {
        
        $persona = $paciente->persona;
    } else {
        
        $persona = \App\Models\Persona::create([
            'nombre'    => $data['nombres'],
            'apellido'  => $data['apellidos'],
            'genero'    => $data['genero'] ?? null,
            'email'     => $data['email'] ?? null,
            'contacto'  => $data['contacto'] ?? null,
        ]);

        // Luego crea el paciente
        $paciente = \App\Models\Paciente::create([
            'cedula'           => $data['cedula'],
            'fecha_nacimiento' => $data['fecha_nacimiento'] ?? null,
            'contacto'         => $data['contacto'] ?? null,
            'carrera_id'       => $data['is_student'] ? ($data['carrera_id'] ?? null) : null,
            'persona_id'       => $persona->id,
        ]);
    }

    \App\Models\Atencion::create([
        'paciente_id'               => $paciente->id,
        'sintomas'                  => $data['sintomas'],
        'diagnostico'               => $data['diagnostico'] ?? null,
        'tratamiento'               => $data['tratamiento'] ?? null,
        'presion_arterial'          => $data['presion_arterial'] ?? null,
        'temperatura'               => $data['temperatura'] ?? null,
        'frecuencia_cardiaca'       => $data['frecuencia_cardiaca'] ?? null,
        'frecuencia_respiratoria'   => $data['frecuencia_respiratoria'] ?? null,
        'peso'                      => $data['peso'] ?? null,
        'saturacion'                => $data['saturacion'] ?? null,
        'profesional_id'            => $data['profesional_id'],
        'jornada_id'                => $data['jornada_id'],
        'fecha_atencion'            => now(),
    ]);

    return redirect()->route('atencions.create')
        ->with('success', 'Atención registrada correctamente.');
}
}
