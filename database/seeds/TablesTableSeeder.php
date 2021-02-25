<?php

use Illuminate\Database\Seeder;

class TablesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $arr = [
            'title' => 'tytuł',
            'type' => '',
            'task_id' => '1',
        ];

        DB::table('tables')->insert($arr);
    }
}
