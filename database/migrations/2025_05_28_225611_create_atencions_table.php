<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('atencions', function (Blueprint $table) {
            $table->id();
            $table->string('sintomas');
            $table->string('diagnostico')->nullable();
            $table->string('tratamiento')->nullable();
            $table->integer('presion_arterial')->nullable();
            $table->integer('temperatura')->nullable();
            $table->integer('frecuencia_cardiaca')->nullable();
            $table->integer('frecuencia_respiratoria')->nullable();
            $table->integer('peso')->nullable();
            $table->string('saturacion')->nullable();            
            $table->timestamps();

            $table->unsignedBigInteger('paciente_id');
            $table->unsignedBigInteger('jornada_id');

            $table->foreign('paciente_id')->references('id')->on('pacientes')->onDelete('cascade');
            $table->foreign('jornada_id')->references('id')->on('jornadas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('atencions');
    }
};
