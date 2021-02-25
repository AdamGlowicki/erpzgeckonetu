<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class NodeData extends Model
{
    protected $fillable = ['label', 'node_id'];
    protected $table = 'nodes_data';

    public function styles() {
        return $this->hasOne(Style::class, 'node_data_id');
    }

    public function deleteNodesData() {
        $this->styles()->delete();

        try {
            return parent::delete();
        } catch (\Exception $e) {
        }
    }
}
