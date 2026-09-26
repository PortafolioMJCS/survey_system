<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->constrained('surveys')->onDelete('cascade');
            $table->unsignedBigInteger('question_type_id'); // Relación con idtipo
            $table->text('title'); // Título o enunciado de la pregunta
            $table->json('options')->nullable(); // JSON con las opciones posibles (ej. ['Opción A', 'Opción B'])
            $table->boolean('is_required')->default(true); // Controla si es obligatoria
            $table->integer('order_index')->default(0); // Para ordenar las preguntas en la encuesta
            $table->timestamps();

            // Llave foránea hacia question_types
            $table->foreign('question_type_id')
                  ->references('idtipo')
                  ->on('question_types')
                  ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};