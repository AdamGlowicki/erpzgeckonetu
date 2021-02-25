<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FolderFile extends Model
{
    protected $fillable = ['name', 'data', 'folder_id'];
    protected $table = 'folder_files';

    public function folder() {
        return $this->belongsTo(Folder::class);
    }
}
