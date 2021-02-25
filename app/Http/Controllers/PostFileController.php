<?php

namespace App\Http\Controllers;

use App\PostFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostFileController extends Controller
{
    public function __construct() {
        $this->middleware('permission:postFile-list');
        $this->middleware('permission:postFile-store', ['only' => ['store',]]);
        $this->middleware('permission:postFile-get', ['only' => ['create', 'show', 'index']]);
        $this->middleware('permission:postFile-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:postFile-delete', ['only' => ['delete']]);
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
        $name = $request->file('post')->getClientOriginalName();
        $path = $request->file('post')->store('postFile', 'local');

        $data = PostFile::create(['data' => $path, 'name' => $name, 'body_id' => $request->get('body_id')]);
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
        $file = PostFile::findOrFail($id);
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
        $file = PostFile::findOrFail($id);
        $file->delete();
        Storage::disk('local')->delete($file->data);
    }
}
