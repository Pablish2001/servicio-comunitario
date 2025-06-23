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
        Schema::create('jornada_users', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->enum('status', ['pendiente', 'presente', 'ausente'])->default('presente');
            $table->timestamp('joined_at')->nullable();

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
        Schema::dropIfExists('jornada_users');
    }
};
