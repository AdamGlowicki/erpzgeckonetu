<?php

namespace App\Http\Controllers;

use App\PrevFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PrevFileController extends Controller
{
    public function __construct() {
        $this->middleware('permission:prevFile-list');
        $this->middleware('permission:prevFile-store', ['only' => ['store',]]);
        $this->middleware('permission:prevFile-get', ['only' => ['create', 'show', 'index']]);
        $this->middleware('permission:prevFile-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:prevFile-delete', ['only' => ['delete']]);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        $name = $request->file('prev')->getClientOriginalName();
        $path = $request->file('prev')->store('prevFile', 'local');

        $data = PrevFile::create(['data' => $path, 'name' => $name, 'body_id' => $request->get('body_id')]);
        return response()->json($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $file = PrevFile::findOrFail($id);
        $name = $file->name;
        return Storage::disk('local')->download($file->data, $name);
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
        $file = PrevFile::findOrFail($id);
        $file->delete();
        Storage::disk('local')->delete($file->data);
    }
}
