<?php

use Faker\Generator as Faker;

$factory->define(App\Unit::class, function (Faker $faker) {
    $units = ['szt.', 'kpl.', 'm'];
    $unit = $faker->unique()->randomElement($units);
    
    return [
        'name' => $unit,
        'short_name' => $unit,
        'type' => 0
    ];
});
