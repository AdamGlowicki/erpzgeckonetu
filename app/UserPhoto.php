<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserPhoto extends Model
{
    protected $fillable = ['name', 'path', 'type', 'user_id'];
    protected $table = 'users_photos';

    public function automobile() {
        return $this->belongsTo(User::class);
    }
}
