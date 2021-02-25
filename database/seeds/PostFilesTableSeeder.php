<?php

use Illuminate\Database\Seeder;

class PostFilesTableSeeder extends Seeder
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

        DB::table('post_files')->insert($arr);
    }
}
