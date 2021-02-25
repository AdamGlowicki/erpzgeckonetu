<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cookie;

class ApiToken extends Model
{
    public static function verify() {
        if(!Cookie::get('apiToken')) {
            return false;
        }

        if(!User::select('id')->where('api_token', Cookie::get('apiToken'))->first()) {
            return false;
        }

        return true;
    }

    public function user() {
        $result = User::where('api_token', Cookie::get('apiToken'))->first();

        return $result;
    }
}
