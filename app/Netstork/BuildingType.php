<?php

namespace App\Netstork;

use Illuminate\Database\Eloquent\Model;

class BuildingType extends Model
{
    protected $connection = 'sqlsrv';
    protected $table = 'BuildingType';
}
