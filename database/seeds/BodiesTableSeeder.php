<?php

use Illuminate\Database\Seeder;

class BodiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $arr[] = [
            'title' => 'tytuł',
            'all_files' => false,
            'send_date' => now(),
            'receive_date' => now(),
            'status' => '',
            'is_second_table' => false,
            'second_date' => now(),
            'is_all_second_files' => false,
            'second_status' => '',
            'table_id' => 1,
        ];

        DB::table('bodies')->insert($arr);
    }
}
