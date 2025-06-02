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
        Schema::create('jornadas', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->unsignedBigInteger('sede_id');

            $table->foreign('sede_id')->references('id')->on('sedes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jornadas');
    }
};
