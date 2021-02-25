<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WarehousesPlace extends Model
{
    use \Awobaz\Compoships\Compoships;

    protected $fillable = ['user_id', 'warehouse_id', 'item_id', 'name'];

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function warehouse() {
        return $this->belongsTo('App\Warehouse');
    }

    public function item() {
        return $this->belongsTo('App\Item');
    }

    public function warehousesStock() {
        return $this->hasMany('App\WarehousesStock');
    }
}
