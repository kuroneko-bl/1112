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
            
            // ИСПРАВЛЕНО: foreignId вместо foreingId
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            $table->string('room_type');
            $table->date('start_date');
            $table->string('payment_method');
            $table->string('status')->default('Новая');
            $table->text('review')->nullable();
            
            // ИСПРАВЛЕНО: timestamps() только один раз и в конце
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