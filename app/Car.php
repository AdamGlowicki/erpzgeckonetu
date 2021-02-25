<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    protected $fillable = ['user_id', 'name', 'registration', 'service_date', 'locked'];

    public function carsItem() {
        return $this->hasMany('App\CarsItem');
    }

    public function carsUser() {
        return $this->hasMany('App\CarsUser');
    }

    public function user() {
        return $this->belongsTo('App\User');
    }
}
