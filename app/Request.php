<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    protected $fillable = ['document_id', 'user_id', 'warehouse_id', 'car_id', 'document_name', 'date', 'approved', 'notes'];

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function requestsItem() {
        return $this->hasMany('App\RequestsItem');
    }

    public function warehouse() {
        return $this->belongsTo('App\Warehouse');
    }

    public function car() {
        return $this->belongsTo('App\Car');
    }

    public function investment() {
        return $this->hasOne('App\Investment');
    }

    public function file() {
        return $this->morphMany('App\File', 'file');
    }
}
