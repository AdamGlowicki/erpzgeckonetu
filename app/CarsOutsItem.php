<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarsOutsItem extends Model
{
    protected $fillable = ['cars_out_id', 'item_id', 'quantity'];
    
    public function carsOut() {
        return $this->belongsTo('App\CarsOut');
    }
    
    public function item() {
        return $this->belongsTo('App\Item');
    }
    
    public function element() {
        return $this->morphMany('App\Element', 'element');
    }
}
