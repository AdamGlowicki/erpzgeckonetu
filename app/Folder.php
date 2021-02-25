<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    protected $fillable = ['folder_name', 'task_id'];
    protected $table = 'folders';

    public function task() {
        return $this->belongsTo(Task::class);
    }
    public function folderFiles() {
        return $this->hasMany(FolderFile::class);
    }

    public function deleteFolder() {
        $this->folderFiles()->delete();
        try {
            return parent::delete();
        } catch (\Exception $e) {
        }
    }
}
