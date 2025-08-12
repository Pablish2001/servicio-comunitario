<?php

namespace App\Filament\Resources\AlmacenResource\Pages;

use App\Filament\Resources\AlmacenResource;
use Filament\Resources\Pages\Page;
use Livewire\WithPagination; // si aún no lo tienes
use Livewire\WithFileUploads; // si vas a subir archivos
use Illuminate\Support\Collection;


class AlmacenOverview extends Page
{

    use WithPagination;

        // Propiedad para controlar el medicamento seleccionado en el modal
    public ?int $modalMedicamentoId = null;

    // Método para abrir el modal con un medicamento específico
    public function abrirModalMedicamento(int $medicamentoId): void
    {
        $this->modalMedicamentoId = $medicamentoId;
    }

    // Método para cerrar el modal
    public function cerrarModalMedicamento(): void
    {
        $this->modalMedicamentoId = null;
    }

    protected static string $resource = AlmacenResource::class;
    protected static string $view = 'filament.resources.almacen-resource.pages.almacen-overview';
}
