<?php

namespace App\Http\Controllers;

use App\SecondFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SecondFileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct() {
        $this->middleware('permission:secondFile-list');
        $this->middleware('permission:secondFile-store', ['only' => ['store',]]);
        $this->middleware('permission:secondFile-get', ['only' => ['index', 'create', 'show']]);
        $this->middleware('permission:secondFile-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:secondFile-delete', ['only' => ['delete']]);
    }
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
        $name = $request->file('second')->getClientOriginalName();
        $path = $request->file('second')->store('secondFile', 'local');

        $data = SecondFile::create(['data' => $path, 'name' => $name, 'body_id' => $request->get('body_id')]);
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
        $file = SecondFile::findOrFail($id);
        return Storage::disk('local')->download($file->data, $file->name);
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
        $file = SecondFile::findOrFail($id);
        $file->delete();
        Storage::disk('local')->delete($file->data);
    }
}
