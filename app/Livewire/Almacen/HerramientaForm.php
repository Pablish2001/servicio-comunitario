<?php

namespace App\Livewire\Almacen;

use Livewire\Component;
use App\Models\Item;
use App\Models\Herramienta;
use Filament\Notifications\Notification;
use App\Filament\Resources\AlmacenResource;

class HerramientaForm extends Component
{

    public $nombreHerramientasOptions = [];
    public bool $descripcionHabilitada = false;
    protected $listeners = ['herramientaActualizado' => 'updateoptions'];

        public function updateoptions()
        {
            $this->nombreHerramientasOptions = Item::where('tipo', 'herramienta')
        ->pluck('nombre')
        ->toArray();
        }


        public $herramienta = [
            'nombre' => '',
            'cantidad' => '',
            'descripcion' => '',
            'categoria' => '',
            'estado' => '',
        ];

        public function mount()
        {
            // Cargar solo los items de tipo herramienta
            $this->nombreHerramientasOptions = Item::where('tipo', 'herramienta')
                ->pluck('nombre')
                ->toArray();
        }


    public function updatedHerramientaNombre($value)
    {
        $this->descripcionHabilitada = !in_array($value, $this->nombreHerramientasOptions);
    }

    public function saveHerramienta()
    {
        $this->herramienta['categoria'] = trim($this->herramienta['categoria']) === '' ? 'quirurgica' : $this->herramienta['categoria'];
        $this->herramienta['estado'] = trim($this->herramienta['estado']) === '' ? 'nueva' : $this->herramienta['estado'];

        $this->validate([
            'herramienta.nombre' => 'required|string|max:255',
            'herramienta.cantidad' => 'required|integer|min:1',
            'herramienta.descripcion' => 'nullable|string',
            'herramienta.categoria' => 'required|string',
            'herramienta.estado' => 'required|string',
        ]);
        $nombre = strtolower($this->herramienta['nombre']);
        // Buscar o crear el item
        $item = Item::where('nombre', $nombre)
            ->where('tipo', 'herramienta')
            ->first();

        if (!$item) {
            $item = Item::create([
                'nombre' => $nombre,
                'tipo' => 'herramienta',
                'descripcion' => $this->herramienta['descripcion'],
            ]);
        }

        $sedeId = session('sede.id');

        // Buscar si ya existe un herramienta con todos los atributos iguales
        $herramientaExistente = Herramienta::where('item_id', $item->id)
            ->where('sede_id', $sedeId)
            ->where('categoria', $this->herramienta['categoria'])
            ->where('estado', $this->herramienta['estado'])
            ->first();

        if ($herramientaExistente) {
            // Sumar la cantidad si existe
            $herramientaExistente->increment('cantidad', $this->herramienta['cantidad']);
        } else {
            // Si no existe, crear uno nuevo
            Herramienta::create([
                'item_id' => $item->id,
                'sede_id' => $sedeId,
                'cantidad' => $this->herramienta['cantidad'],
                'categoria' => $this->herramienta['categoria'],
                'estado' => $this->herramienta['estado'],
            ]);
        }

        Notification::make()
            ->success()
            ->title('Herramienta guardada')
            ->body('La herramienta ha sido guardada correctamente.')
            ->send();
        $this->updateoptions();
        $this->reset('herramienta');
    }










    public function render()
    {
        return view('livewire.almacen.herramienta-form');
    }
}
