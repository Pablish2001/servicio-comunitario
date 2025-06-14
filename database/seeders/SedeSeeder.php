<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sede; // Asegúrate de que el modelo Sede exista y esté importado

class SedeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // Limpiar la tabla de sedes antes de insertar nuevos datos (opcional, útil para evitar duplicados en cada run)
        // Sede::truncate(); 

        // Crear sedes de ejemplo
        Sede::create([
            'nombre' => 'Villa Asia',
            'direccion' => 'Av. Bolívar Norte, Centro Comercial X, Valencia',
        ]);

        Sede::create([
            'nombre' => 'Atlantico',
            'direccion' => 'Calle Y, Edificio Z, Urb. Chacao, Caracas',
        ]);

        Sede::create([
            'nombre' => 'Chilemex',
            'direccion' => 'Boulevard 5 de Julio, Edificio A, Maracaibo',
        ]);

        // Puedes añadir más sedes si lo necesitas
        // Sede::create([
        //     'nombre' => 'Sede Barquisimeto',
        //     'direccion' => 'Av. Florencio Jiménez, C.C. Las Trinitarias, Barquisimeto',
        // ]);

        $this->command->info('¡Sedes creadas exitosamente!');
    }
}