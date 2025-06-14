<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sede extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'direccion',
    ];

    /**
     * Get the jornadas for the sede.
     */
    public function jornadas(): HasMany
    {
        return $this->hasMany(Jornada::class);
    }
}