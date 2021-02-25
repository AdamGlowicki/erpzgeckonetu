<?php

use Illuminate\Database\Seeder;

class PrevFilesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $arr = [
            'name' => 'imie',
            'data' => 'path',
            'body_id' => 1,
        ];

        DB::table('prev_files')->insert($arr);
    }
}
