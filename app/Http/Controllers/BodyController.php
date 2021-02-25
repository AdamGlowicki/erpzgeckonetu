<?php

namespace App\Http\Controllers;

use App\Body;
use Illuminate\Http\Request;

class BodyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct() {
        $this->middleware('permission:body-list');
        $this->middleware('permission:body-store', ['only' => ['store',]]);
        $this->middleware('permission:body-get', ['only' => ['create', 'show', 'index']]);
        $this->middleware('permission:body-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:body-delete', ['only' => ['delete']]);
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

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $body = $request->all();

        $post = Body::create($body);
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
        $requestBody = $request->all();
        $body = Body::findOrFail($id);
        $body->update($requestBody);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $body = Body::findOrFail($id);
        $body->prevFiles()->delete();
        $body->postFiles()->delete();
        $body->secondFiles()->delete();
        $body->delete();
    }
}
