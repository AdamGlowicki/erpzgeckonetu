<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\CarsUser;

class CarsUserController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $carsUser = CarsUser::create($request->all());
        
        return response()->json($carsUser, 201);
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delete(CarsUser $carsUser)
    {
        $carsUser->delete();
        
        return response()->json(null, 204);
    }
}
