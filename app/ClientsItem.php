<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientsItem extends Model
{
    protected $fillable = ['client_id', 'item_id', 'quantity'];

    public function client() {
        return $this->belongsTo('App\Client');
    }

    public function item() {
        return $this->belongsTo('App\Item');
    }

    public function element() {
        return $this->morphMany('App\Element', 'element');
    }
}
