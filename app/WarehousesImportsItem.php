<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WarehousesImportsItem extends Model
{
    protected $fillable = ['warehouses_import_id', 'item_id', 'quantity'];
    
    public function warehousesImport() {
        return $this->belongsTo('App\WarehousesImport');
    }
    
    public function item() {
        return $this->belongsTo('App\Item');
    }
    
    public function element() {
        return $this->morphMany('App\Element', 'element');
    }
}
