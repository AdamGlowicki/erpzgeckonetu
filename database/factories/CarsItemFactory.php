<?php

use Faker\Generator as Faker;
use App\Car;
use App\Item;

$factory->define(App\CarsItem::class, function (Faker $faker) {
    $cars = Car::all()->pluck('id')->toArray();
    $items = Item::all()->pluck('id')->toArray();
    
    return [
        'car_id' => $faker->randomElement($cars),
        'item_id' => $faker->unique()->randomElement($items),
        'quantity' => $faker->randomNumber(1)
    ];
});
