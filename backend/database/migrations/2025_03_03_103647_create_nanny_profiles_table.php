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
            $table->string('photo')->nullable();
            $table->text('experience')->nullable();
            $table->text('qualification')->nullable();
            $table->string('education')->nullable();
            $table->json('languages')->nullable();
            $table->json('availability')->nullable();
            $table->json('nanny_type')->nullable(); // Масив типів няні
            $table->string('schedule_type')->nullable(); // Графік роботи
            $table->string('employment_duration')->nullable(); // Тривалість роботи
            $table->json('additional_skills')->nullable(); // Додаткові навички
            $table->integer('experience_years')->nullable(); // Досвід у роках
            $table->enum('gender', ['male', 'female', 'other'])->nullable(); // Стать
            $table->string('payment_level')->nullable(); // Рівень оплати
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
