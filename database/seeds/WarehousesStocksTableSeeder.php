<?php

use Illuminate\Database\Seeder;

class WarehousesStocksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\WarehousesStock::class, 20)->create();
    }
}
