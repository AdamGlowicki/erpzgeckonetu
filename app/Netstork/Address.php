<?php

namespace App\Netstork;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $connection = 'sqlsrv';
    protected $table = 'Address';

    public function building() {
        return $this->hasMany('App\Netstork\Building');
    }
}
