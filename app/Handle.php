<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Handle extends Model
{
    protected $fillable = ['handleId', 'type', 'position', 'node_id'];
    protected $table = 'handles';

    public function nodes() {
        return $this->belongsTo(Node::class);
    }

    public function deleteHandle() {
        try {
            return parent::delete();
        } catch (\Exception $e) {
        }
    }
}
