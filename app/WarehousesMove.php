<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WarehousesMove extends Model
{
    protected $fillable = [
        'document_id',
        'user_id',
        'warehouse_in_id',
        'warehouse_out_id',
        'document_name',
        'notes',
    ];

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function warehouse_in() {
        return $this->belongsTo('App\Warehouse', 'warehouse_in_id');
    }

    public function warehouse_out() {
        return $this->belongsTo('App\Warehouse', 'warehouse_out_id');
    }

    public function warehousesMovesItem() {
        return $this->hasMany('App\WarehousesMovesItem');
    }
}
