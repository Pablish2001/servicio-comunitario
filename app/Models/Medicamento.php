<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medicamento extends Model
{
    protected $fillable = [
        'presentacion',
        'tipo_unidad',
        'estado',
        'data',
        'cantidad',
        'sede_id',
        'item_id',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
