<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Persona;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- 1. CREATE AN ADMINISTRATOR USER ---
        // The logic is to first create the Persona, and then the associated User.

        // First, create the Persona for the admin
        $adminPersona = Persona::create([
            'nombre' => 'Admin',
            'apellido' => 'Principal',
            'email' => 'admin@example.com',
            'contacto' => '0412-1234567',
            'genero' => 'masculino',
        ]);

        // Then, use the Persona ID to create the admin User
        User::create([
            'cedula' => 'admin', // Easy to remember ID for login
            'password' => Hash::make('password'), // Password: password
            'status' => 'activo',
            'isAdmind' => true, // Mark as administrator
            'persona_id' => $adminPersona->id, // Associate with the Persona created above
        ]);


        // --- 2. CREATE REGULAR USERS (FOR TESTING) ---
        // We will create 3 example users.
        $passwords = ['password1', 'password2', 'password3'];
        $cedulas = ['1234567', '12345678', '123456789']; // Specific cedulas

        for ($i = 0; $i < 3; $i++) {
            // For each user, first create their Persona with fake data
            $persona = Persona::create([
                'nombre' => fake()->firstName(),
                'apellido' => fake()->lastName(),
                'email' => fake()->unique()->safeEmail(),
                'contacto' => fake()->phoneNumber(),
                'genero' => fake()->randomElement(['masculino', 'femenino']),
            ]);

            // And then create the associated User
            User::create([
                'cedula' => $cedulas[$i], // Use the specific cedulas
                'password' => Hash::make($passwords[$i]), // Use specific passwords
                'status' => 'activo',
                'isAdmind' => false, // Not administrators
                'persona_id' => $persona->id, // Associate with the newly created Persona
            ]);
        }
    }
}