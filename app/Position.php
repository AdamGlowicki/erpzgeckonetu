<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    protected $table = 'positions';
    protected $fillable = ['x', 'y', 'node_id'];

    public function nodes() {
        $this->belongsTo(Node::class);
    }

    public function deletePosition() {
        try {
            return parent::delete();
        } catch (\Exception $e) {
        }
    }
}
