<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use CrudTrait;
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

    /**
     * Get the specific assignments (jornada_user records) for this user.
     * This is the bridge to access jornadas with pivot data.
     */
    public function jornadaUsers(): HasMany
    {
        return $this->hasMany(JornadaUser::class);
    }

    /**
     * Get the jornadas that are assigned to this user through the pivot table.
     * This is the many-to-many relationship, accessing the pivot table's extra attributes.
     */
    public function jornadas()
    {
        return $this->belongsToMany(Jornada::class, 'jornada_user')
                    ->withPivot('id', 'fecha', 'status') 
                    ->using(JornadaUser::class); 
    }

}
