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
        Schema::create('nanny_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->constrained('parent_profiles')->onDelete('cascade'); 
            $table->enum('gender', ['male', 'female', 'no_matter'])->nullable();
            $table->string('specialization')->nullable();
            $table->string('work_schedule')->nullable();
            $table->string('education')->nullable();
            $table->string('languages')->nullable();
            $table->string('additional_skills')->nullable();
            $table->integer('experience_years')->nullable();
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nanny_preferences');
    }
};
