<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarsUser extends Model
{
    protected $fillable = ['user_id', 'car_id'];
    
    public function user() {
        return $this->belongsTo('App\User');
    }
    
    public function car() {
        return $this->belongsTo('App\Car');
    }
}
