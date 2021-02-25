<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WarehousesIn extends Model
{
    protected $table = 'warehouses_in';
    protected $fillable = ['document_id', 'contractor_id', 'warehouse_id', 'user_id', 'document_name', 'invoice_name', 'invoice_date', 'notes'];

    public function warehousesInItem() {
        return $this->hasMany('App\WarehousesInItem');
    }

    public function contractor() {
        return $this->belongsTo('App\Contractor');
    }

    public function warehouse() {
        return $this->belongsTo('App\Warehouse');
    }

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function price() {
        return $this->hasMany('App\WarehousesInItem')->selectRaw('`warehouses_in_id`, SUM(ROUND((`price_notax` * `quantity`), 2)) AS `price`')->groupBy('warehouses_in_items.warehouses_in_id');
    }

    public function file() {
        return $this->morphMany('App\File', 'file');
    }
}
