<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use Notifiable;
    use HasRoles;

    protected $guard_name = 'api';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'username', 'phone', 'address', 'postcode', 'city', 'country_id', 'desc', 'password_changed_at',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'api_token', 'app_token', 'fcm_token'
    ];

    /**
     * Show only active users
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeHideDisabled($query) {
        return $query->where('active', true);
    }

    public function getSettingsAttribute($value) {
        return json_decode($value) ?: null;
    }

    /**
     * Route notifications for the FCM channel.
     *
     * @param  Notification  $notification
     * @return string
     */
    public function routeNotificationForFcm($notification)
    {
        return $this->fcm_token;
    }

    public function generateToken() {
        $this->api_token = Str::random(192);
        $this->save();

        return $this->api_token;
    }

    public function generateTokenApp() {
        $this->app_token = Str::random(192);
        $this->save();

        return $this->app_token;
    }

    public function setFcmToken($token) {
        $this->fcm_token = $token;
        $this->save();

        return $this->fcm_token;
    }

    public function api() {
        return app('App\ApiToken')->user();
    }

    public function country() {
        return $this->belongsTo('App\Country');
    }

    public function bhpUsersStocksItem() {
        return $this->hasMany('App\BhpUsersStocksItem');
    }

    public function event() {
        return $this->hasMany('App\Event');
    }

    public function passwordHistory() {
        return $this->hasMany('App\PasswordHistory');
    }
}
