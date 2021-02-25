<?php

namespace App\Netstork;

use Illuminate\Database\Eloquent\Model;

class BuildingStatus extends Model
{
    protected $connection = 'sqlsrv';
    protected $table = 'BuildingStatus';
}
