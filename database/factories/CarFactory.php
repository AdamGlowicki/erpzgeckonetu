<?php

use Faker\Generator as Faker;

$factory->define(App\Car::class, function (Faker $faker) {
    return [
        'name' => 'CSW '. $faker->randomNumber(5)
    ];
});
