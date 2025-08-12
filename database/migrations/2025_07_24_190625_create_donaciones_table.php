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
        Schema::create('donaciones', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('data')->nullable(); // Puede ser string, date, o json según lo que quieras
            $table->string('nombre_articulo');
            $table->text('descripcion')->nullable();
            $table->enum('tipo', ['medicamento', 'herramienta'])->default('medicamento');
            $table->boolean('fue_cargado')->default(false);
            $table->timestamps();
            $table->unsignedBigInteger('sede_id')->required();

            $table->foreign('sede_id')->references('id')->on('sedes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donaciones');
    }
};
