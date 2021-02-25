<?php

namespace App\Http\Controllers;

use App\UserPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserPhotoController extends Controller
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
    public function create($id)
    {
        $photos = UserPhoto::where('user_id', $id)->get();
        return response()->json($photos, 200);

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $name = $request->file('userPhoto')->getClientOriginalName();
        $path = $request->file('userPhoto')->store('userPhoto', 'local');

        $photo = UserPhoto::create(['path' => $path, 'user_id' => $request->get('user_id'), 'name' => $name, 'type' => $request->get('type')]);
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
        $photo = UserPhoto::where('user_id', $id)
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
        $photo = UserPhoto::where('user_id', $id)
            ->where('type', $type)
            ->first();
        $photo->delete();
        Storage::disk('local')->delete($photo->path);
    }
}
