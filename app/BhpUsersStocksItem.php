<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BhpUsersStocksItem extends Model
{
    protected $fillable = ['bhp_item_id', 'user_id', 'quantity'];

    public function bhpItem() {
        return $this->belongsTo('App\BhpItem');
    }

    public function user() {
        return $this->belongsTo('App\User');
    }
}
