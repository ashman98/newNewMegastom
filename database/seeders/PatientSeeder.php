<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\Treatment;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->count(2)->create();
        Patient::factory()->count(5000)->create();
        Treatment::factory()->count(150)->create();
    }
}
