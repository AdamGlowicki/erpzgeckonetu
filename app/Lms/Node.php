<?php

namespace App\Lms;

use Illuminate\Database\Eloquent\Model;

class Node extends Model
{
    protected $connection = 'lms';

    public function getIpaddrAttribute($value) {
        return long2ip($value);
    }

    public function address() {
        return $this->belongsTo('App\Lms\Address');
    }
}
