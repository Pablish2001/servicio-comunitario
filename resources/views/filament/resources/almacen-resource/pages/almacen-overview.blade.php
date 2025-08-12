
<x-filament::page>
    
    <div x-data="{ tab: 'registrar' }">
        {{-- Tabs --}}
        <div class="mb-4 flex space-x-2 border-b">
            <button
                @click="tab = 'registrar'"
                :class="tab === 'registrar' ? 'border-b-2 border-primary-600 text-primary-600 font-medium' : 'text-gray-600'"
                class="px-4 py-2 transition-all"
            >
                Registrar nuevo
            </button>

            <button
                @click="tab = 'items-medicamentos'"
                :class="tab === 'items-medicamentos' ? 'border-b-2 border-primary-600 text-primary-600 font-medium' : 'text-gray-600'"
                class="px-4 py-2 transition-all"
            >
                items
            </button>
        </div>

        {{-- Formulario de Registro --}}
        <div x-show="tab === 'registrar'" x-cloak>    
            <div x-data="{ tab: 'medicamentos' }">
                {{-- Tabs --}}
                <div class="mb-4 flex space-x-2 border-b">
                    <button
                        @click="tab = 'medicamentos'"
                        :class="tab === 'medicamentos' ? 'border-b-2 border-primary-600 text-primary-600 font-medium' : 'text-gray-600'"
                        class="px-4 py-2 transition-all"
                    >
                        medicamentos
                    </button>

                    <button
                        @click="tab = 'herramientas'"
                        :class="tab === 'herramientas' ? 'border-b-2 border-primary-600 text-primary-600 font-medium' : 'text-gray-600'"
                        class="px-4 py-2 transition-all"
                    >
                        herramientas
                    </button>
                </div>
                
                {{-- Formulario Medicamentos --}}
                <div x-show="tab === 'medicamentos'" x-cloak>
                    @livewire('almacen.medicamento-form')
                </div>

                {{-- Formulario Herramientas --}}
                <div x-show="tab === 'herramientas'" x-cloak>
                    <h1 class="text-lg font-semibold">Registrar Herramienta</h1>
                </div>
            </div>
        </div>











        {{-- Lista de Items y Medicamentos Registrados --}}
        <div x-show="tab === 'items-medicamentos'" x-cloak>                     
            <div x-data="{ tab: 'items-medicamentos' }">
                {{-- Tabs --}}
                <div class="mb-4 flex space-x-2 border-b">
                    <button
                        @click="tab = 'items-medicamentos'"
                        :class="tab === 'items-medicamentos' ? 'border-b-2 border-primary-600 text-primary-600 font-medium' : 'text-gray-600'"
                        class="px-4 py-2 transition-all"
                    >
                        items medicamentos
                    </button>

                    <button
                        @click="tab = 'items-herramientas'"
                        :class="tab === 'items-herramientas' ? 'border-b-2 border-primary-600 text-primary-600 font-medium' : 'text-gray-600'"
                        class="px-4 py-2 transition-all"
                    >
                        items herramientas
                    </button>
                </div>
                
                {{-- Formulario Medicamentos --}}
                <div x-show="tab === 'items-medicamentos'" x-cloak>
                    @livewire('almacen.items-medicamentos')
                </div>
                

                {{-- Formulario Herramientas --}}
                <div x-show="tab === 'items-herramientas'" x-cloak>
                    @livewire('almacen.items-herramientas')
                </div>
            </div>
        </div>


    </div>
</x-filament::page>






