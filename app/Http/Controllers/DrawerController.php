<?php

namespace App\Http\Controllers;

use App\Body;
use App\Drawer;
use App\Invest;
use Illuminate\Http\Request;

class DrawerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct() {
        $this->middleware('permission:drawer-list');
        $this->middleware('permission:drawer-store', ['only' => ['store',]]);
        $this->middleware('permission:drawer-get', ['only' => ['create', 'show', 'index']]);
        $this->middleware('permission:drawer-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:drawer-delete', ['only' => ['delete']]);
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
        return response()->json(Drawer::with(['invests'])->get(), 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $drawer = $request->all();

        $post = Drawer::create($drawer);
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
        $requestDrawer = $request->all();
        $drawer = Drawer::findOrFail($id);

        $drawer->update($requestDrawer);

        return response()->json($drawer, 200);
    }

    public function assignInvestment(Request $request) {
        $drawer = Drawer::findOrFail($request->drawer_id);
        $drawer->invests()->attach($request->invest_id);

        return response()->json($drawer, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $drawer = Drawer::findOrFail($id);
        $drawer->delete();
    }
}
