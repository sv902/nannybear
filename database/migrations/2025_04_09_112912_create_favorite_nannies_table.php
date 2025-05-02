<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('favorite_nannies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // батько
            $table->foreignId('nanny_id')->constrained('nanny_profiles')->onDelete('cascade'); // няня
            $table->timestamps();
    
            $table->unique(['user_id', 'nanny_id']); // одна вподобайка на няню від одного користувача
        });
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorite_nannies');
    }
};
