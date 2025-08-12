<?php

namespace App\Livewire\Almacen;

use Livewire\Component;
use App\Models\Item;
use App\Models\Medicamento;

class ItemsMedicamentos extends Component
{

    public $unidad = '';
    public $presentacion = '';
    public $estado = '';
    public $itemSeleccionado = null;
    public $medicamentoId = null;
    public $cerrandoItem = false;


    public function abrirModal($id)
    {
        $this->dispatch('abrirModalMedicamento', itemId: $id);
        //$this->dispatch('open-modal', id: 'edit-modal');
    }

    public function limpiarFiltros()
    {
        $this->unidad = '';
        $this->presentacion = '';
        $this->estado = '';
    }

    public function seleccionarItem($itemId)
    {
        if ($this->itemSeleccionado === $itemId) {
            // Si ya está abierto, lo cerramos y activamos la bandera
            $this->cerrandoItem = true;
            $this->itemSeleccionado = null;
        } else {
            $this->cerrandoItem = false;
            $this->itemSeleccionado = $itemId;
        }
    }

    public function obtenerItemsFiltrados($itemId)
    {
        return Medicamento::where('item_id', $itemId)
            ->where('sede_id', session('sede.id'))
            ->when($this->unidad, fn($q) => $q->where('tipo_unidad', $this->unidad))
            ->when($this->presentacion, fn($q) => $q->where('presentacion', $this->presentacion))
            ->when($this->estado, fn($q) => $q->where('estado', $this->estado))
            ->get();
    }

    public function render()
    {
        return view('livewire.almacen.items-medicamentos', [
            'medicamentoItems' => Item::where('tipo', 'medicamento')->get(),
        ]);
    }
}
