<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $teryt;

    public function search($city) {
        $teryt = new \App\Teryt;
        $result = $teryt->city($city);

        return $result;
    }

    public function searchByStreet($city, $street) {
        $teryt = new \App\Teryt;
        $result = $teryt->cityAndStreet($city, $street);

        return $result;
    }

    public function searchByStreetLocal($cityId, $street) {
        $teryt = new \App\Teryt;
        $result = $teryt->cityAndStreetLocal($cityId, $street);

        return $result;
    }

    public function info($cityId, $streetId, $buildingNumber) {
        $result = Netstork\Building::with(['address', 'buildingStatus', 'buildingTechnology', 'buildingType'])
            ->whereHas('address', function($query) use($cityId, $streetId) {
                $query->where('street_teryt_code', "{$cityId}_{$streetId}");
            })
            ->where('building_number', $buildingNumber)
            ->get();

        return $result;
    }
}
