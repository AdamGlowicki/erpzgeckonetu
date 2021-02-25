<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Doc extends Model
{
    protected $fillable = ['title', 'file_id', 'user_id'];

    public function file() {
        return $this->morphMany('App\File', 'file');
    }

    public function user() {
        return $this->belongsTo('App\User');
    }
}
