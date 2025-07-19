<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\Persona;
use App\Models\User;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Hash;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-user';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Datos Usuario')
                    ->schema([
                        TextInput::make('cedula')->required(),
                        TextInput::make('password')
                            ->password()
                            ->dehydrateStateUsing(fn ($state) => filled($state) ? bcrypt($state) : null)
                            ->dehydrated(fn ($state) => filled($state)),
                        Select::make('status')->options([
                            'activo' => 'Activo',
                            'inactivo' => 'Inactivo',
                        ]),
                        Select::make('isAdmind')
                            ->label('Es administrador?')
                            ->options([
                                true => 'Sí',
                                false => 'No',
                            ])
                            ->default(false),
                    ]),
                Section::make('Datos Persona')
                    ->schema([
                        TextInput::make('nombre')->required(),
                        TextInput::make('apellido')->required(),
                        TextInput::make('email')->email(),
                        TextInput::make('contacto')->required(),
                        Select::make('genero')->options([
                            'masculino' => 'Masculino',
                            'femenino' => 'Femenino',
                        ])->required(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('persona.nombre'),
            Tables\Columns\TextColumn::make('cedula'),
            Tables\Columns\TextColumn::make('status'),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }

    public static function mutateFormDataBeforeCreate(array $data): array
    {
        $personaData = $data['persona'];
        $persona = Persona::create($personaData);
        $data['persona_id'] = $persona->id;
        $data['password'] = Hash::make($data['password']);
        unset($data['persona']);

        return $data;
    }

    public static function mutateFormDataBeforeUpdate(array $data): array
    {
        if (isset($data['persona'])) {
            $user = auth()->user();
            $user->persona->update($data['persona']);
            unset($data['persona']);
        }

        return $data;
    }
}
