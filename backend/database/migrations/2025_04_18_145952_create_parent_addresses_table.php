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
        Schema::create('parent_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_profile_id')->constrained()->onDelete('cascade');
            $table->string('type')->default('Дім');
            $table->string('city');
            $table->string('district')->nullable();
            $table->string('address')->nullable(); // вулиця і номер
            $table->integer('floor')->nullable();
            $table->string('apartment')->nullable();
            $table->timestamps();
        });        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parent_addresses');
    }
};
