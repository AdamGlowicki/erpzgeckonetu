<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    protected $fillable = ['country_id', 'name', 'descr', 'postcode', 'street', 'city', 'type'];

    public function country() {
        return $this->belongsTo('App\Country');
    }

    public function warehousesStock() {
        return $this->hasMany('App\WarehousesStock');
    }

    public function warehousesPlace() {
        return $this->hasMany('App\WarehousesPlace');
    }
}
