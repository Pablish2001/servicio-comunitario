<x-filament::card>
    {{-- Header --}}
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
        <div class="flex items-center space-x-3">
            <div class="p-2 bg-white/20 rounded-lg">
                <x-heroicon-o-beaker class="w-6 h-6 text-black dark:text-white" />
            </div>
            <div>
                <h3 class="text-xl font-bold text-black dark:text-white">Registro de Medicamentos</h3>
                <p class="text-blue-100 text-sm">Ingresa la información del medicamento donado</p>
            </div>
        </div>
    </div>

    {{-- Formulario --}}
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 mx-4">
        <form wire:submit.prevent="saveMedicamento" class="space-y-8">
            <div class="px-6 pb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"    
                x-data="{
                nombre: @entangle('medicamento.nombre').live ,
                items: @js($nombreMedicamentosOptions),
                get esNuevo() {
                    return this.nombre && !this.items.includes(this.nombre);
                }
            }">
                    {{-- Nombre --}}
                    <x-filament::input
                        label="Nombre del Medicamento"
                        wire:model.defer="medicamento.nombre"
                        required
                        list="nombresMedicamentos"
                        placeholder="Ej: Paracetamol"
                        class="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-0 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                    />
                    <datalist id="nombresMedicamentos">
                        @foreach ($nombreMedicamentosOptions as $opcion)
                            <option value="{{ $opcion }}">{{ $opcion }}</option>
                        @endforeach
                    </datalist>

                    {{-- Cantidad --}}
                    <x-filament::input
                        label="Cantidad"
                        wire:model.defer="medicamento.cantidad"
                        type="number"
                        min="1"
                        placeholder="Cantidad"
                        required
                        class="w-1/3 pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-0 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                    />

                    {{-- Descripción --}}
                    <div class="mt-6" x-show="esNuevo">
                        <textarea
                            label="Descripción"
                            wire:model.defer="medicamento.descripcion"
                            rows="2"
                            placeholder="Descripción detallada del medicamento..."
                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-0 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 resize-none"
                        ></textarea>
                    </div>
                    
                    {{-- Indicador de nuevo o conocido --}}
                    <p class="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400" x-show="!nombre">
                        <span class="text-yellow-600 dark:text-yellow-400">⚠️ Indique el nombre</span>
                    </p>
                    <p class="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400" x-show="nombre">
                        <template x-if="esNuevo">
                            <span class="text-yellow-600 dark:text-yellow-400">⚠️ Nombre nuevo. Por favor, complete la descripción.</span>
                        </template>
                        <template x-if="!esNuevo">
                            <span class="text-green-600 dark:text-green-400">✔️ Nombre reconocido.</span>
                        </template>
                    </p>
                </div>
                

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {{-- Unidad --}}
                    <x-filament::input.select                         
                        label="Unidad de Medida"
                        wire:model.defer="medicamento.tipo_unidad"
                        class="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-0 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 appearance-none cursor-pointer"
                        >

                        <option value="Unidades">📦 Unidades</option>
                        <option value="Cajas">📦 Cajas</option>
                        <option value="Tabletas">💊 Tabletas</option>
                        <option value="Frascos">🍼 Frascos</option>
                        <option value="Mililitros">💧 Mililitros</option>
                        <option value="Miligramos">⚖️ Miligramos</option>
                        <option value="Gramos">⚖️ Gramos</option>
                        <option value="Otro">❓ Otro</option>
                    </x-filament::input.select>




                    {{-- Presentación --}}
                    <x-filament::input.select
                        label="Presentación"
                        wire:model.defer="medicamento.presentacion"
                        class="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-0 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 appearance-none cursor-pointer"
                    >
                        <option value="Suspension">🥤 Suspensión</option>
                        <option value="Tabletas">💊 Tabletas</option>
                        <option value="Solucion">💉 Solución</option>
                        <option value="Jarabe">🍯 Jarabe</option>
                        <option value="Crema">🧴 Crema</option>
                        <option value="Gotas">💧 Gotas</option>
                        <option value="Inyectable">💉 Inyectable</option>
                        <option value="Otro">❓ Otro</option>
                    </x-filament::input.select>

                    {{-- Estado --}}
                    <x-filament::input.select
                        label="Estado del Producto"
                        wire:model.defer="medicamento.estado"
                        class="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-0 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 appearance-none cursor-pointer"     
                    >
                        <option value="nuevo">✨ Nuevo/Sellado</option>
                        <option value="abierto">📦 Abierto</option>
                        <option value="usado">⚠️ Parcialmente usado</option>
                    </x-filament::input.select>
                </div>
            </div>

            {{-- Botón --}}
            <div class="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 px-6">
                <x-filament::button type="submit">Guardar Medicamento</x-filament::button>
            </div>
        </form>
    </div>
</x-filament::card>



