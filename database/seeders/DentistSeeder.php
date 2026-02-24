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
            'name' => 'Ադմին',
            'surname' => 'Ադմինյան',
            'phone' => '098776655',
            'city' => 'Հրազդան',
            'address' => 'Հասցե',
            'region' => 'Կոտայք',
            'email' => 'admin@admin.com',
            'password' => 'Super11',
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
