<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarsItem extends Model
{
    protected $fillable = ['car_id', 'item_id', 'quantity'];
    
    public function car() {
        return $this->belongsTo('App\Car');
    }
    
    public function item() {
        return $this->belongsTo('App\Item');
    }
    
    public function element() {
        return $this->morphMany('App\Element', 'element');
    }
}
