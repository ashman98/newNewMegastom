<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Patient>
 */
class PatientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName,
            'surname' => $this->faker->lastName,
            'phone' => $this->faker->unique()->phoneNumber,
            'city' => $this->faker->city,
            'address' => $this->faker->address,
            'active' => $this->faker->boolean,
            'birthday' => Carbon::now(),
        ];
    }
}
