<?php

namespace App\Livewire\Almacen;

use App\Models\Herramienta;
use App\Models\Item;
use Filament\Notifications\Notification;
use Livewire\Component;

class ModalHerramientas extends Component
{
    public $herramientaId = null;

    public $herramientas;

    public $nombre = '';

    public $categoria = '';

    public $estado = '';

    public $selected = null;

    public $cantidades = [];

    protected $listeners = ['abrirModalHerramienta' => 'funcionEnModal'];

    public function reload() {}

    public function funcionEnModal($itemId)
    {
        $this->herramientaId = $itemId;
        $this->loadData();
        $this->dispatch('open-modal', id: 'edit-modal');
    }

    public function loadData()
    {
        $sedeId = session('sede.id');
        $this->limpiarFiltros();
        $this->herramientas = Herramienta::with('item')
            ->where('sede_id', $sedeId)
            ->where('item_id', $this->herramientaId)
            ->get();
        $this->nombre = Item::where('id', $this->herramientaId)->value('nombre');
    }

    public function obtenerItemsFiltrados()
    {
        // Si no hay herramientas, devolver colección vacía
        if (! $this->herramientas) {
            return collect();
        }

        return $this->herramientas->filter(function ($herramienta) {
            if ($this->categoria && $herramienta->categoria !== $this->categoria) {
                return false;
            }
            if ($this->estado && $herramienta->estado !== $this->estado) {
                return false;
            }

            return true; // si pasa todos los filtros
        });
    }

    // Método para limpiar filtros
    public function limpiarFiltros()
    {
        $this->categoria = '';
        $this->estado = '';
        $this->selected = null;
    }

    public function guardar()
    {
        $this->validate([
            'cantidades.*' => 'nullable|integer|min:0',
        ]);

        if (empty($this->cantidades)) {
            Notification::make()
                ->title('No hay cantidades para actualizar')
                ->warning()
                ->send();

            return;
        }

        foreach ($this->cantidades as $herramientaId => $cantidad) {
            $herramienta = Herramienta::find($herramientaId);
            if ($herramienta) {
                $herramienta->cantidad = $cantidad;
                $herramienta->save();
            }
        }

        // Limpia solo las cantidades editadas para que input quede vacío otra vez
        $this->cantidades = [];

        $this->loadData(); // Recarga datos para actualizar la tabla si usas eso

        Notification::make()
            ->title('Herramienta actualizado correctamente')
            ->success()
            ->send();
    }

    public function eliminar()
    {
        Herramienta::where('id', $this->selected)->delete();
        $this->selected = null;
        $this->loadData();
        Notification::make()
            ->title('Herramienta eliminado correctamente')
            ->success()
            ->send();
    }

    public function render()
    {
        return view('livewire.almacen.modal-herramientas');
    }
}
