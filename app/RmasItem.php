<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RmasItem extends Model
{
    protected $fillable = ['rma_id', 'item_id', 'quantity', 'new'];
    
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
