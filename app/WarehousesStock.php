<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WarehousesStock extends Model
{
    use \Awobaz\Compoships\Compoships;

    protected $fillable = ['item_id', 'warehouse_id', 'quantity', 'data'];

    public function item() {
        return $this->belongsTo('App\Item');
    }

    public function warehouse() {
        return $this->belongsTo('App\Warehouse');
    }

    public function warehousesPlace() {
        return $this->hasOne('App\WarehousesPlace', ['item_id', 'warehouse_id'], ['item_id', 'warehouse_id']);
    }

    public function element() {
        return $this->morphMany('App\Element', 'element');
    }
}
