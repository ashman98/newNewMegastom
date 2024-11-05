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
        Schema::create('treatments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dentist_id');
            $table->unsignedBigInteger('patient_id');

            $table->foreign('dentist_id')
                ->references('id')->on('users')->onDelete('cascade');
            $table->foreign('patient_id')
                ->references('id')->on('patients')->onDelete('cascade');

            $table->string('title',40);
            $table->text('diagnosis')->nullable();
            $table->text('treatment_plan')->nullable();
            $table->decimal('amount')->nullable();
            $table->tinyInteger('del_status')->default('0');
            $table->timestamp('treatment_plan_start_date');
            $table->timestamp('treatment_plan_end_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('treatments');
    }
};
