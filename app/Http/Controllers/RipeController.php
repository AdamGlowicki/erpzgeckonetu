<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Ripe;
use Illuminate\Validation\Rule;
use Validator;

class RipeController extends Controller
{
    protected $pagination = 50;
    protected $directions = ['asc', 'desc'];
    protected $columns = ['id', 'org_name', 'address', 'email', 'notify'];
    protected $joins = [];
    
    public function __construct() {
        /*
         
        $this->middleware('permission:ripe-list');
        $this->middleware('permission:ripe-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:ripe-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:ripe-delete', ['only' => ['delete']]);
    
         */ 
    }
    
    public function search($str) {
        return response()->json(['data' => Ripe::where('address', 'LIKE', "%{$str}%")->get()], 200);
    }
    
    public function sort($direction, $column) {
        $validation = Validator::make(['column' => $column, 'direction' => $direction], [
            'column' => ['required', Rule::in($this->columns)],
            'direction' => ['required', Rule::in($this->directions)]
        ]);
        
        if($validation->fails()) {
            return response()->json(null, 400);
        }
        
        if(count(explode('.', $column)) > 1) {
            $table = explode('.', $column)[0];
        }
        
        switch($direction) {
            case 'asc':
                if(isset($table)) {
                    $items = Ripe::join($table, $table .'.id', '=', 'taxes.'. $this->joins[$column])->orderBy($column)->paginate($this->pagination);
                } else {
                    $items = Ripe::orderBy($column)->paginate($this->pagination);
                }
                break;
            case 'desc':
                if(isset($table)) {
                    $items = Ripe::join($table, $table .'.id', '=', 'taxes.'. $this->joins[$column])->orderByDesc($column)->paginate($this->pagination);
                } else {
                    $items = Ripe::orderByDesc($column)->paginate($this->pagination);
                }
                break;
        }

        return response()->json($items, 200);
    }
    
    public function all() {
        $result = Ripe::all();
        
        return response()->json($result, 200);
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $result = Ripe::paginate($this->pagination);
        
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
        //
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
        //
    }
}
