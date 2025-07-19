<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PacienteResource\Pages;
use App\Models\Paciente;
use App\Models\Persona;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PacienteResource extends Resource
{
    protected static ?string $model = Paciente::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-circle';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Datos de Persona')
                ->schema([
                    Forms\Components\TextInput::make('nombre')->disabled(),
                    Forms\Components\TextInput::make('apellido')->disabled(),
                    Forms\Components\TextInput::make('email')->email()->disabled(),
                    Forms\Components\TextInput::make('contacto')->disabled(),
                    Forms\Components\Select::make('genero')->options([
                        'masculino' => 'Masculino',
                        'femenino' => 'Femenino',
                    ])->disabled(),
                ]),
            Forms\Components\Section::make('Datos de Paciente')
                ->schema([
                    Forms\Components\TextInput::make('cedula')->disabled(),
                    Forms\Components\DatePicker::make('fecha_nacimiento')->disabled(),
                    Forms\Components\TextInput::make('contacto')->disabled(),
                    Forms\Components\TextInput::make('carrera')->disabled(),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('persona.nombre'),
            Tables\Columns\TextColumn::make('cedula'),
            Tables\Columns\TextColumn::make('carrera'),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPacientes::route('/'),
            'view' => Pages\ViewPaciente::route('/{record}'), // página de solo lectura
        ];
    }

    public static function mutateFormDataBeforeCreate(array $data): array
    {
        $personaData = $data['persona'];
        $persona = Persona::create($personaData);
        $data['persona_id'] = $persona->id;
        unset($data['persona']);

        return $data;
    }

    public static function mutateFormDataBeforeUpdate(array $data): array
    {
        if (isset($data['persona'])) {
            $paciente = auth()->user(); // Ajusta si es necesario
            $paciente->persona->update($data['persona']);
            unset($data['persona']);
        }

        return $data;
    }
}
