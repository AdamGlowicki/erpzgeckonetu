<?php

use Faker\Generator as Faker;

use App\Contractor;
use App\Warehouse;
use App\User;

$factory->define(App\WarehousesIn::class, function (Faker $faker) {
    $contractors = Contractor::all()->pluck('id')->toArray();
    $warehouses = Warehouse::all()->pluck('id')->toArray();
    $users = User::all()->pluck('id')->toArray();
    
    return [
        'contractor_id' => $faker->randomElement($contractors),
        'warehouse_id' => $faker->randomElement($warehouses),
        'user_id' => $faker->randomElement($users),
        'document_name' => $faker->ean13,
        'invoice_name' => $faker->isbn13,
        'notes' => $faker->text(200)
    ];
});
