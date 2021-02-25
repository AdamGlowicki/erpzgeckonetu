<?php

use Illuminate\Database\Seeder;

class TaxesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $taxes = (object) [
            ['name' => 'VAT 23%', 'multipler' => '23'],
            ['name' => 'VAT 8%', 'multipler' => '8'],
            ['name' => 'VAT 5%', 'multipler' => '5'],
            ['name' => 'VAT 0%', 'multipler' => '0'],
        ];     
        
        foreach($taxes as $row) {
            DB::table('taxes')->insert([
                'name' => $row['name'],
                'multipler' => $row['multipler']
            ]);
        }
    }
}
