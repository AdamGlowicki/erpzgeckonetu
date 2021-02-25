<?php

use Faker\Generator as Faker;
use App\ItemsManufacturer;
use App\ItemsCategory;
use App\Unit;

$factory->define(App\Item::class, function (Faker $faker) {
    $itemManufacturers = ItemsManufacturer::all()->pluck('id')->toArray();
    $itemCategories = ItemsCategory::all()->pluck('id')->toArray();
    $units = Unit::all()->pluck('id')->toArray();
    
    return [
        'items_manufacturer_id' => $faker->randomElement($itemManufacturers),
        'items_category_id' => $faker->randomElement($itemCategories),
        'unit_id' => $faker->randomElement($units),
        'model_name' => $faker->company,
        'low_quant' => $faker->randomNumber(2)
    ];
});
