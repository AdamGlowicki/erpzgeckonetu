<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Curl;

class UNMS extends Model
{
    protected $url, $username, $password, $token;

    public function __construct() {
        parent::__construct();

        $this->url = env('UNMS_URL');
        $this->token = env('UNMS_TOKEN');
    }

    public function devices() {
        $response = Curl::to($this->url . 'devices')
                ->asJson()
                ->withHeader('x-auth-token: '. $this->token())
                ->returnResponseObject()
                ->get();

        if($response->status !== 200) {
            return false;
        }

        return $response->content;
    }

    public function search($string) {
        $response = Curl::to($this->url . 'nms/search?count=10&page=1&query='. urlencode($string))
            ->asJson()
            ->withHeader('x-auth-token: '. $this->token())
            ->returnResponseObject()
            ->get();

        if($response->status !== 200) {
            return false;
        }

        return $response->content;
    }

    private function token() {
        return $this->token;
    }
}
