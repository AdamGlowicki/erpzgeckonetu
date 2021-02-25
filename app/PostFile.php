<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PostFile extends Model
{
    protected $fillable = ['name', 'data', 'body_id'];
    protected $table = 'post_files';

    public function body() {
        return $this->belongsTo(Body::class);
    }
}
