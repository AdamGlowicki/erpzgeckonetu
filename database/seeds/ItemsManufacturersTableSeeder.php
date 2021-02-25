<?php

use Illuminate\Database\Seeder;

class ItemsManufacturersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\ItemsManufacturer::class, 20)->create();
    }
}
