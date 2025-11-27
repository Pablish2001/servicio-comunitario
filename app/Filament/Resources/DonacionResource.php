<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DonacionResource\Pages;
use App\Filament\Resources\DonacionResource\RelationManagers;
use App\Models\Donacion;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class DonacionResource extends Resource
{
    protected static ?string $model = Donacion::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nombre')->label('Donante')->searchable(),
                Tables\Columns\TextColumn::make('data')->label('Fecha')->date(),
                Tables\Columns\TextColumn::make('nombre_articulo')->label('Artículo')->searchable(),
                Tables\Columns\TextColumn::make('tipo')->label('Tipo')->badge(),
                Tables\Columns\TextColumn::make('sede.nombre')->label('Sede')
            ])

            ->filters([
                //
            ])
            ->actions([
                //
            ])
            ->bulkActions([
                //
            ]);
    }
    
        public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->with('sede');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDonacions::route('/'),
        ];
    }
}
