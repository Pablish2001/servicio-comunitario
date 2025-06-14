<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JornadaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'fecha' => $this->fecha->format('Y-m-d'),
            'sede_id' => $this->sede_id,
            'sede' => new SedeResource($this->whenLoaded('sede')), // Carga el recurso de la sede
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            // Si quieres mostrar las asignaciones de usuarios directamente en la jornada
            'asignaciones_usuarios' => JornadaUserResource::collection($this->whenLoaded('jornadaUsers')),
        ];
    }
}