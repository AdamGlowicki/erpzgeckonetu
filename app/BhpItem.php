<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BhpItem extends Model
{
    protected $fillable = ['name', 'unit_id'];
    
    public function unit() {
        return $this->belongsTo('App\Unit');
    }
    
    public function bhpUsersStocksItem() {
        return $this->hasMany('App\BhpUsersStocksItem');
    }
    
    public function bhpOut() {
        return $this->hasMany('App\BhpOut');
    }
}
