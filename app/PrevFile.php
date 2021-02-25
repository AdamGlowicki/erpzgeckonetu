<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PrevFile extends Model
{
    protected $fillable = ['name', 'data', 'body_id'];
    protected $table = 'prev_files';

    public function body() {
        return $this->belongsTo(Body::class);
    }
}
