<?php

use Illuminate\Database\Seeder;

class InvestFilesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $arr = [
            'name' => 'plik',
            'data' => 'path',
            'invest_id' => '1'
        ];

        DB::table('invest_files')->insert($arr);
    }
}
