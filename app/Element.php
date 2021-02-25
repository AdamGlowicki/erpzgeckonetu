<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Element extends Model
{
    protected $fillable = ['mac', 'sn', 'item_id'];

    public function elementable() {
        return $this->morphTo();
    }

    public function item() {
        return $this->belongsTo('App\Item');
    }
}
