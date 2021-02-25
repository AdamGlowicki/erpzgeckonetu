<?php

use Illuminate\Database\Seeder;

class ContractorsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Contractor::class, 10)->create();
    }
}
