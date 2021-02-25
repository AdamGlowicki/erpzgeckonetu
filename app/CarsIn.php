<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarsIn extends Model
{
    protected $fillable = ['document_id', 'car_id', 'client_id', 'investment_id', 'user_id', 'document_name', 'notes'];

    public function car() {
        return $this->belongsTo('App\Car');
    }

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function carsInsItem() {
        return $this->hasMany('App\CarsInsItem');
    }

    public function investment() {
        return $this->belongsTo('App\Investment');
    }

    public function client() {
        return $this->belongsTo('App\Client');
    }
}
