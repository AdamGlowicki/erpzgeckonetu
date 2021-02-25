<?php

use Illuminate\Database\Seeder;

class CarsItemsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\CarsItem::class, 10)->create();
    }
}
