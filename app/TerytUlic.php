<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TerytUlic extends Model
{
    protected $table = 'teryt_ulic';

    public function terytSimc() {
        return $this->belongsTo('App\TerytSimc', 'SYM', 'SYM');
    }
}
