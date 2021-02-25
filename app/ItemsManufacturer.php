<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ItemsManufacturer extends Model
{
    protected $fillable = ['name'];
    
    public function item() {
        return $this->hasMany('App\Item');
    }
}
