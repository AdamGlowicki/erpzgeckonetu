<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WarehousesInItem extends Model
{
    protected $fillable = ['warehouses_in_id', 'item_id', 'tax_id', 'price_notax', 'price_withtax', 'quantity', 'data'];
    
    public function warehousesIn() {
        return $this->belongsTo('App\WarehousesIn');
    }
    
    public function item() {
        return $this->belongsTo('App\Item');
    }
    
    public function tax() {
        return $this->belongsTo('App\Tax');
    }
    
    public function element() {
        return $this->morphMany('App\Element', 'element');
    }
}
