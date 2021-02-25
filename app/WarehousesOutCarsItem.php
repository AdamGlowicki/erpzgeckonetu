<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WarehousesOutCarsItem extends Model
{
    protected $fillable = [
        'warehouses_out_car_id',
        'item_id',
        'quantity',
    ];
    
    public function warehousesOutCar() {
        return $this->belongsTo('App\WarehousesOutCar');
    }
    
    public function item() {
        return $this->belongsTo('App\Item');
    }
    
    public function element() {
        return $this->morphMany('App\Element', 'element');
    }
}
