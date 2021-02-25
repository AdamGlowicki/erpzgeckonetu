<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarsInsItem extends Model
{
    protected $fillable = ['cars_in_id', 'item_id', 'quantity'];
    
    public function carsIn() {
        return $this->belongsTo('App\CarsIn');
    }
    
    public function item() {
        return $this->belongsTo('App\Item');
    }
    
    public function element() {
        return $this->morphMany('App\Element', 'element');
    }
}
