<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(TaxesTableSeeder::class);
        $this->call(UnitsTableSeeder::class);
        $this->call(CountriesTableSeeder::class);
        $this->call(UsersTableSeeder::class);
        $this->call(PermissionTableSeeder::class);
        // $this->call(ItemsCategoriesTableSeeder::class);
        // $this->call(ItemsManufacturersTableSeeder::class);
        // $this->call(WarehousesTableSeeder::class);
        // $this->call(ContractorsTableSeeder::class);
        // $this->call(WarehousesInTableSeeder::class);
        // $this->call(WarehousesInTableSeeder::class);
        // $this->call(ItemsTableSeeder::class);
        // $this->call(CarsTableSeeder::class);
        // $this->call(CarsItemsTableSeeder::class);
        // $this->call(CarsUsersTableSeeder::class);
        // $this->call(WarehousesInCarsTableSeeder::class);
        // $this->call(WarehousesOutCarsTableSeeder::class);
        // $this->call(WarehousesInItemsTableSeeder::class);
        // $this->call(WarehousesOutItemsTableSeeder::class);
        // $this->call(WarehousesStocksTableSeeder::class);
    }
}
