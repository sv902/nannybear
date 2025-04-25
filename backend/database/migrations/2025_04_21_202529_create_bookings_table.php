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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
        
            $table->foreignId('parent_id')->constrained('parent_profiles')->onDelete('cascade');
            $table->foreignId('nanny_id')->constrained('nanny_profiles')->onDelete('cascade');
            $table->foreignId('address_id')->constrained('parent_addresses')->onDelete('cascade');
        
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time')->nullable();
        
            $table->enum('payment_type', ['card', 'cash']);
            $table->decimal('hourly_rate', 8, 2);
            $table->decimal('total_price', 8, 2);
        
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');
            $table->enum('nanny_approval', ['waiting', 'accepted', 'rejected'])->default('waiting');
        
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
