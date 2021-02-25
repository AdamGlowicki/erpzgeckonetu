<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BhpOut extends Model
{
    protected $fillable = ['document_id', 'user_id', 'user_out_id', 'document_name', 'notes'];

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function userOut() {
        return $this->belongsTo('App\User', 'user_out_id');
    }

    public function bhpOutsItem() {
        return $this->hasMany('App\BhpOutsItem');
    }
}
