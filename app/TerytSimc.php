<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TerytSimc extends Model
{
    use \Awobaz\Compoships\Compoships;

    protected $table = 'teryt_simc';

    public function woj() {
        return $this->belongsTo('App\TerytTerc', 'WOJ', 'WOJ')->where('POW', '')->where('GMI', '');
    }

    public function pow() {
        return $this->belongsTo('App\TerytTerc', ['WOJ', 'POW'], ['WOJ', 'POW'])->where('GMI', '');
    }

    public function gmi() {
        return $this->belongsTo('App\TerytTerc', ['WOJ', 'POW', 'GMI'], ['WOJ', 'POW', 'GMI']);
    }
}
