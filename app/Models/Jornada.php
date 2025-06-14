<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany; // Usaremos HasMany para el modelo pivote

class Jornada extends Model
{
    use HasFactory;

    protected $fillable = [
        'fecha',
        'sede_id',
    ];

    protected $casts = [
        'fecha' => 'date', // Laravel convertirá automáticamente a Carbon
    ];

    /**
     * Get the sede that owns the jornada.
     */
    public function sede(): BelongsTo
    {
        return $this->belongsTo(Sede::class);
    }

    /**
     * Get the specific assignments (jornada_user records) for this jornada.
     * This is the bridge to access users with pivot data.
     */
    public function jornadaUsers(): HasMany
    {
        return $this->hasMany(JornadaUser::class);
    }

    /**
     * Get the users that are assigned to this jornada through the pivot table.
     * This is the many-to-many relationship, accessing the pivot table's extra attributes.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'jornada_users')
                    ->withPivot('id', 'fecha', 'status') // Campos adicionales de la tabla pivote
                    ->using(JornadaUser::class); // Indicar que hay un modelo para la tabla pivote
    }
}