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
        if (!Schema::hasTable('reviews')) {
            Schema::create('reviews', function (Blueprint $table) {
                $table->id();
                $table->foreignId('parent_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('nanny_id')->constrained('users')->onDelete('cascade');
                $table->integer('rating')->default(5);
                $table->text('comment');
                $table->text('reply')->nullable();
                $table->timestamps();


                // Батько не може залишати більше одного відгуку для однієї няні
                $table->unique(['parent_id', 'nanny_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
