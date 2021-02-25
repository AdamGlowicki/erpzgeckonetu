<?php

use Illuminate\Database\Seeder;

class TasksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $arr[] = [
            'name' => 'Imie',
            'notes' => 'ddadsdsdadadadasddsadadsads',
            'mini_note' => 'dasa',
            'invest_id' => 2,
            'status' => '',
        ];

        DB::table('tasks')->insert($arr);
    }
}
