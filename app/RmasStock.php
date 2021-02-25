<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RmasStock extends Model
{
    protected $fillable = ['rma_id', 'item_id', 'quantity'];
    
    public function rma() {
        return $this->belongsTo('App\Rma');
    }
    
    public function item() {
        return $this->belongsTo('App\Item');
    }
    
    public function element() {
        return $this->morphMany('App\Element', 'element');
    }
}
