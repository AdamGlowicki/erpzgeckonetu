<?php

namespace App\Http\Controllers;

use App\CarPhoto;
use App\UserPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CarPhotoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

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
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $name = $request->file('carPhoto')->getClientOriginalName();
        $path = $request->file('carPhoto')->store('carPhoto', 'local');

        $photo = CarPhoto::create(['path' => $path, 'automobile_id' => $request->get('automobile_id'), 'name' => $name, 'type' => $request->get('type')]);
        return response()->json($photo, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id, $type)
    {
        $photo = CarPhoto::where('automobile_id', $id)
            ->where('type', $type)
            ->first();
        return Storage::disk('local')->download($photo->path, $photo->name);
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
    public function destroy($id, $type)
    {
        $photo = CarPhoto::where('automobile_id', $id)
            ->where('type', $type)
            ->first();
        $photo->delete();
        Storage::disk('local')->delete($photo->path);
    }
}
