<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion',
        'tipo',
    ];

    public function medicamentos()
    {
        return $this->hasMany(Medicamento::class);
    }

    public function herramientas()
    {
        return $this->hasMany(Herramienta::class);
    }

    // Otros métodos y relaciones según sea necesario
}
