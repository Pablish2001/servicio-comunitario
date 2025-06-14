<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'cedula' => $this->cedula,
            'status' => $this->status,
            'is_admin' => (bool) $this->isAdmind,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'persona_id' => $this->persona_id, // Si aún lo tienes en la tabla users
            
            // ¡CAMBIO CLAVE AQUÍ! Si la relación 'persona' está cargada, la incluimos
            // Ya NO concatenamos 'nombre' y 'apellido' aquí
            'persona' => $this->whenLoaded('persona', function () {
                // Aquí podrías usar otro recurso si la Persona es compleja,
                // pero por ahora la incluimos directamente
                return [
                    'id' => $this->persona->id,
                    'nombre' => $this->persona->nombre,
                    'apellido' => $this->persona->apellido,
                    'email' => $this->persona->email,
                    'contacto' => $this->persona->contacto,
                    'genero' => $this->persona->genero,
                    // Puedes añadir más campos de la persona si los necesitas en el frontend
                ];
            }),
        ];
    }
}