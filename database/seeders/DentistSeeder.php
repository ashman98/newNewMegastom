<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DentistSeeder extends Seeder
{
    public function run()
    {
        $dentist = [
            'name' => 'Մետ',
            'surname' => 'Մարգարյան',
            'phone' => '088776655',
            'city' => 'Արզական',
            'address' => '712/5',
            'region' => 'Կոտայք',
            'email' => 'metmargaryan@gmail.com',
            'password' => 'Met.123',
            'email_verified_at' => Carbon::now(),
            'gender' => 'female',
        ];

        User::create($dentist);
    }
}
