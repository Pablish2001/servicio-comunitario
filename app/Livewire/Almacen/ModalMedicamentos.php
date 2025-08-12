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

    protected $listeners = ['abrirModalMedicamento' => 'funcionEnModal'];

        public function buscar()
    {
        // No necesitas lógica, solo fuerza el render y activa wire:loading
    }

    public function funcionEnModal($itemId)
    {
        $this->medicamentoId = $itemId; 
        $this->limpiarFiltros();
        $this->loadData();
        $this->dispatch('open-modal', id: 'edit-modal');
    }


        public function loadData()
    {
        // Ejemplo: cargar el medicamento por ID
        $this->medicamentos = Medicamento::with('item')
        ->where('item_id', $this->medicamentoId)
        ->get();
    }

        public function obtenerItemsFiltrados()
        {
            // Si no hay medicamentos, devolver colección vacía
            if (!$this->medicamentos) {
                return collect();
            }

            return $this->medicamentos->filter(function($medicamento) {
                // Filtrar unidad solo si hay filtro
                if ($this->unidad && $medicamento->tipo_unidad !== $this->unidad) {
                    return false;
                }
                // Filtrar presentación solo si hay filtro
                if ($this->presentacion && $medicamento->presentacion !== $this->presentacion) {
                    return false;
                }
                // Filtrar estado solo si hay filtro
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
        }
    
    public function guardar()
    {
/*         $this->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'cantidad' => 'required|integer|min:0',
        ]);

        $medicamento = Medicamento::find($this->medicamentoId);

        if ($medicamento) {
            $medicamento->update([
                'nombre' => $this->nombre,
                'descripcion' => $this->descripcion,
                'cantidad' => $this->cantidad,
            ]); */

            Notification::make()
                ->title('Medicamento actualizado correctamente')
                ->success()
                ->send();

            $this->dispatch('close-modal', id: 'edit-modal');
            $this->dispatch('recargarTablaMedicamentos');
        /* } */
    }

    public function render()
    {
        return view('livewire.almacen.modal-medicamentos');
    }
}
