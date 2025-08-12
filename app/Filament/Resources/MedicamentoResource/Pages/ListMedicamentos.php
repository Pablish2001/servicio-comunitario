<?php

namespace App\Filament\Resources\MedicamentoResource\Pages;

use App\Filament\Resources\MedicamentoResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMedicamentos extends ListRecords
{
    protected static string $resource = MedicamentoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
