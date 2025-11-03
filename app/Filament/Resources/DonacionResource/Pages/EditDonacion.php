<?php

namespace App\Filament\Resources\DonacionResource\Pages;

use App\Filament\Resources\DonacionResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDonacion extends EditRecord
{
    protected static string $resource = DonacionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
