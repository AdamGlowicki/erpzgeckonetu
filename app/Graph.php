<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Graph extends Model
{
    protected $table = 'graphs';
    protected $fillable = ['name'];

    public function nodes() {
        return $this->hasMany(Node::class);
    }

    public function edges() {
        return $this->hasMany(Edge::class);
    }

    public function deleteGraph($id) {

        Node::where('graph_id', $id)->each(function($node) {
            $node->deleteNode($node['graph_id']);
        });
        try {
            return parent::delete();
        } catch (\Exception $e) {
        }
    }
}
