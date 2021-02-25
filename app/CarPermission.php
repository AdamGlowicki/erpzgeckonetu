<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarPermission extends Model
{
    protected $fillable = ['user_id', 'warehouseman', 'driver', 'admin'];
    protected $table = 'cars_permissions';
}
