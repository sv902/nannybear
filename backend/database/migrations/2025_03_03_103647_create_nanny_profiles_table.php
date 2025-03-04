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
        Schema::create('nanny_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('photo')->default('');
            $table->string('experience')->default(''); 
            $table->text('qualification')->default('');
            $table->string('education')->default('');
            $table->text('languages')->default(''); 
            $table->json('availability')->default(json_encode(['status' => 'unavailable'])); // Використовуємо правильний формат JSON
            $table->decimal('hourly_rate', 8, 2)->default(0);  // Додаємо дефолтне значення
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nanny_profiles');
    }
};
