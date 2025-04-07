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
        Schema::create('educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nanny_profile_id')->constrained()->onDelete('cascade'); // зв'язок з профілем
            $table->string('institution'); // назва ЗВО
            $table->string('specialty');   // спеціальність
            $table->string('years');       // роки навчання
            $table->string('diploma_image')->nullable(); // шлях до фото диплому (якщо буде)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('educations');
    }
};
