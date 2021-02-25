<?php

namespace App\Http\Controllers;

use App\InvestFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class  InvestFileController extends Controller
{

    public function __construct()
    {
        $this->middleware('permission:investFile-list');
        $this->middleware('permission:investFile-store', ['only' => ['store',]]);
        $this->middleware('permission:investFile-get', ['only' => ['create', 'show', 'index']]);
        $this->middleware('permission:investFile-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:investFile-delete', ['only' => ['delete']]);
    }

    protected function valodator($data)
    {
        return Validator::make($data, [
            'name' => 'required',
        ]);
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
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $fileName = $request->file('invest')->getClientOriginalName();
        $path = $request->file('invest')->store('investFiles', 'local');

        $data = InvestFile::create([ 'data' => $path, 'invest_id' => $request->get('invest_id'), 'name' => $fileName]);
        return response()->json($data);
    }


    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $file = InvestFile::findOrFail($id);
        $name = $file->name;
        return Storage::disk('local')->download($file->data, $name);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $file = InvestFile::findOrFail($id);
        $file->delete();

        Storage::disk('local')->delete($file->data);
    }
}
