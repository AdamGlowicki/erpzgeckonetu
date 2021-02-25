<?php

namespace App\Observers;

use App\Location;
use App\User;

class LocationObserver
{
    /**
     * Handle the event "created" event.
     *
     * @param  \App\Location  $location
     * @return void
     */
    public function created(Location $location)
    {
        User::all()->each(function($user) {
            try {
                $user->notify(new \App\Notifications\RefreshLocationNotification());
            } catch(\Illuminate\Broadcasting\BroadcastException $e) {
                report($e);
            }
        });
    }

    /**
     * Handle the event "updated" event.
     *
     * @param  \App\Location  $location
     * @return void
     */
    public function updated(Location $location)
    {
        //
    }

    /**
     * Handle the event "deleted" event.
     *
     * @param  \App\Location  $location
     * @return void
     */
    public function deleted(Location $location)
    {
        //
    }

    /**
     * Handle the event "restored" event.
     *
     * @param  \App\Location  $location
     * @return void
     */
    public function restored(Location $location)
    {
        //
    }

    /**
     * Handle the event "force deleted" event.
     *
     * @param  \App\Location  $location
     * @return void
     */
    public function forceDeleted(Location $location)
    {
        //
    }
}
