<?php

use Illuminate\Database\Seeder;

class HeadsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $arr = [
            'label' => 'naglowek',
            'table_id' => 1,
        ];

        DB::table('heads')->insert($arr);
    }
}
