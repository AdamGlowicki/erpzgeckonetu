<?php

namespace App\Http\Controllers;

use App\AgreementFolder;
use FontLib\Table\Type\name;
use Illuminate\Http\Request;

class AgreementFolderController extends Controller
{

    public function __construct() {
        $this->middleware('permission:agreementFile-list');
        $this->middleware('permission:agreementFile-store', ['only' => ['store',]]);
        $this->middleware('permission:agreementFile-get', ['only' => ['create', 'show', 'index']]);
        $this->middleware('permission:agreementFile-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:agreementFile-delete', ['only' => ['delete']]);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $result = AgreementFolder::with([
            'agreementFiles',
        ])->get();

        return response()->json($result, 200);
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
        $name = $request->name;
        $disable = $request->disable;
        $folder = AgreementFolder::create(['name'=> $name,]);
        return response()->json($folder, 200);
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
        $name = $request->name;
        $folder = AgreementFolder::findOrFail($id);
        $folder->update(['name' => $name]);

        return response()->json($folder, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        AgreementFolder::findOrFail($id)->deleteAgreementFolder();
    }
}
