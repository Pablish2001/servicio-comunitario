<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    use HasFactory;

    protected $fillable = [
        'cedula',
        'fecha_nacimiento',
        'contacto',
        'carrera_id',
        'persona_id',
    ];

    public function persona()
    {
        return $this->belongsTo(Persona::class);
    }

    public function carrera()
    {
        return $this->belongsTo(Carrera::class);
    }
}
