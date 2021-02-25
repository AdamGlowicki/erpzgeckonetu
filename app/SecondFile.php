<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SecondFile extends Model
{
    protected $fillable = ['name', 'data', 'body_id'];
    protected $table = 'second_files';

    public function body() {
        return $this->belongsTo(Body::class);
    }
}
