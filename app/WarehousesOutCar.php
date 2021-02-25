<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WarehousesOutCar extends Model
{
    protected $fillable = [
        'document_id',
        'car_id',
        'warehouse_id',
        'user_approved_id',
        'user_get_id',
        'document_name',
        'notes',
    ];

    public function warehousesOutCarsItem() {
        return $this->hasMany('App\WarehousesOutCarsItem');
    }

    public function car() {
        return $this->belongsTo('App\Car');
    }

    public function warehouse() {
        return $this->belongsTo('App\Warehouse');
    }

    public function user_approved() {
        return $this->belongsTo('App\User', 'user_approved_id');
    }

    public function user_get() {
        return $this->belongsTo('App\User', 'user_get_id');
    }
}
