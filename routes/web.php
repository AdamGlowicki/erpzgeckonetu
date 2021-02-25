<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use Illuminate\Support\Facades\View;

Route::get('/', function() {
    return Redirect::to('/dashboard');
})->middleware('tokenverify');

Route::get('login', function() {
    return View::make('auth.login');
});

Route::get('mailing/{id}/{token}/{type}', 'UserController@mailOpened');
Route::get('mailing2/{id}/{token}/{type}', 'UserController@mailOpened2');

Route::get('lostpassword', function() {
    return View::make('auth.lostpassword');
});

Route::group(['middleware' => 'auth'], function() {
    //
});

Route::group(['middleware' => ['tokenverify', 'passwordexpired']], function() {
    Route::get('dashboard', function() {
        return View::make('dashboard');
    });

    Route::get('warehouse', function() {
        return View::make('warehouse');
    });

    Route::get('contractors', function() {
        return View::make('contractors');
    });

    Route::get('cars', function() {
        return View::make('cars');
    });

    Route::get('profile', function() {
        return View::make('profile');
    });

    Route::get('availability', function() {
        return View::make('availability');
    });

    Route::get('ripe', function() {
        return View::make('ripe');
    });

    Route::get('ekw', function() {
        return View::make('ekw');
    });

    Route::get('rma', function() {
        return View::make('rma');
    });

    Route::get('bhp', function() {
        return View::make('bhp');
    });

    Route::get('calendar', function() {
        return View::make('calendar');
    });

    Route::get('reports', function() {
        return View::make('reports');
    });

    Route::get('bok', function() {
        return View::make('bok');
    });

    Route::get('map', function() {
        return View::make('map');
    });

    Route::get( 'react/{any}', function(){
        return view( 'react.react' );
    } )->where('any', '.*');

    Route::get('wiki', function() {
        return View::make('wiki');
    });

    Route::get('absence', function() {
        return View::make('absence');
    });

    Route::get('manage', function() {
        return View::make('manage');
    });

    Route::get('wfm', function() {
        return View::make('wfm');
    });

    Route::get('nodes', function() {
        return View::make('nodes');
    });

    Route::get('file/{id}', [App\Http\Controllers\FileController::class, 'show']);

    Route::get('doc', function() {
        return View::make('doc');
    });
});

Route::group(['middleware' => ['tokenverify']], function() {
    Route::get('password', function() {
        return View::make('auth.password');
    });
});

Route::get('privacy', function() {
    return View::make('layouts.privacy');
});
