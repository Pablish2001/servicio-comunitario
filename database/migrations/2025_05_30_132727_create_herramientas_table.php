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
        Schema::create('herramientas', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('nombre');
            $table->string('descripcion')->nullable();
            $table->integer('cantidad')->default(0);
            $table->enum('status', ['bueno', 'regular','malo'])->default('bueno');

            $table->unsignedBigInteger('sede_id');

            $table->foreign('sede_id')->references('id')->on('sedes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('herramientas');
    }
};
