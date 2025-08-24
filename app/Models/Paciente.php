<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    protected $fillable = [
        'cedula',
        'fecha_nacimiento',
        'contacto',
        'carrera_id',
        'persona_id',
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
    ];

    public function persona()
    {
        return $this->belongsTo(Persona::class);
    }

    public function atencions()
    {
        return $this->hasMany(Atencion::class);
    }

    public function carrera()
    {
        return $this->belongsTo(Carrera::class);
    }
}
