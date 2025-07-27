<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Atencion extends Model
{
    protected $fillable = [
        'sintomas',
        'diagnostico',
        'tratamiento',
        'presion_arterial',
        'temperatura',
        'frecuencia_cardiaca',
        'frecuencia_respiratoria',
        'peso',
        'saturacion',
        'paciente_id',
        'jornada_id',
        'fecha_atencion',
        'profesional_id',
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }

    public function jornada()
    {
        return $this->belongsTo(Jornada::class);
    }
}
