<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarsMove extends Model
{
    protected $fillable = ['document_id', 'user_in_id', 'user_out_id', 'car_in_id', 'car_out_id', 'document_name', 'notes', 'approved'];

    public function car_in() {
        return $this->belongsTo('App\Car', 'car_in_id');
    }

    public function car_out() {
        return $this->belongsTo('App\Car', 'car_out_id');
    }

    public function user_in() {
        return $this->belongsTo('App\User', 'user_in_id');
    }

    public function user_out() {
        return $this->belongsTo('App\User', 'user_out_id');
    }

    public function carsMovesItem() {
        return $this->hasMany('App\CarsMovesItem');
    }

    public static function boot() {
        parent::boot();

        static::deleting(function($object) {
            $object->carsMovesItem()->delete();
        });
    }
}
