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
        Schema::create('teeth', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('treatment_id');

            $table->foreign('treatment_id')
                ->references('id')->on('treatments')->onDelete('cascade');

            $table->string('title');
            $table->tinyInteger('tooth_number')->nullable();

            $table->tinyInteger('del_status')->default('0');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teeth');
    }
};
