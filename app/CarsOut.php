<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarsOut extends Model
{
    protected $fillable = ['document_id', 'car_id', 'client_id', 'investment_id', 'user_id', 'contract_name', 'document_name', 'notes'];

    public function car() {
        return $this->belongsTo('App\Car');
    }

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function carsOutsItem() {
        return $this->hasMany('App\CarsOutsItem');
    }

    public function investment() {
        return $this->belongsTo('App\Investment');
    }

    public function client() {
        return $this->belongsTo('App\Client');
    }
}
