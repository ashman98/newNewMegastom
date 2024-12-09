<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSe extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Создание прав
        $addPatient = Permission::create(['name' => 'add_patient']);
        $deletePatient = Permission::create(['name' => 'delete_patient']);
        $updatePatient = Permission::create(['name' => 'update_patient']);

        $addTreatment = Permission::create(['name' => 'add_treatment']);
        $deleteTreatment = Permission::create(['name' => 'delete_treatment']);
        $updateTreatment = Permission::create(['name' => 'update_treatment']);

        $addTooth = Permission::create(['name' => 'add_tooth']);
        $deleteTooth = Permission::create(['name' => 'delete_tooth']);
        $updateTooth = Permission::create(['name' => 'update_tooth']);

        $addDentist = Permission::create(['name' => 'add_dentist']);
        $deleteDentist = Permission::create(['name' => 'delete_dentist']);
        $updateDentist = Permission::create(['name' => 'update_dentist']);

        // Создание ролей
        $admin = Role::create(['name' => 'admin']);
        $superAdmin = Role::create(['name' => 'super_admin']);
        $dentist = Role::create(['name' => 'dentist']);

        // Назначение прав ролям
        $admin->givePermissionTo([
            $addTooth, $deleteTooth, $updateTooth,
            $addTreatment, $deleteTreatment, $updateTreatment,
            $addPatient, $deletePatient, $updatePatient,
        ]);
        $superAdmin->givePermissionTo([
            $addDentist, $deleteDentist, $updateDentist,
            $addTooth, $deleteTooth, $updateTooth,
            $addTreatment, $deleteTreatment, $updateTreatment,
            $addPatient, $deletePatient, $updatePatient,
        ]);
        $dentist->givePermissionTo([
            $addTooth, $deleteTooth, $updateTooth,
            $addTreatment, $deleteTreatment, $updateTreatment,
            $addPatient, $deletePatient, $updatePatient,
        ]);
        $this->command->info('Роли и права были успешно созданы!');
    }
}
