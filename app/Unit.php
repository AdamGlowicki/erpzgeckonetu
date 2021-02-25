<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $fillable = ['name', 'short_name', 'type'];
    
    public function item() {
        return $this->hasMany('App\Item');
    }
}
