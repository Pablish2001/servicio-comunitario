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
        'carrera',
        'semestre',
        'persona_id',
    ];

    public function persona()
    {
        return $this->belongsTo(Persona::class);
    }
}
