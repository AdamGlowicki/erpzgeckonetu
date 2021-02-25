<?php

use Illuminate\Database\Seeder;

class WarehousesInTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\WarehousesIn::class, 25)->create();
    }
}
