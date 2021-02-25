<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PasswordHistory extends Model
{
    protected $fillable = ['user_id', 'hash'];
    protected $table = 'password_history';

    public function user() {
        return $this->belongsTo('App\User');
    }
}
