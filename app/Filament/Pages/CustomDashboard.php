<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Actions\Action;

class CustomDashboard extends BaseDashboard
{
    protected function getHeaderActions(): array
    {
        return [
            Action::make('Ir al Panel Principal')
                ->color('primary')
                ->icon('heroicon-o-home')
                ->url(url('/'))
        ];
    }
}
