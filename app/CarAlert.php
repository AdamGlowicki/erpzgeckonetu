<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarAlert extends Model
{
    protected $table = 'cars_alerts';
    protected $fillable = ['automobile_id', 'type', 'link', 'kms', 'days'];
}
