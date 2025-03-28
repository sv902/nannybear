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
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('city');
            $table->string('district');
            $table->string('phone');            
            $table->date('birth_date');
            $table->enum('gender', ['male', 'female']); // Стать
            $table->json('specialization');
            $table->json('work_schedule'); // Графік роботи
            $table->json('education');
            $table->json('languages');          
            $table->json('additional_skills'); // Додаткові навички
            $table->decimal('experience_years', 3, 1); // Досвід у роках
            $table->decimal('hourly_rate', 8, 2); 
            $table->string('photo')->nullable();               
            $table->json('availability')->nullable();
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
