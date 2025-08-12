<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donacion extends Model
{
    protected $table = 'donaciones';

    protected $fillable = [
        'nombre',
        'data',
        'nombre_articulo',
        'descripcion',
        'tipo',
        'fue_cargado',
        'sede_id',
    ];

    public function sede()
    {
        return $this->belongsTo(Sede::class);
    }
}
