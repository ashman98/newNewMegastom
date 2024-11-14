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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255); // Name column
            $table->string('surname', 255); // Surname column
            $table->string('phone', 20); // Phone column (adjust length as needed)
            $table->string('city', 100); // City column (adjust length as needed)
            $table->string('address', 255); // Address column
            $table->date('birthday');
            $table->enum('gender', ['male', 'female', 'non-binary', 'other'])->nullable();
            $table->tinyInteger('active')->default('0');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
