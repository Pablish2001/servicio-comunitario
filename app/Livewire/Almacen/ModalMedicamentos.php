<?php

namespace App\Livewire\Almacen;

use Livewire\Component;
use App\Models\Medicamento;
use App\Models\Item;
use Filament\Notifications\Notification;

class ModalMedicamentos extends Component
{
    public $medicamentoId = null;
    public $medicamentos;
    public $nombre = '';
    public $unidad = '';
    public $presentacion = '';
    public $estado = '';
    public $selected = [];
    public $cantidades = [];

    protected $listeners = ['abrirModalMedicamento' => 'funcionEnModal'];

    public function reload()
    {
    }

    public function funcionEnModal($itemId)
    {
        $this->medicamentoId = $itemId; 
        $this->loadData();
        $this->dispatch('open-modal', id: 'edit-modal');
    }

        public function loadData()
    {
        $this->limpiarFiltros();
        $this->medicamentos = Medicamento::with('item')
        ->where('item_id', $this->medicamentoId)
        ->get();
        $this->nombre = Item::where('id', $this->medicamentoId)->value('nombre');
    }

    public function obtenerItemsFiltrados()
    {
        // Si no hay medicamentos, devolver colección vacía
        if (!$this->medicamentos) {
            return collect();
        }

        return $this->medicamentos->filter(function($medicamento) {
            if ($this->unidad && $medicamento->tipo_unidad !== $this->unidad) {
                return false;
            }
            if ($this->presentacion && $medicamento->presentacion !== $this->presentacion) {
                return false;
            }
            if ($this->estado && $medicamento->estado !== $this->estado) {
                return false;
            }
            return true; // si pasa todos los filtros
        });
    }

        // Método para limpiar filtros
    public function limpiarFiltros()
    {
        $this->unidad = '';
        $this->presentacion = '';
        $this->estado = '';
        $this->selected = [];
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

        foreach ($this->cantidades as $medicamentoId => $cantidad) {
            $medicamento = Medicamento::find($medicamentoId);
            if ($medicamento) {
                $medicamento->cantidad = $cantidad;
                $medicamento->save();
            }
        }

        // Limpia solo las cantidades editadas para que input quede vacío otra vez
        $this->cantidades = [];

        $this->loadData(); // Recarga datos para actualizar la tabla si usas eso

        Notification::make()
            ->title('Medicamento actualizado correctamente')
            ->success()
            ->send();
    }

    public function eliminar()
    {
        Medicamento::whereIn('id', $this->selected)->delete();
        $this->selected = [];
        $this->loadData();
        Notification::make()
        ->title('Medicamento eliminado correctamente')
        ->success()
        ->send();
    }

    public function render()
    {
        return view('livewire.almacen.modal-medicamentos');
    }
}
