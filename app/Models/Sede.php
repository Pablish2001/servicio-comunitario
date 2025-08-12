<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sede extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'direccion', 'invocador'];

    public function jornadas()
    {
        return $this->hasMany(Jornada::class);
    }
    public function medicamentos()
    {
        return $this->hasMany(Medicamento::class);
    }
    public function items()
    {
        return $this->hasMany(Herramienta::class);
    }
}
