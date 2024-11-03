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
        Patient::factory()->count(2)->create();
        User::factory()->count(2)->create();
        Treatment::factory()->count(150)->create();
    }
}
