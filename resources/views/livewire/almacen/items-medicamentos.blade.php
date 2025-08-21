{{-- resources/views/livewire/almacen/items-registrados.blade.php --}}

<div x-data="{ selected: @entangle('selected') }">
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Items Medicamentos Registrados</h2>
        <div>
            <template x-if="selected">
                <x-filament::button
                    wire:click="eliminar"
                    color="danger">
                    Eliminar
                </x-filament::button>
            </template>
            <template x-if="selected">
                <x-filament::button>
                    Editar
                </x-filament::button>
            </template>
        </div>
    </div>

    {{-- Acordeón de items --}}
    <div 
        x-data="{
            search: '',
            items: @js($medicamentoItems),
            get filtered() {
                if (!this.search) return this.items   // <--- aquí devuelve todos si search está vacío
                return this.items.filter(i => 
                    i.nombre.toLowerCase().includes(this.search.toLowerCase())
                )
            }
        }"
        x-on:medicamento-actualizado.window="items = $event.detail.items"
        class="space-y-2"
    >

        {{-- Input con datalist --}}
        <div class="border-b bg-white dark:bg-gray-800 flex justify-between items-center mb-4">
            <!-- Spinner solo mientras se carga -->
            <div>
                <svg wire:loading wire:target="abrirModal" class="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
            </div>
            <div>
                <span>Buscar:</span>
            </div>
            <x-filament::input
                label="Nombre del Medicamento"
                placeholder="Ej: Paracetamol"
                x-model="search"
                class="placeholder-gray-400 dark:placeholder-gray-500"
            />
        </div>

            <template x-for="medicamento in filtered" :key="medicamento.id">
                <div class="border-b bg-white dark:bg-gray-800">

                    {{-- Botón para expandir/cerrar --}}
                        
                    <div
                        class="w-full px-4 py-3 font-semibold flex justify-between items-center"
                    >
                        <div>
                            <button 
                                style="color:#2563eb; text-decoration:none;"
                                @click="$wire.abrirModal(medicamento.id)"
                            >
                                <span x-text="medicamento.nombre"></span>
                            </button>
                            <span class="text-gray-500 max-w-xs truncate inline-block align-middle">
                                : <span x-text="medicamento.descripcion"></span>
                            </span>
                        </div>
                        <div class="px-4 py-2 text-center">
                        <x-filament::button 
                            color="primary" 
                            @click="$wire.abrirModal2(medicamento.id)"
                            size="sm">
                            Editar
                        </x-filament::button>
                        </div>
                    </div>

                </div>
            </template>

        @livewire('almacen.modal-medicamentos') 
    </div>






        <x-filament::modal 
        id="edit-medicamento" 
        >
        <x-slot name="heading">
            <h3 class="text-lg font-semibold mb-4">Editar Medicamento</h3>
            {{ $this->item['nombre'] }}
        </x-slot>
            {{-- Contenido --}}
            <div class="p-4 border-t">
                <div class="mt-6">
                    <x-filament::input
                        label="Nombre"
                        required
                        placeholder="{{ $this->item['nombre'] }}"
                        wire:model="nombre"
                        color="gray"
                    />
                </div>

                        {{-- Descripción --}}
                        <div class="mt-6">
                            <textarea
                                label="Descripción"
                                wire:model="descripcion"
                                rows="2"
                                placeholder="{{ $this->item['descripcion'] }}"
                                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-0 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 resize-none"
                            ></textarea>
                        </div>
            </div>


            <x-slot name="footer">
                    <x-filament::button wire:click="guardar">Guardar Cambios</x-filament::button>
                    @if(!$confirmandoEliminacion)
                        <x-filament::button color="danger" wire:click="$set('confirmandoEliminacion', true)">
                            Eliminar
                        </x-filament::button>
                    @else
                        <x-filament::button color="danger" wire:click="eliminar">
                            Confirmar eliminación
                        </x-filament::button>
                        <div class="mb-2 text-red-700 dark:text-red-400 font-semibold">
                            Si borras perderás todos los registros asociados a este medicamento y no podrás recuperarlos.
                        </div>
                        <x-filament::button color="gray" wire:click="$set('confirmandoEliminacion', false)">
                            Cancelar
                        </x-filament::button>
                    @endif
            </x-slot>
    </x-filament::modal>
</div>


