<?php

namespace App\Livewire\Almacen;

use Livewire\Component;

class HerramientaForm extends Component
{

    public $nombreHerramientasOptions = ['tijeras', 'pinzas', 'martillo', 'destornillador', 'alicates'];
    public function render()
    {
        return view('livewire.almacen.herramienta-form');
    }
}
