<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\Survey;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SurveyOneQuestionsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Asegurar que exista la encuesta ID 1
        $survey = Survey::firstOrCreate(
            ['id' => 1],
            [
                'title' => 'Encuesta de Clima Laboral y Satisfacción',
                'description' => 'Evaluación periódica para colaboradores.',
                'active' => true
            ]
        );

        // 2. Limpiar preguntas anteriores de la encuesta ID 1 (para reseteo fácil)
        Question::where('survey_id', 1)->delete();

        // 3. Crear el set de preguntas demostrativas
        $questions = [
            [
                'survey_id' => 1,
                'question_type_id' => 1, // Selección única (Radio)
                'title' => '¿Cómo calificas tu nivel de satisfacción laboral actual?',
                'options' => ['Excelente', 'Bueno', 'Regular', 'Malo'],
                'is_required' => true,
                'order_index' => 1
            ],
            [
                'survey_id' => 1,
                'question_type_id' => 2, // Selección única (Select)
                'title' => '¿A qué departamento o área perteneces?',
                'options' => ['Desarrollo / TI', 'Recursos Humanos', 'Ventas', 'Operaciones'],
                'is_required' => true,
                'order_index' => 2
            ],
            [
                'survey_id' => 1,
                'question_type_id' => 3, // Selección múltiple (Checkbox)
                'title' => '¿Qué beneficios valoras más en la empresa?',
                'options' => ['Trabajo remoto / Híbrido', 'Capacitaciones', 'Seguro médico', 'Horario flexible'],
                'is_required' => false,
                'order_index' => 3
            ],
            [
                'survey_id' => 1,
                'question_type_id' => 4, // Selección múltiple (Select múltiple)
                'title' => '¿Qué tecnologías o herramientas utilizas a diario?',
                'options' => ['Angular', 'Laravel', 'Docker', 'Git', 'Figma'],
                'is_required' => false,
                'order_index' => 4
            ],
            [
                'survey_id' => 1,
                'question_type_id' => 5, // Pregunta abierta (Texto)
                'title' => '¿Tienes alguna sugerencia o comentario adicional para mejorar el entorno de trabajo?',
                'options' => null,
                'is_required' => false,
                'order_index' => 5
            ],
        ];

        foreach ($questions as $q) {
            Question::create($q);
        }
    }
}