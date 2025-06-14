<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    use CrudTrait;
    use HasFactory;

    protected $fillable = [
        'nombre',
        'apellido',
        'email',
        'contacto',
        'genero',
    ];

    public function user()
    {
        return $this->hasOne(User::class);
    }

    public function paciente()
    {
        return $this->hasOne(Paciente::class);
    }
}
