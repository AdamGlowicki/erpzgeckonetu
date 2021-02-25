<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RequestsItem extends Model
{
    protected $fillable = ['request_id', 'item_id', 'quantity'];
    
    public function request() {
        return $this->belongsTo('App\Request');
    }
    
    public function item() {
        return $this->belongsTo('App\Item');
    }
}
