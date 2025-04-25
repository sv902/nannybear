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
        Schema::create('parent_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nanny_profile_id')->constrained()->onDelete('cascade'); // Хто залишає відгук
            $table->foreignId('parent_profile_id')->constrained()->onDelete('cascade'); // Кому відгук
            $table->tinyInteger('rating')->default(5); // Оцінка від 1 до 5
            $table->text('comment')->nullable(); // Текстовий відгук
            $table->timestamps();
        });
    }    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parent_reviews');
    }
};
