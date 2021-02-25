<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarsMovesItem extends Model
{
    protected $fillable = ['cars_move_id', 'item_id', 'quantity'];
    
    public function carsMove() {
        return $this->belongsTo('App\CarsMove');
    }
    
    public function item() {
        return $this->belongsTo('App\Item');
    }
    
    public function element() {
        return $this->morphMany('App\Element', 'element');
    }
}
