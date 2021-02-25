<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WarehousesMovesItem extends Model
{
    protected $fillable = [
        'warehouses_move_id',
        'item_id',
        'quantity',
    ];
    
    public function warehousesOutCar() {
        return $this->belongsTo('App\WarehousesMove');
    }
    
    public function item() {
        return $this->belongsTo('App\Item');
    }
    
    public function element() {
        return $this->morphMany('App\Element', 'element');
    }
}
