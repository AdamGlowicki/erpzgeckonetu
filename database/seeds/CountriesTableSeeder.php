<?php

use Illuminate\Database\Seeder;

class CountriesTableSeeder extends Seeder {
    public function run() 
    {
        $result = fopen(storage_path('app/countries.csv'), 'r'); 

        $countries = [];
        
        while(($country = fgetcsv($result, 1024, ';')) !== false) {
            $countries[] = ['name' => $country[0], 'name_en' => $country[1], 'code' => $country[2]];
        }

        DB::table('countries')->insert($countries);
    }
}