<x-filament::modal 
    id="edit-modal" 
    width="5xl"
    >
    <div x-ref="modalContainer">

        <x-slot name="heading">
            {{ $this->nombre }}
        </x-slot>



        {{-- Contenido --}}
            <div class="p-4 border-t">
                {{-- Mensaje de filtros --}}
                <div class="mb-2 flex items-center gap-2">
                    <x-filament::icon name="heroicon-o-adjustments-horizontal" class="w-5 h-5 text-blue-600" />
                    <span class="text-sm text-blue-700 font-semibold">Configure los filtros para una búsqueda más rápida</span>
                </div>
                {{-- Filtros compactos --}}
                <div class="flex flex-wrap items-end gap-2 mb-4">
                    <div class="w-32">
                        <p>Tipo de unidad</p>
                        <x-filament::input.select 
                            wire:model="unidad" 
                            wire:change="obtenerItemsFiltrados" 
                            label="Unidad"
                            class="!w-32 py-1 px-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600"
                        >
                            <option value="">Todas</option>
                            <option value="Unidades">Unidades</option>
                            <option value="Cajas">Cajas</option>
                            <option value="Tabletas">Tabletas</option>
                            <option value="Frascos">Frascos</option>
                            <option value="Mililitros">Mililitros</option>
                            <option value="Miligramos">Miligramos</option>
                            <option value="Gramos">Gramos</option>
                            <option value="Otro">Otro</option>
                        </x-filament::input.select>
                    </div>
                    <div class="w-32">
                        <p>Presentación</p>
                        <x-filament::input.select 
                            wire:model="presentacion" 
                            wire:change="obtenerItemsFiltrados" 
                            label="Presentación"
                            class="!w-36 py-1 px-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600"
                        >
                            <option value="">Todas</option>
                            <option value="Suspension">Suspensión</option>
                            <option value="Tabletas">Tabletas</option>
                            <option value="Solucion">Solución</option>
                            <option value="Jarabe">Jarabe</option>
                            <option value="Crema">Crema</option>
                            <option value="Gotas">Gotas</option>
                            <option value="Inyectable">Inyectable</option>
                            <option value="Otro">Otro</option>
                        </x-filament::input.select>
                    </div>
                    
                    <div class="w-32">
                        <p>Estado</p>
                        <x-filament::input.select 
                            wire:model="estado" 
                            wire:change="obtenerItemsFiltrados" 
                            label="Estado"
                            class="!w-40 py-1 px-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600"
                        >
                            <option value="">Todos</option>
                            <option value="nuevo">Nuevo/Sellado</option>
                            <option value="abierto">Abierto</option>
                            <option value="usado">Parcialmente usado</option>
                        </x-filament::input.select>
                    </div>
                    <x-filament::button 
                        wire:click="limpiarFiltros" 
                        color="gray" 
                        size="sm"
                    >
                        <span class="text-black dark:text-white">Limpiar</span>
                    </x-filament::button>

                    <div wire:loading wire:target="obtenerItemsFiltrados">
                        <svg class="animate-spin h-5 w-5 text-gray-500 inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    </div>
                </div>


                {{-- Tabla de registros --}}
                <div wire:loading.remove wire:target="unidad,presentacion,estado">
                    @php
                        $itemsFiltrados = $this->obtenerItemsFiltrados();
                    @endphp

                    @if($itemsFiltrados->isEmpty())
                        <p class="text-gray-500">No hay registros para este medicamento con los filtros actuales.</p>
                        @else
                        <div class="overflow-x-auto max-h-96" >
                            <table class="w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                                <thead class="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th class="px-4 py-2 text-left"></th>
                                        <th class="px-4 py-2 text-left">Cantidad</th>
                                        <th class="px-4 py-2 text-left">Unidad</th>
                                        <th class="px-4 py-2 text-left">Presentación</th>
                                        <th class="px-4 py-2 text-left">Estado</th>
                                        <th class="px-4 py-2 text-left">Fecha Ingreso</th>
                                        <th class="px-4 py-2 text-left">Fecha Actualización</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($itemsFiltrados as $med)
                                        <tr class="border-t" wire:key="med-{{ $med->id }}">
                                            <td class="px-4 py-2 text-center">
                                                <input type="radio" wire:model="selected" value="{{ $med->id }}">
                                            </td>
                                            <td class="px-4 py-2 text-center">
                                                <input type="number" min="0" wire:model.lazy="cantidades.{{ $med->id }}" 
                                                class="border rounded px-1 w-16 text-center bg-gray-100 dark:bg-gray-800" 
                                                placeholder="{{ $med->cantidad }}"
                                                title="Puedes editar la cantidad del medicamento">
                                            </td>
                                            <td class="px-4 py-2 text-center">{{ $med->tipo_unidad }}</td>
                                            <td class="px-4 py-2 text-center">{{ $med->presentacion }}</td>
                                            <td class="px-4 py-2 text-center">{{ ucfirst($med->estado) }}</td>
                                            <td class="px-4 py-2 text-center">{{ $med->created_at }}</td>
                                            <td class="px-4 py-2 text-center">{{ $med->updated_at }}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @endif
                </div>
            </div>


        <x-slot name="footer">
            <div x-data="{ selected: @entangle('selected') }">
                <x-filament::button wire:click="guardar">Guardar Cambios</x-filament::button>
                <template x-if="selected">
                    <x-filament::button wire:click="eliminar" color="danger">
                        Eliminar
                    </x-filament::button>
                </template>
            </div>
        </x-slot>
</div>
</x-filament::modal>
