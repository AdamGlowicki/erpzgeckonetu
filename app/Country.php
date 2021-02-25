<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $table = 'countries';
    protected $fillable = ['country_id', 'name', 'postcode', 'city', 'street'];
    
    public function warehouse() {
        return $this->hasMany('App\Warehouse');
    }
    
    public function user() {
        return $this->hasMany('App\User');
    }
}
