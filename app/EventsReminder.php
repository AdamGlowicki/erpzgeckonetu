<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EventsReminder extends Model
{
    protected $fillable = ['event_id', 'time'];

    public function event() {
        return $this->belongsTo('App\Event');
    }
}
