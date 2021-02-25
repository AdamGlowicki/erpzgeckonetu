<?php

use Illuminate\Database\Seeder;

class ItemsElementsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\ItemsElement::class, 200)->create();
    }
}
