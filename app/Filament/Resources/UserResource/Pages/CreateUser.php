<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use App\Models\Persona;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Extraer datos de persona
        $personaData = [
            'nombre' => $data['nombre'],
            'apellido' => $data['apellido'],
            'email' => $data['email'],
            'contacto' => $data['contacto'],
            'genero' => $data['genero'],
        ];

        // Crear persona y obtener el ID
        $persona = Persona::create($personaData);

        // Asignar ID al usuario
        $data['persona_id'] = $persona->id;

        // Limpiar datos de persona para evitar conflicto
        unset($data['nombre'], $data['apellido'], $data['email'], $data['contacto'], $data['genero']);

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return static::getResource()::getUrl('index');
    }
}
