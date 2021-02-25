<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EventsNote extends Model
{
    protected $fillable = ['event_id', 'file_id', 'user_id', 'note'];

    public function event() {
        return $this->belongsTo('App\Event');
    }

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function file() {
        return $this->belongsTo('App\File');
    }
}
