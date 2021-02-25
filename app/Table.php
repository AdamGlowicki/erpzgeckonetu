<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    protected $fillable = ['title', 'type', 'task_id'];
    protected $table = 'tables';

    public function task() {
        return $this->belongsTo(Task::class);
    }
    public function heads() {
        return $this->hasMany(Head::class);
    }
    public function bodies() {
        return $this->hasMany(Body::class);
    }

    public function deleteTable($table_id) {
        $bodies = Body::where('table_id', $table_id)->get();
        foreach ($bodies as $body) {
            $body->deleteBody();
        }
        $this->heads()->delete();

        try {
            return parent::delete();
        } catch (\Exception $e) {
        }
    }
}
