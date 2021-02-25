<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Location;

class LocationController extends Controller
{
    private $relations = [
        'user',
    ];

    public function __construct() {
        $this->middleware('permission:event-list-all', ['only' => ['index']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $result = Location::with(['user', 'user.event' => function($query) {
                $query->where('status', 1)->first();
            }])
            ->latest()
            ->nPerGroup('user_id', 1)
            ->get();

        return response()->json([
            'data' => $result
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'long' => 'required|numeric',
            'lat' => 'required|numeric',
        ]);

        $result = Location::create([
            'user_id' => auth()->user()->id,
            'long' => $request->long,
            'lat' => $request->lat,
        ]);

        if($result) {
            $result = $result->load($this->relations);
        }

        return response()->json([
            'data' => $result,
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($user)
    {
        $result = Location::where('user_id', $user)
            ->orderBy('created_at', 'DESC')
            ->first();

        if(!$result) {
            return response()->json([], 422);
        }

        $osm = app('App\Osm')
            ->reverse($result->lat, $result->long);

        return response()->json([
            'data' => $osm
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function path($user, $from, $to)
    {
        $result = Location::with(['user'])
            ->where('user_id', $user)
            ->where('created_at', '>=', $from . ' 00:00:00')
            ->where('created_at', '<=', $to . ' 00:00:00')
            ->orderBy('created_at')
            ->get();

        if(!$result) {
            return response()->json([], 422);
        }

        return response()->json([
            'data' => $result
        ], 200);
    }

    /**
     * Display the specified self-resource.
     *
     * @param  int  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function self()
    {
        $result = Location::where('user_id', auth()->user()->id)
            ->orderBy('created_at', 'DESC')
            ->first();

        return response()->json([
            'data' => $result
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
