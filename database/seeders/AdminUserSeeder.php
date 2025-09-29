<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Persona;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
    // Crea una persona asociada al usuario
        $persona = Persona::create([
            'nombre' => 'Pablo',
            'apellido' => 'Jimenez',
            'email' => 'pablishdev2001@gmail.com',
            'contacto' => '95984155253',
            'genero' => 'masculino',
        ]);

        // Crea el usuario administrador
        User::create([
            'cedula' => '30110259',
            'password' => bcrypt('password'), // Cambia la contraseña si lo deseas
            'status' => 'activo',
            'isAdmind' => true,
            'persona_id' => $persona->id,
        ]);
    }
}
