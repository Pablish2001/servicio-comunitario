<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Carrera;


class CarreraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $carreras = [
            'Licenciatura En Gestión De Alojamiento Turístico',
            'Ciencias Ambientales',
            'Educación Integral',
            'Educación. Mención Educación Física, Deporte Y Recreación',
            'Educación. Mención Lengua Y Literatura',
            'Educación. Mención Matemática',
            'Educación En Ciencias: Física',
            'Educación En Ciencias: Química',
            'Educación En Ciencias: Biología',
            'Administración De Empresas',
            'Administración Mención Banca Y Finanzas',
            'Ciencias Fiscales',
            'Contaduría Pública',
            'Ingeniería En Informática',
            'Ingeniería En Materiales',
            'Ingeniería Industrial',
        ];

        foreach ($carreras as $nombre) {
            Carrera::create(['nombre' => $nombre]);
        }
    }
}
