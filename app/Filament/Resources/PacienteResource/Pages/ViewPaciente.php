<?php

namespace App\Filament\Resources\PacienteResource\Pages;

use App\Filament\Resources\PacienteResource;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;

class ViewPaciente extends ViewRecord
{
    protected static string $resource = PacienteResource::class;

    protected function mutateFormDataBeforeFill(array $data): array
    {
        if ($this->record->persona) {
            $data['nombre'] = $this->record->persona->nombre;
            $data['apellido'] = $this->record->persona->apellido;
            $data['email'] = $this->record->persona->email;
            $data['contacto'] = $this->record->persona->contacto;
            $data['genero'] = $this->record->persona->genero;
            $data['carrera'] = $this->record->carrera->nombre;
        }

        return $data;
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('deleteWithPersona')
                ->label('Eliminar Paciente')
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
                        ->title('Paciente eliminado')
                        ->body('El paciente y su persona asociada han sido eliminados correctamente.')
                        ->send();

                    $this->redirect(PacienteResource::getUrl('index'));
                }),
        ];
    }
}
