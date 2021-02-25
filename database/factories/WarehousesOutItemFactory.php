<?php

use Faker\Generator as Faker;
use App\WarehousesOut;
use App\Item;

$factory->define(App\WarehousesOutItem::class, function (Faker $faker) {
    $warehousesOut = WarehousesOut::all()->pluck('id')->toArray();
    $items = Item::all()->pluck('id')->toArray();
    
    return [
        'warehouses_out_id' => $faker->randomElement($warehousesOut),
        'item_id' => $faker->unique()->randomElement($items)
    ];
});
