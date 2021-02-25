<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SecondPostFile extends Model
{
    protected $fillable = ['name', 'data', 'body_id'];
    protected $table = 'second_post_files';

    public function body() {
        return $this->belongsTo(Body::class);
    }
}
