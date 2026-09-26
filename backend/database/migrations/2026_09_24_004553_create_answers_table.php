<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->constrained('surveys')->onDelete('cascade');
            $table->foreignId('question_id')->constrained('questions')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Colaborador que responde
            $table->json('answer_value'); // Guardamos como JSON para soportar cadenas o arrays (múltiple selección)
            $table->timestamp('answered_at')->useCurrent(); // Fecha y hora exacta de respuesta
            $table->string('ip_address', 45)->nullable(); // Opcional: auditoría
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('answers');
    }
};