<?php

namespace App\Http\Controllers;

use App\FolderFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FolderFileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function __construct() {
        $this->middleware('permission:folderFile-list');
        $this->middleware('permission:folderFile-store', ['only' => ['store',]]);
        $this->middleware('permission:folderFile-get', ['only' => ['create', 'show', 'index']]);
        $this->middleware('permission:folderFile-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:folderFile-delete', ['only' => ['delete']]);
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
    public function create($path)
    {
        Storage::download($path);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $name = $request->file('folder')->getClientOriginalName();
        $path = $request->file('folder')->store('folderFiles', 'local');


        $file = FolderFile::create(['data' => $path, 'folder_id' => $request->get('folder_id'), 'name' => $name ]);

        return response()->json($file);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $file = FolderFile::findOrFail($id);
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
        $file = FolderFile::findOrfail($id);
        $file->delete();
        Storage::disk('local')->delete($file->data);
    }
}
