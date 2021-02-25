<?php

use Faker\Generator as Faker;
use App\Country;

$factory->define(App\Warehouse::class, function (Faker $faker) {
    $countries = Country::all()->pluck('id')->toArray();
    
    return [
        'country_id' => $faker->randomElement($countries),
        'name' => $faker->company,
        'postcode' => $faker->postcode,
        'street' => $faker->streetAddress,
        'city' => $faker->city,
        'type' => 0
    ];
});
