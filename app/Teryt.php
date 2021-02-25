<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use mrcnpdlk\Teryt\Client;
use mrcnpdlk\Teryt\NativeApi;

class Teryt extends Model
{
    /*
    public $api;

    protected $table = 'teryt_ulic';

    public function __construct(array $attributes = array())
    {
        parent::__construct($attributes);

        $login = '';
        $password = '';

        $oClient = new Client();
        $oClient->setConfig('geckonet', '#03MsOke4Z', true);

        $this->api = NativeApi::create($oClient);
    }

    public function city($val) {
        try {
            $result = $this->api->WyszukajMiejscowosc($val);

            return $result;
        } catch (Exception $ex) {
            return false;
        }
    }

    public function cityAndStreet($city, $street) {
        try {
            $result = $this->api->WyszukajUlice($street, null, $city);

            return $result;
        } catch (Exception $ex) {
            return false;
        }
    }

    public function cityAndStreetLocal($cityId, $street) {
        $result = self::where('SYM', $cityId)
                    ->where('NAZWA_1', 'LIKE', "%{$street}%")->get();

        return $result;
    }
    */

    public function cityAndStreetLocal($city, $street) {
        $result = TerytUlic::where('SYM', $city)
            ->where('NAZWA_1', 'LIKE', "%{$street}%")
            ->get();

        return $result;
    }

    public function city($val) {
        $equal = TerytSimc::with(['woj', 'pow', 'gmi'])
            ->where('NAZWA', $val)
            ->whereHas('gmi', function($query) use($val) {
                $query->where('NAZWA', 'LIKE', "%{$val}%");
            })
            ->limit(5)
            ->get();

        $result = TerytSimc::with(['woj', 'pow', 'gmi'])
            ->where('NAZWA', $val)
            ->orWhere('NAZWA', 'LIKE', "{$val}%")
            // ->orderBy('NAZWA', 'ASC')
            ->orderByRaw("CASE WHEN `woj` = '04' OR `woj` = '22' THEN 1 ELSE 2 END, `woj` DESC")
            ->limit(250)
            ->get();

        $result = $equal->merge($result);

        return $result;
    }
}
