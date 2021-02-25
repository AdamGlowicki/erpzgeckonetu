<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Ixudra\Curl\Facades\Curl;
use proj4php\Point;
use proj4php\Proj;
use proj4php\Proj4php;

class Geoportal extends Model
{
    public function get($parcel) {
        $result = Curl::to('https://polska.e-mapa.net/application/system/select.php')
            ->withContentType('application/x-www-form-urlencoded')
            ->withHeader('Referer: https://polska.e-mapa.net/')
            ->withHeader('Origin: https://polska.e-mapa.net')
            ->withHeader('User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36')
            ->withData([
                'action' => 'select_by_id',
                'srid' => '2180',
                'id' => 'sys.dzialka.' . $parcel,
                'color' => '220 170 0',
            ])
            ->returnResponseObject()
            ->post();

        $response = json_decode(trim(preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $result->content)));

        if(isset($response->box)) {
            $proj4 = new Proj4php();

            $proj_epsg = new Proj('EPSG:2180', $proj4);
            $proj_wsg = new Proj('EPSG:4326', $proj4);

            $pointSrc = new Point($response->box[0], $response->box[1], $proj_epsg);
            $pointDest = $proj4->transform($proj_wsg, $pointSrc);

            $pointSrc2 = new Point($response->box[2], $response->box[3], $proj_epsg);
            $pointDest2 = $proj4->transform($proj_wsg, $pointSrc2);

            $points = [
                (object) [
                    'lat' => $pointDest->toArray()[0],
                    'lng' => $pointDest->toArray()[1],
                ],
                (object) [
                    'lat' => $pointDest2->toArray()[0],
                    'lng' => $pointDest2->toArray()[1],
                ]
            ];

            return $points;
        }

        return false;
    }
}
