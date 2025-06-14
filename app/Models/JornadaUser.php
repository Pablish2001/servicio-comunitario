<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot; 
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JornadaUser extends Pivot
{
    use HasFactory;

    // Especifica explícitamente el nombre de la tabla si no sigue la convención de Laravel
    protected $table = 'jornada_user';

    protected $fillable = [
        'user_id',
        'jornada_id',
        'fecha',
        'status',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
    ];

    /**
     * Get the user that owns this specific jornada_user record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the jornada that owns this specific jornada_user record.
     */
    public function jornada(): BelongsTo
    {
        return $this->belongsTo(Jornada::class);
    }

}