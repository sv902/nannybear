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
        Schema::create('working_hours', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('nanny_id');
            $table->date('start_date');        
            $table->time('start_time');
            $table->time('end_time');

            $table->boolean('is_available')->default(true);

            $table->timestamps();

            $table->foreign('nanny_id')
                ->references('id')
                ->on('nanny_profiles')
                ->onDelete('cascade');

            // уникнення дублювання записів для тієї ж няні і того ж діапазону
            $table->unique(['nanny_id', 'start_date', 'start_time', 'end_time'], 'working_hours_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('working_hours');
    }
};
