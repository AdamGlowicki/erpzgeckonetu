<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    public function itemsElement() {
        return $this->hasMany('App\ItemsElement');
    }
}
