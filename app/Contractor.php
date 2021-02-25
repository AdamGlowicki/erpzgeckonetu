<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Contractor extends Model
{
    protected $fillable = ['country_id', 'name', 'postcode', 'street', 'city', 'bacc_iban', 'bacc_swift', 'nip', 'type'];
    
    public function country() {
        return $this->belongsTo('App\Country');
    }
    
    public function warehousesIn() {
        return $this->hasMany('App\WarehousesIn');
    }
}
