<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // 1. Ejecutar el Seeder de Tipos de Pregunta
        $this->call([
            QuestionTypeSeeder::class,
        ]);

        // 2. Crear usuario Admin (solo si no existe)
        User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Administrador Demo',
                'password' => Hash::make('12345678'),
                'role' => 'admin',
                'active' => true,
                'company_id' => 1
            ]
        );

        // 3. Crear usuario Colaborador de prueba (solo si no existe)
        User::firstOrCreate(
            ['email' => 'colab@test.com'],
            [
                'name' => 'Juan Colaborador',
                'password' => Hash::make('12345678'),
                'role' => 'collaborator',
                'active' => true,
                'company_id' => 1
            ]
        );

        
    }
}
