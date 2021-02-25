<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Head extends Model
{
    protected $fillable = ['label', 'table_id'];
    protected $table = 'heads';

    public function table() {
        return $this->belongsTo(Table::class);
    }
}
