<?php

namespace App\Http\Controllers;

use App\File;
use App\Folder;
use App\Invest;
use Illuminate\Http\Request;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct() {
        $this->middleware('permission:folder-list');
        $this->middleware('permission:folder-store', ['only' => ['store',]]);
        $this->middleware('permission:folder-get', ['only' => ['index', 'create', 'show']]);
        $this->middleware('permission:folder-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:folder-delete', ['only' => ['delete']]);
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
        $validateData = $request->validate([
            'folder_name' => 'nullable',
            'task_id' => 'nullable',
        ]);
        $post = Folder::create($validateData);

        return response()->json($post);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
        $validateFolder = $request->validate([
            'folder_name' => 'required'
        ]);
        $folder = Folder::findOrFail($id);

        $folder->update($validateFolder);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $folder = Folder::findOrFail($id);
        $folder->folderFiles()->delete();
        $folder->delete();
    }
}
