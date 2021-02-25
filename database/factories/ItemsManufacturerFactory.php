<?php

use Faker\Generator as Faker;

$factory->define(App\ItemsManufacturer::class, function (Faker $faker) {
    return [
        'name' => $faker->company
    ];
});
