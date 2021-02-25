<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WarehousesImport extends Model
{
    protected $fillable = ['warehouse_id', 'user_id', 'notes'];
    
    public function warehousesImportsItem() {
        return $this->hasMany('App\WarehousesImportsItem');
    }
    
    public function warehouse() {
        return $this->belongsTo('App\Warehouse');
    }
    
    public function user() {
        return $this->belongsTo('App\User');
    }
}
