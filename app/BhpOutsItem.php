<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BhpOutsItem extends Model
{
    protected $fillable = ['bhp_out_id', 'bhp_item_id', 'quantity'];

    public function bhpOut() {
        return $this->belongsTo('App\BhpOut');
    }

    public function bhpItem() {
        return $this->belongsTo('App\BhpItem');
    }
}
