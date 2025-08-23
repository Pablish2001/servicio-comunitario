<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Herramienta extends Model
{
    protected $fillable = [
        'categoria',
        'estado',
        'cantidad',
        'sede_id',
        'item_id',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
