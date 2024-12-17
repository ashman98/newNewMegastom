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
            'name' => 'Գևորգ',
            'surname' => 'Գևորգ',
            'phone' => '088776655',
            'city' => 'Հրազդան',
            'address' => '712/5',
            'region' => 'Կոտայք',
            'email' => 'gevorg@gmail.com',
            'password' => 'Gevorg.123',
            'email_verified_at' => Carbon::now(),
            'gender' => 'male',
        ];

        $user = User::create($dentist);
//        $user = User::find(5);
        $user->assignRole('dentist');
//        $user->removeRole('dentist');
//        $user->removeRole('admin');
        $user->assignRole('admin');
        $user->assignRole('super_admin');
    }
}
