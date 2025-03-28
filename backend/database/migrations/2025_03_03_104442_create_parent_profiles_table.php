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
        Schema::create('parent_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');  // зв'язок з користувачем
            $table->string('first_name');  // Ім'я
            $table->string('last_name')->nullable();  // Прізвище (необов'язкове)
            $table->date('birth_date');  // Дата народження
            $table->string('city');  // Місто
            $table->string('phone');  // Телефон                    
            $table->json('children')->nullable(); // Діти (масив дітей)
            $table->string('district')->nullable();  // Район  
            $table->string('address')->nullable(); // Вулиця та Будинок 
            $table->integer('floor')->nullable(); // Поверх
            $table->string('apartment')->nullable(); // Квартира
            $table->string('photo')->nullable(); 
            $table->timestamps(); // Дата створення та оновлення
        });
    }    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parent_profiles');
    }
};
