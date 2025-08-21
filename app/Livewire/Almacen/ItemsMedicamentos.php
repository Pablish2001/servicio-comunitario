<?php

namespace App\Livewire\Almacen;

use Livewire\Component;
use App\Models\Item;
use App\Models\Medicamento;
use Filament\Notifications\Notification;


class ItemsMedicamentos extends Component
{
    public $item=[
        'nombre' => '',
        'descripcion' => '',
    ];
    public $nombre;
    public $descripcion;
    public $medicamentoId = null;
    public bool $confirmandoEliminacion = false;

    public function reload()
    {
    }

    public function eliminar()
    {
        $medicamento = Item::find($this->medicamentoId);
        $medicamento->delete();
        Notification::make()
        ->title('se elimino correctamente')
        ->success()
        ->send();
        $this->dispatch('close-modal', id: 'edit-medicamento');
        $this->dispatch('medicamento-actualizado', items: Item::where('tipo', 'medicamento')->get());
        $this->dispatch('medicamentoActualizado');
        $this->confirmandoEliminacion = false;
    }

    public function guardar()
    {
        $this->validate([
            'nombre' => 'nullable|string',
            'descripcion' => 'nullable|string',
        ]);
        //nombre en minusculas
        $nombre = strtolower($this->nombre);
        $item = Item::where('nombre', $nombre)->first();

        if ($item) {
            Notification::make()
            ->title('Ese medicamento ya existe')
            ->danger()
            ->send();
            $this->loadData();

        } else {
            if ($nombre){
                Item::where('id', $this->medicamentoId)->update(['nombre' => $nombre]);
            }
            if ($this->descripcion) {
                Item::where('id', $this->medicamentoId)->update(['descripcion' => $this->descripcion]);
            }
                Notification::make()
                ->title('se guardo correctamente')
                ->success()
                ->send();
                $this->dispatch('close-modal', id: 'edit-medicamento');

            }
            $this->dispatch('medicamento-actualizado', items: Item::where('tipo', 'medicamento')->get());
            $this->dispatch('medicamentoActualizado');




    }


    public function abrirModal($id)
    {
        $this->dispatch('abrirModalMedicamento', itemId: $id);
    }

    public function abrirModal2($id)
    {
        $this->medicamentoId = $id;
        $this->loadData();
        $this->dispatch('open-modal', id: 'edit-medicamento');
    }


        public function loadData()
    {
        $this->item['nombre'] = Item::find($this->medicamentoId)->nombre;
        $this->item['descripcion'] = Item::find($this->medicamentoId)->descripcion;
        $this->nombre = '';
        $this->descripcion = '';
        $this->confirmandoEliminacion = false;

    }




    public function render()
    {
        return view('livewire.almacen.items-medicamentos', [
            'medicamentoItems' => Item::where('tipo', 'medicamento')->get(),
        ]);
    }
}
