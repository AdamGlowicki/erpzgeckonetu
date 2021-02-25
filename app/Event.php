<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;

class Event extends Model
{
    use LogsActivity;
    use SoftDeletes;

    protected $fillable = ['user_created_id', 'user_id', 'client_id', 'investment_id', 'start', 'end', 'comment', 'status', 'status_end', 'priority', 'title', 'description', 'phone', 'address', 'type', 'all_day'];

    protected static $recordEvents = ['created', 'updated', 'deleted'];

    protected static $logAttributes = ['status', 'start', 'end', 'title', 'priority', 'user.name', 'user.id', 'status_end', 'description', 'status_end', 'type'];

    public function getDescriptionForEvent(string $action): string {
        switch($action) {
            case 'created':
                return 'Utworzono zadanie';
            case 'updated':
                return 'Zaktualizowano zadanie';
            case 'deleted':
                return 'Usunięto zadanie';
            default:
                return false;
        }
    }

    public function history() {
        return $this->activities();
    }

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function userCreated() {
        return $this->belongsTo('App\User', 'user_created_id');
    }

    public function client() {
        return $this->belongsTo('App\Client');
    }

    public function investment() {
        return $this->belongsTo('App\Investment');
    }

    public function eventsReminder() {
        return $this->hasMany('App\EventsReminder');
    }

    public function eventsNote() {
        return $this->hasMany('App\EventsNote');
    }

    public function file() {
        return $this->morphMany('App\File', 'file');
    }

    public static function notifyRefresh() {
        User::all()->except(auth()->user()->id)->each(function($user) {
            try {
                $user->notify(new \App\Notifications\RefreshEventsNotification());
            } catch(\Illuminate\Broadcasting\BroadcastException $e) {
                report($e);
            }
        });
    }

    public static function boot() {
        parent::boot();

        static::deleting(function($event) {
            $event->eventsReminder()->delete();
        });
    }
}
