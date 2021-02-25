<?php

namespace App\Http\Controllers;

use App\SecondPostFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SecondPostFileController extends Controller
{

    public function __construct() {
        $this->middleware('permission:secondPostFile-list');
        $this->middleware('permission:secondPostFile-store', ['only' => ['store',]]);
        $this->middleware('permission:secondPostFile-get', ['only' => ['index', 'create', 'show']]);
        $this->middleware('permission:secondPostFile-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:secondPostFile-delete', ['only' => ['delete']]);
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
        $name = $request->file('post_second')->getClientOriginalName();
        $path = $request->file('post_second')->store('secondPostFile', 'local');
        $data = SecondPostFile::create(['data' => $path, 'name' => $name, 'body_id' => $request->get('body_id')]);
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
        $file = SecondPostFile::findOrFail($id);
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
        $file = SecondPostFile::findOrFail($id);
        $file->delete();
        Storage::disk('local')->delete($file->data);
    }
}
