<?php

namespace App\Livewire\Almacen;

use App\Models\Item;
use Filament\Notifications\Notification;
use Livewire\Component;

class ItemsHerramientas extends Component
{
    public $item = [
        'nombre' => '',
        'descripcion' => '',
    ];

    public $nombre;

    public $descripcion;

    public $herramientaId = null;

    public bool $confirmandoEliminacion = false;

    public function reload() {}

    public function eliminar()
    {
        $herramienta = Item::find($this->herramientaId);
        $herramienta->delete();
        Notification::make()
            ->title('se elimino correctamente')
            ->success()
            ->send();
        $this->dispatch('close-modal', id: 'edit-herramienta');
        $this->dispatch('herramienta-actualizado', items: Item::where('tipo', 'herramienta')->get());
        $this->dispatch('herramientaActualizado');
        $this->confirmandoEliminacion = false;
    }

    public function guardar()
    {
        $this->validate([
            'nombre' => 'nullable|string',
            'descripcion' => 'nullable|string',
        ]);
        // nombre en minusculas
        $nombre = strtolower($this->nombre);
        $item = Item::where('nombre', $nombre)->first();

        if ($item) {
            Notification::make()
                ->title('Esa herramienta ya existe')
                ->danger()
                ->send();
            $this->loadData();

        } else {
            if ($nombre) {
                Item::where('id', $this->herramientaId)->update(['nombre' => $nombre]);
            }
            if ($this->descripcion) {
                Item::where('id', $this->herramientaId)->update(['descripcion' => $this->descripcion]);
            }
            Notification::make()
                ->title('se guardo correctamente')
                ->success()
                ->send();
            $this->dispatch('close-modal', id: 'edit-herramienta');

        }
        $this->dispatch('herramienta-actualizado', items: Item::where('tipo', 'herramienta')->get());
        $this->dispatch('herramientaActualizado');

    }

    public function abrirModal($id)
    {
        $this->dispatch('abrirModalHerramienta', itemId: $id);
    }

    public function abrirModal2($id)
    {
        $this->herramientaId = $id;
        $this->loadData();
        $this->dispatch('open-modal', id: 'edit-herramienta');
    }

    public function loadData()
    {
        $this->item['nombre'] = Item::find($this->herramientaId)->nombre;
        $this->item['descripcion'] = Item::find($this->herramientaId)->descripcion;
        $this->nombre = '';
        $this->descripcion = '';
        $this->confirmandoEliminacion = false;

    }

    public function render()
    {
        return view('livewire.almacen.items-herramientas', [
            'herramientaItems' => Item::where('tipo', 'herramienta')->get(),
        ]);
    }
}
