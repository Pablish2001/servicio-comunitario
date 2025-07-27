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

    /**
     * Devuelve los usuarios presentes en la jornada (más entradas que ausentes)
     */
    public function usuariosPresentes()
    {
        $usuarios = collect();
        foreach ($this->users()->with('persona', 'acciones')->get() as $user) {
            $acciones = $user->acciones->where('jornada_id', $this->id);
            $entradas = $acciones->where('tipo', 'entrada')->count();
            $ausentes = $acciones->where('tipo', 'ausente')->count();
            if ($entradas > $ausentes) {
                $usuarios->push($user);
            }
        }
        return $usuarios;
    }

    public static function activa()
{
    return self::whereDate('fecha_inicio', today())
        ->whereNull('fecha_fin')
        ->first();
}
}
