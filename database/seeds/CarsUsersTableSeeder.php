<?php

use Illuminate\Database\Seeder;

class CarsUsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\CarsUser::class, 10)->create();
    }
}
