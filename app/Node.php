<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Node extends Model
{
    protected $table = 'nodes';
    protected $fillable = ['type', 'graph_id'];

    public function nodesData() {
        return $this->hasOne(NodeData::class);
    }

    public function positions() {
        return $this->hasOne(Position::class);
    }

    public function handles() {
        return $this->hasMany(Handle::class);
    }

    public function graphs() {
        return $this->belongsTo(Graph::class);
    }

    public function deleteNode($id) {
        $this->handles()->delete();
        NodeData::where('node_id', $id)->each(function ($item) {
           $item->deleteNodesData();
        });
        $this->positions()->delete();

        try {
            return parent::delete();
        } catch (\Exception $e) {
        }
    }
}
