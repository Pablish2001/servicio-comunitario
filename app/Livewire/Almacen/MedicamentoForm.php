<?php

namespace App\Livewire\Almacen;

use Livewire\Component;
use App\Models\Item;
use App\Models\Medicamento;
use Filament\Notifications\Notification;
use App\Filament\Resources\AlmacenResource;


class MedicamentoForm extends Component
{
    public bool $descripcionHabilitada = false;
    public $nombreMedicamentosOptions = [];
    protected $listeners = ['medicamentoActualizado' => 'updateoptions'];

    public function updateoptions()
    {
        $this->nombreMedicamentosOptions = Item::where('tipo', 'medicamento')
    ->pluck('nombre')
    ->toArray();
    }


    public $medicamento = [
        'nombre' => '',
        'cantidad' => '',
        'descripcion' => '',
        'tipo_unidad' => '',
        'presentacion' => '',
        'estado' => '',
    ];

    public function mount()
    {
        // Cargar solo los items de tipo medicamento
        $this->nombreMedicamentosOptions = Item::where('tipo', 'medicamento')
            ->pluck('nombre')
            ->toArray();
    }

    public function updatedMedicamentoNombre($value)
    {
        $this->descripcionHabilitada = !in_array($value, $this->nombreMedicamentosOptions);
    }

    public function saveMedicamento()
    {
        $this->medicamento['tipo_unidad'] = trim($this->medicamento['tipo_unidad']) === '' ? 'Unidades' : $this->medicamento['tipo_unidad'];
        $this->medicamento['presentacion'] = trim($this->medicamento['presentacion']) === '' ? 'Suspensión' : $this->medicamento['presentacion'];
        $this->medicamento['estado'] = trim($this->medicamento['estado']) === '' ? 'Nuevo' : $this->medicamento['estado'];

        $this->validate([
            'medicamento.nombre' => 'required|string|max:255',
            'medicamento.cantidad' => 'required|integer|min:1',
            'medicamento.descripcion' => 'nullable|string',
            'medicamento.tipo_unidad' => 'required|string',
            'medicamento.presentacion' => 'required|string',
            'medicamento.estado' => 'required|string',
        ]);
        $nombre = strtolower($this->medicamento['nombre']);
        // Buscar o crear el item
        $item = Item::where('nombre', $nombre)
            ->where('tipo', 'medicamento')
            ->first();

        if (!$item) {
            $item = Item::create([
                'nombre' => $nombre,
                'tipo' => 'medicamento',
                'descripcion' => $this->medicamento['descripcion'],
            ]);
        }

        $sedeId = session('sede.id');

        // Buscar si ya existe un medicamento con todos los atributos iguales
        $medicamentoExistente = Medicamento::where('item_id', $item->id)
            ->where('sede_id', $sedeId)
            ->where('tipo_unidad', $this->medicamento['tipo_unidad'])
            ->where('presentacion', $this->medicamento['presentacion'])
            ->where('estado', $this->medicamento['estado'])
            ->first();

        if ($medicamentoExistente) {
            // Sumar la cantidad si existe
            $medicamentoExistente->increment('cantidad', $this->medicamento['cantidad']);
        } else {
            // Si no existe, crear uno nuevo
            Medicamento::create([
                'item_id' => $item->id,
                'sede_id' => $sedeId,
                'cantidad' => $this->medicamento['cantidad'],
                'tipo_unidad' => $this->medicamento['tipo_unidad'],
                'presentacion' => $this->medicamento['presentacion'],
                'estado' => $this->medicamento['estado'],
            ]);
        }

        Notification::make()
            ->success()
            ->title('Medicamento guardado')
            ->body('El medicamento ha sido guardado correctamente.')
            ->send();

        $this->updateoptions();
        $this->reset('medicamento');
    }


    public function render()
    {
        return view('livewire.almacen.medicamento-form');
    }

}
