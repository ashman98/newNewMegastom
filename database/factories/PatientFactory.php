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
            'birthday' => $this->faker->date('Y-m-d', '-18 years'), // Дата рождения (минимум 18 лет)
            'gender' => $this->faker->randomElement(['male', 'female']),
            'active' => $this->faker->boolean(20),
        ];
    }
}
