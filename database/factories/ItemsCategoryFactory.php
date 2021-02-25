<?php

use Faker\Generator as Faker;

$factory->define(App\ItemsCategory::class, function (Faker $faker) {
    return [
        'name' => $faker->word
    ];
});
