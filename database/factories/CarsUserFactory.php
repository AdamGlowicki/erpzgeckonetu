<?php

use Faker\Generator as Faker;

use App\User;
use App\Car;

$factory->define(App\CarsUser::class, function (Faker $faker) {
    $users = User::all()->pluck('id')->toArray();
    $cars = Car::all()->pluck('id')->toArray();
    
    return [
        'car_id' => $faker->randomElement($cars),
        'user_id' => $faker->unique()->randomElement($users)
    ];
});
