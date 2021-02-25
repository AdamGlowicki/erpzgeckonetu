<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Wiki extends Model
{
    use SoftDeletes;

    protected $fillable = ['user_id', 'title', 'content', 'approved'];

    public function user() {
        return $this->belongsTo('App\User');
    }
}
