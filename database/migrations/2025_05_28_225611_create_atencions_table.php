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
            $table->string('presion_arterial')->nullable(); // CAMBIADO A STRING
            $table->integer('temperatura')->nullable();
            $table->integer('frecuencia_cardiaca')->nullable();
            $table->integer('frecuencia_respiratoria')->nullable();
            $table->integer('peso')->nullable();
            $table->string('saturacion')->nullable();
            $table->dateTime('fecha_atencion'); // NUEVO CAMPO
            $table->timestamps();
        
            $table->unsignedBigInteger('paciente_id');
            $table->unsignedBigInteger('jornada_id');
            $table->unsignedBigInteger('profesional_id'); // NUEVO CAMPO
        
            $table->foreign('paciente_id')->references('id')->on('pacientes')->onDelete('cascade');
            $table->foreign('jornada_id')->references('id')->on('jornadas')->onDelete('cascade');
            $table->foreign('profesional_id')->references('id')->on('users')->onDelete('cascade');
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
