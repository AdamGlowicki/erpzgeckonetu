<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarInvokes extends Model
{
    protected $fillable = ['name', 'path', 'automobile_id'];
    protected $table = 'cars_invokes';
}
