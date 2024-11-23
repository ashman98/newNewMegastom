<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DiseaseSeeder extends Seeder
{
    public function run()
    {
        $diseases = [
            ['title' => 'Սիրտանոթային հիվանդություններ', 'name' => 'cardiovascular_diseases'],
            ['title' => 'Անեմիա կամ արյան որևէ հիվանդություն', 'name' => 'anemia_or_other_blood_disorders'],
            ['title' => 'Թոքային հիվանդություններ', 'name' => 'pulmonary_diseases'],
            ['title' => 'Լյարդի հիվանդություններ', 'name' => 'liver_diseases'],
            ['title' => 'Ստամոքսաղիքային հիվանդություններ', 'name' => 'gastrointestinal_diseases'],
            ['title' => 'Երիկամային հիվանդություններ', 'name' => 'kidney_diseases'],
            ['title' => 'Վահանաձև գեղձի հիվանդություններ', 'name' => 'thyroid_diseases'],
            ['title' => 'Դիաբետ-շաքարախտ', 'name' => 'diabetes'],
            ['title' => 'Ուռուցք կամ նորագոյացություններ', 'name' => 'tumors_or_neoplasms'],
            ['title' => 'Վեներական հիվանդություններ', 'name' => 'venereal_diseases'],
            ['title' => 'Ալերգիկ հիվանդություններ', 'name' => 'allergic_diseases'],
        ];

        // Вставка данных в таблицу diseases
        DB::table('diseases')->insert($diseases);
    }
}
