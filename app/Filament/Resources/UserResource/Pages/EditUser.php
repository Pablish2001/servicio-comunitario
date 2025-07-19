<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    protected function mutateFormDataBeforeFill(array $data): array
    {
        if ($this->record->persona) {
            $data['nombre'] = $this->record->persona->nombre;
            $data['apellido'] = $this->record->persona->apellido;
            $data['email'] = $this->record->persona->email;
            $data['contacto'] = $this->record->persona->contacto;
            $data['genero'] = $this->record->persona->genero;
        }

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $personaData = [
            'nombre' => $data['nombre'],
            'apellido' => $data['apellido'],
            'email' => $data['email'],
            'contacto' => $data['contacto'],
            'genero' => $data['genero'],
        ];

        if ($this->record->persona) {
            $this->record->persona->update($personaData);
        } else {
            $persona = $this->record->persona()->create($personaData);
            $data['persona_id'] = $persona->id;
        }

        unset($data['nombre'], $data['apellido'], $data['email'], $data['contacto'], $data['genero']);

        return $data;
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('deleteWithPersona')
                ->label('Eliminar Usuario')
                ->color('danger')
                ->requiresConfirmation()
                ->authorize(fn () => true)
                ->action(function () {
                    if ($this->record->persona) {
                        $this->record->persona->delete();
                    }

                    $this->record->delete();

                    Notification::make()
                        ->success()
                        ->title('Usuario eliminado')
                        ->body('El usuario y su persona asociada han sido eliminados correctamente.')
                        ->send();

                    $this->redirect(UserResource::getUrl('index'));
                }),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return static::getResource()::getUrl('index');
    }
}
