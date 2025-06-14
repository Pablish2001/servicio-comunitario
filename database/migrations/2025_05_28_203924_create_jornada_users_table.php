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
        Schema::create('jornada_user', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->enum('status', ['presente', 'ausente'])->default('presente');
            $table->dateTime('assigned_at');

            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('jornada_id');

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('jornada_id')->references('id')->on('jornadas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jornada_user');
    }
};
