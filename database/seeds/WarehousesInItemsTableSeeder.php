<?php

use Illuminate\Database\Seeder;

class WarehousesInItemsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\WarehousesInItem::class, 100)->create();
    }
}
