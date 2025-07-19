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
        Schema::create('incidencias', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->enum('status', ['salida', 'entrada'])->default('entrada');
            $table->string('motivo')->nullable();
            $table->unsignedBigInteger('jornada_users_id');

            $table->foreign('jornada_users_id')->references('id')->on('jornada_users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incidencias');
    }
};
