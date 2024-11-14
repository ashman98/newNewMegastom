<?php

namespace Database\Factories;

use App\Models\Treatment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TreatmentFactory extends Factory
{
    protected $model = Treatment::class;

    public function definition()
    {
        // Generating a random start date
        $startDate = $this->faker->dateTimeBetween('-1 years', 'now');
        // Generating an end date that is after the start date
        $endDate = $this->faker->optional()->dateTimeBetween($startDate, '+6 months');

        return [
            'dentist_id' => User::factory(), // Dynamically create a dentist User
            'patient_id' => Patient::factory(), // Dynamically create a Patient
            'title' => "Voluptatum quia tempore.", //$this->faker->sentence(3),
            'diagnosis' => $this->faker->paragraph,
            'treatment_plan' => $this->faker->paragraph,
            'amount' => $this->faker->randomFloat(2, 50, 1000),
            'del_status' => $this->faker->boolean ? 1 : 0,
            'treatment_plan_start_date' => $startDate,
            'treatment_plan_end_date' => $endDate,
        ];
    }
}
