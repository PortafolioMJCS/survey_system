<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insertar los tipos por defecto requeridos
        DB::table('question_types')->insert([
            ['idtipo' => 1, 'strtipo' => 'Selección única (Radio)', 'created_at' => now(), 'updated_at' => now()],
            ['idtipo' => 2, 'strtipo' => 'Selección única (Selector/Select)', 'created_at' => now(), 'updated_at' => now()],
            ['idtipo' => 3, 'strtipo' => 'Selección múltiple (Checkbox)', 'created_at' => now(), 'updated_at' => now()],
            ['idtipo' => 4, 'strtipo' => 'Selección múltiple (Select múltiple)', 'created_at' => now(), 'updated_at' => now()],
            ['idtipo' => 5, 'strtipo' => 'Pregunta abierta (Texto)', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
