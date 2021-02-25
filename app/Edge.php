<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Edge extends Model
{
    protected $fillable = ['edgeId', 'source', 'target', 'sourceHandle', 'targetHandle', 'animated', 'graph_id'];
    protected $table = 'edges';

    public function graphs() {
        return $this->belongsTo(Graph::class);
    }

    public function deleteEdge() {
        try {
            return parent::delete();
        } catch (\Exception $e) {
        }
    }
}
