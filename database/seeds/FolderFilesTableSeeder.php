<?php

use Illuminate\Database\Seeder;

class FolderFilesTableSeeder extends Seeder
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
            'folder_id' => 1,
        ];

        DB::table('folder_files')->insert($arr);
    }
}
