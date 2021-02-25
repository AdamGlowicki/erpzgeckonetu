<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ItemsCategory extends Model
{
    protected $table = 'items_categories';
    protected $fillable = ['name'];
    
    public function item() {
        return $this->hasMany('App\Item');
    }
}
