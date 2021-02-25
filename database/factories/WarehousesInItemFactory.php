<?php

use Faker\Generator as Faker;
use App\WarehousesIn;
use App\Item;
use App\Tax;

$factory->define(App\WarehousesInItem::class, function (Faker $faker) {
    $warehousesIn = WarehousesIn::all()->pluck('id')->toArray();
    $items = Item::all()->pluck('id')->toArray();
    $taxes = Tax::all()->pluck('id')->toArray();
    
    return [
        'warehouses_in_id' => $faker->randomElement($warehousesIn),
        'item_id' => $faker->unique()->randomElement($items),
        'tax_id' => $faker->randomElement($taxes),
        'price_notax' => $faker->randomFloat(2, 1, 1000),
        'price_withtax' => $faker->randomFloat(2, 1, 1000),
        'quantity' => $faker->randomNumber(2)
    ];
});
