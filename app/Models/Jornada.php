<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jornada extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'sede_id',
        'fecha_inicio',
        // agrega otros campos si los tienes
    ];

    protected $dates = [
        'fecha_inicio',
    ];

    public function sede()
    {
        return $this->belongsTo(Sede::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'jornada_users')
            ->withPivot('status', 'joined_at')
            ->withTimestamps();
    }

    public function acciones()
    {
        return $this->hasMany(JornadaUserAccion::class);
    }
}
