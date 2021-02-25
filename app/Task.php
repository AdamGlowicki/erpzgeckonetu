<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use function foo\func;

class Task extends Model
{
    protected $fillable = ['name', 'notes', 'mini_note', 'invest_id', 'status', 'position'];
    protected $table = 'tasks';

    public function invest() {
        return $this->belongsTo(Invest::class);
    }

    public function folders() {
        return $this->hasMany(Folder::class);
    }

    public function tables() {
        return $this->hasMany(Table::class);
    }

    public function removeTask($task_id) {

        Table::where('task_id', $task_id)->each(function($item) {
            $item->deleteTable($item->id);
        });

        Folder::where('task_id', $task_id)->each(function($item) {
            $item->deleteFolder();
        });
        try {
            return parent::delete();
        } catch (\Exception $e) {
        }
    }
}
