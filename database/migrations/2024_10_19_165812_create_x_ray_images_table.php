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
        Schema::create('x_ray_images', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->text('path');
            $table->unsignedBigInteger('tooth_id');

            $table->tinyInteger('del_status')->default('0');

            $table->foreign('tooth_id')
                ->references('id')->on('teeth')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('x_ray_images');
    }
};
