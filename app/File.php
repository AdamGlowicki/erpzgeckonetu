<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $fillable = ['name', 'path'];

    public function fileable() {
        return $this->morphTo();
    }
}
