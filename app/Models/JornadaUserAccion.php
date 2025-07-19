<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JornadaUserAccion extends Model
{
    protected $table = 'jornada_user_acciones';

    protected $fillable = [
        'jornada_id',
        'user_id',
        'tipo',
        'timestamp',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jornada()
    {
        return $this->belongsTo(Jornada::class);
    }
}
