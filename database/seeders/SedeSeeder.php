<?php

namespace Database\Seeders;

use App\Models\Sede;
use Illuminate\Database\Seeder;

class SedeSeeder extends Seeder
{
    public function run(): void
    {
        Sede::firstOrCreate(
            ['id' => 1],
            [
                'nombre' => 'Villa Asia',
                'direccion' => 'Sede de Villa Asia en la Calle China, Sector Villa Asia, Parroquia Cachamay, Municipio Autónomo Caroní, Puerto Ordaz, Estado Bolívar',
                'invocador' => 'VASede',
                ]
        );
    }
}
