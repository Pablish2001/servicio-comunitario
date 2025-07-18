<?php

namespace App\Filament\Resources\SedeResource\Pages;

use App\Filament\Resources\SedeResource;
use Filament\Resources\Pages\CreateRecord;

class CreateSede extends CreateRecord
{
    protected static string $resource = SedeResource::class;

    protected function getRedirectUrl(): string
    {
        return static::getResource()::getUrl('index');
    }
}
