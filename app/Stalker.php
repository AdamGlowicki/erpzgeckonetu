<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Curl;

class Stalker extends Model
{
    protected $url, $login, $pwd, $token;
    
    public function __construct() {
        parent::__construct();
        
        $this->url = env('STALKER_URL');
        $this->login = env('STALKER_LOGIN');
        $this->pwd = env('STALKER_PWD');
    }
    
    public function devices() {
        $response = Curl::to($this->url . 'accounts')
                ->withOption('USERPWD', $this->login .':'. $this->pwd)
                ->asJson()
                ->returnResponseObject()
                ->get();
        
        if($response->status !== 200) {
            return false;
        }
        
        return $response->content->results;
    }
}
