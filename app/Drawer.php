<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Drawer extends Model
{
    protected $fillable = ['name'];
    protected $table = 'drawers';

    public function invests()
    {
        return $this->hasMany(Invest::class);
    }
}


