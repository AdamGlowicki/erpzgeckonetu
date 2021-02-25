<?php

namespace App\Http\Controllers;

use App\AgreementFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AgreementFileController extends Controller
{

    public function __construct() {
        $this->middleware('permission:agreementFolder-list');
        $this->middleware('permission:agreementFolder-store', ['only' => ['store',]]);
        $this->middleware('permission:agreementFolder-get', ['only' => ['create', 'show', 'index']]);
        $this->middleware('permission:agreementFolder-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:agreementFolder-delete', ['only' => ['delete']]);
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
        $name = $request->file('agreements')->getClientOriginalName();
        $path = $request->file('agreements')->store('agreements', 'local');
        $data = AgreementFile::create(['data' => $path, 'name' => $name, 'agreement_folder_id' => $request->get('folder_id')]);

        return response()->json($data, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $file = AgreementFile::findOrFail($id);
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
        $file = AgreementFile::findOrFail($id);
        $file -> delete();
        Storage::disk('local')->delete($file->data);
    }
}
