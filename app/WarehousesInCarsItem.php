<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WarehousesInCarsItem extends Model
{
    protected $fillable = [
        'warehouses_in_car_id',
        'item_id',
        'quantity',
    ];
    
    public function warehousesInCar() {
        return $this->belongsTo('App\WarehousesInCar');
    }
    
    public function item() {
        return $this->belongsTo('App\Item');
    }
    
    public function element() {
        return $this->morphMany('App\Element', 'element');
    }
}
