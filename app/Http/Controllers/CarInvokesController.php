<?php

namespace App\Http\Controllers;

use App\CarInvokes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CarInvokesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response(CarInvokes::all(), 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create($id)
    {
        return response(CarInvokes::where('automobile_id', $id)->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
           'invoke' => 'mimes:pdf'
        ]);

        $name = $request->file('invoke')->getClientOriginalName();
        $path = $request->file('invoke')->store('carInvokes', 'local');
        CarInvokes::create(['path' => $path, 'name' => $name, 'automobile_id' => $request->get('automobile_id')]);

        return response(CarInvokes::where('automobile_id', $request->get('automobile_id'))->get());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $file = CarInvokes::findOrFail($id);
        return Storage::disk('local')->download($file->path, $file->name);
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
        $file = CarInvokes::findOrFail($id);
        $file -> delete();
        Storage::disk('local')->delete($file->path);

        return response(CarInvokes::where('automobile_id', $file->automobile_id)->get());
    }
}
