<?php

use Illuminate\Database\Seeder;

class ItemsCategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\ItemsCategory::class, 20)->create();
    }
}
