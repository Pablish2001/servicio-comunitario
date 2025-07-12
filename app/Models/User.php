<?php

namespace App\Models;
use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasName;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements FilamentUser, HasName
{
    use HasFactory, Notifiable;

    /**
     * Los atributos que se pueden asignar masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'cedula',
        'password',
        'status',
        'isAdmind',
        'persona_id',
        'remember_token',
    ];

    /**
     * Los atributos que deben ocultarse para la serialización.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Los atributos que deben castearse a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'password' => 'hashed',
        'isAdmind' => 'boolean',
    ];

    /**
     * Relación con la persona.
     */
    public function persona()
    {
        return $this->belongsTo(Persona::class);
    }

    public function getAuthIdentifierName()
    {
        return 'cedula';
    }

    public function jornadas()
    {
        return $this->belongsToMany(Jornada::class, 'jornada_users')
                    ->withTimestamps()
                    ->withPivot('status');
    }
    public function acciones()
    {
        return $this->hasMany(JornadaUserAccion::class);
    }

        public function canAccessPanel(\Filament\Panel $panel): bool
    {
        return true; // o tu lógica para verificar acceso
    }

    public function getFilamentName(): string
    {
        //dd($this->persona?->nombre_completo ?? "Usuario sin nombre");
        return $this->persona?->nombre_completo ?? "Usuario sin nombre";
    }
}
