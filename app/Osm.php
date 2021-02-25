<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Curl;

class Osm extends Model
{
    public function reverse($lat, $long) {
        $response = Curl::to('https://nominatim.openstreetmap.org/reverse')
            ->withHeader('User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0')
            ->withData([
                'lat' => $lat,
                'lon' => $long,
                'format' => 'json'
            ])
            ->get();

        return json_decode($response);
    }
}
