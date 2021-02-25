<?php

use Faker\Generator as Faker;
use App\Item;
use App\Warehouse;

$factory->define(App\WarehousesStock::class, function (Faker $faker) {
    $items = Item::all()->pluck('id')->toArray();
    $warehouses = Warehouse::all()->pluck('id')->toArray();
    
    return [
        'item_id' => $faker->randomElement($items),
        'warehouse_id' => $faker->randomElement($warehouses),
        'quantity' => $faker->randomNumber(1)
    ];
});
