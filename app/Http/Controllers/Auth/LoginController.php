<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/dashboard';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function login(Request $request)
    {
        $this->validateLogin($request);

        if($this->attemptLogin($request)) {
            $user = $this->guard()->user();

            if(!$user->active) {
                activity()
                    ->withProperties(['username' => $request->username])
                    ->log('Nieudane logowanie (użytkownik nieaktywny)');

                return $this->sendFailedLoginResponse($request);
            }

            activity()
                ->withProperties(['username' => $request->username])
                ->log('Udane logowanie');

            $token = $user->generateToken();

            $result = $user->toArray();
            $result['api_token'] = $token;

            return response()->json([
                'data' => $result,
            ]);
        }

        activity()
            ->withProperties(['username' => $request->username])
            ->log('Nieudane logowanie');

        return $this->sendFailedLoginResponse($request);
    }

    public function loginApp(Request $request)
    {
        $this->validateLogin($request);

        if($this->attemptLogin($request)) {
            $user = $this->guard()->user();

            if(!$user->active && $request->fcm_token) {
                activity()
                    ->withProperties(['username' => $request->username])
                    ->log('Nieudane logowanie (użytkownik nieaktywny)');

                return $this->sendFailedLoginResponse($request);
            }

            $fcmToken = $user->setFcmToken($request->fcm_token);
            $token = $user->generateTokenApp();

            $result = $user->toArray();
            $result['app_token'] = $token;
            $result['fcm_token'] = $fcmToken;

            return response()->json([
                'data' => $result,
            ]);
        }

        return $this->sendFailedLoginResponse($request);
    }

    public function logout()
    {
        $user = auth()->guard('api')->user();

        if($user) {
            activity()
                ->withProperties(['username' => $user->username])
                ->log('Poprawne wylogowanie');

            $user->api_token = null;
            $user->save();
        }

        return response()->json(['data' => 'Logged out'], 200);
    }

    public function username() {
        return 'username';
    }
}
