<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Storage;

class Ekw extends Model
{
    protected $table = 'ekw';
    
    public function scopeExisting($query) {
        return $query->where('exists', 1);
    }

    public function loadData($name, $kw) {
        return Storage::disk('local')->get("ekw/{$kw}_{$name}.dat");
    }
}
