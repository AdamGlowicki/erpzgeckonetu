<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Model;
use Faker\Generator as Faker;

$factory->define(App\Invest::class, function (Faker $faker) {
    return [
        (object)[
        'parent_id' => null,
        'level' => null,
        'client' => $faker->sentence(1),
        'stage_name' => $faker->sentence(1),
    ],
        (object)[
        'parent_id' => 1,
        'level' => 1,
        'client' => $faker->sentence(1),
        'stage_name' => $faker->sentence(1),
    ],
        (object)[
        'parent_id' => 1,
        'level' => 1,
        'client' => $faker->sentence(1),
        'stage_name' => $faker->sentence(1),
    ],

    ];
});
