<?php 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('question_types', function (Blueprint $table) {
            $table->id('idtipo'); // PK personalizada
            $table->string('strtipo', 50); // Nombre/Descripción del tipo
            $table->timestamps();
        });

        
    }

    public function down(): void
    {
        Schema::dropIfExists('question_types');
    }
};