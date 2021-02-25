<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarPhoto extends Model
{
    protected $table = 'cars_photos';
    protected $fillable = ['name', 'path', 'type', 'automobile_id'];

    public function automobile() {
        return $this->belongsTo(Automobile::class);
    }
}
