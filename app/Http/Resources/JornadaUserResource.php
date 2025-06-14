<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JornadaUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user' => new UserResource($this->whenLoaded('user')), // Carga el recurso del usuario
            'jornada_id' => $this->jornada_id,
            'assigned_at' => $this->assigned_at ? $this->assigned_at->format('Y-m-d H:i:s') : null, // La fecha de la asignación
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}