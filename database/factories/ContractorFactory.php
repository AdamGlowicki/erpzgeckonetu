<?php

use Faker\Generator as Faker;
use Faker\Provider\pl_PL\Person;
use App\Country;

$factory->define(App\Contractor::class, function (Faker $faker) {
    $countries = Country::all()->pluck('id')->toArray();
    
    return [
        'name' => $faker->company,
        'country_id' => $faker->randomElement($countries),
        'postcode' => $faker->postcode,
        'street' => $faker->streetAddress,
        'city' => $faker->city,
        'bacc_iban' => $faker->bankAccountNumber,
        'bacc_swift' => $faker->swiftBicNumber,
        'type' => $faker->numberBetween(0, 1),
        'nip' => $faker->taxpayerIdentificationNumber
    ];
});
