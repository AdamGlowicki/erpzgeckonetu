<?php

use Faker\Generator as Faker;

use App\Car;
use App\Warehouse;
use App\User;

$factory->define(App\WarehousesInCar::class, function (Faker $faker) {
    $cars = Car::all()->pluck('id')->toArray();
    $warehouses = Warehouse::all()->pluck('id')->toArray();
    $users = User::all()->pluck('id')->toArray();
    
    return [
        'car_id' => $faker->randomElement($cars),
        'warehouse_id' => $faker->randomElement($warehouses),
        'user_id' => $faker->randomElement($users),
        'document_name' => $faker->isbn13
    ];
});
