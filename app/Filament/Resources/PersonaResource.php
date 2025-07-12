<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PersonaResource\Pages;
use App\Models\Persona;
use Filament\Forms;
use Filament\Tables;
use Filament\Resources\Resource;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class PersonaResource extends Resource
{
    protected static ?string $model = Persona::class;
    protected static ?string $navigationIcon = 'heroicon-o-user';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('nombre')->required(),
            Forms\Components\TextInput::make('apellido')->required(),
            Forms\Components\TextInput::make('email')->email(),
            Forms\Components\TextInput::make('contacto')->required(),
            Forms\Components\Select::make('genero')
                ->options([
                    'masculino' => 'Masculino',
                    'femenino' => 'Femenino',
                ])
                ->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nombre'),
                Tables\Columns\TextColumn::make('apellido'),
                Tables\Columns\TextColumn::make('email'),
                Tables\Columns\TextColumn::make('contacto'),
                Tables\Columns\TextColumn::make('genero'),
            ])
            ->filters([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPersonas::route('/'),
            'create' => Pages\CreatePersona::route('/create'),
            'edit' => Pages\EditPersona::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->whereDoesntHave('user')
            ->whereDoesntHave('paciente');
    }
}
