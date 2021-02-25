<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RmasReason extends Model
{
    protected $fillable = ['name'];
    
    public function rma() {
        return $this->hasMany('App\Rma');
    }
}
