<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Redirect;

class CheckIfPasswordExpired
{
    private $days = 30;

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = app('App\ApiToken')->user();

        if(!$user->password_changed_at) {
            return Redirect::to('/password');
        }

        $date = Carbon::parse(
            $user->password_changed_at
        );

        if($date->diffInDays(Carbon::now()) >= 30) {
            return Redirect::to('/password');
        }

        return $next($request);
    }
}
