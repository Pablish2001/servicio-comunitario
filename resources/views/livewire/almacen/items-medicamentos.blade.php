{{-- resources/views/livewire/almacen/items-registrados.blade.php --}}

<div>
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Items Medicamentos Registrados</h2>
    </div>

    {{-- Acordeón de items --}}
    <div class="space-y-4">
        @foreach($medicamentoItems as $medicamento)
            <div class="border rounded-xl bg-white dark:bg-gray-800">

                {{-- Botón para expandir/cerrar --}}
                    
                <div
                    class="w-full px-4 py-3 font-semibold flex justify-between items-center bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                    wire:click="abrirModal({{ $medicamento->id }})"
                >
                    <div class="text-left">
                        {{ $medicamento->nombre }}
                        <span class="text-gray-500 truncate max-w-xs">: {{ $medicamento->descripcion }}</span>
                    </div>
                </div>
            </div>
            
        @endforeach
        @livewire('almacen.modal-medicamentos') 
    </div>
</div>
