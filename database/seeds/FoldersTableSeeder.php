<?php

use Illuminate\Database\Seeder;

class FoldersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $arr = [
            'folder_name' => 'imie',
            'task_id' => 1,
        ];

        DB::table('folders')->insert($arr);
    }
}
