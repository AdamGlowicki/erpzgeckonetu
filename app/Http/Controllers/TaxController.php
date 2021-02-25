<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Tax;
use Illuminate\Validation\Rule;
use Validator;

class TaxController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = ['id', 'name', 'multipler'];
    protected $joins = [];
    
    public function __construct() {
        /* $this->middleware('permission:tax-list');
        $this->middleware('permission:tax-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:tax-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:tax-delete', ['only' => ['delete']]); */
    }
    
    public function search($str) {
        return response()->json(['data' => Tax::where('name', 'LIKE', "%{$str}%")->get()], 200);
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
                    $items = Tax::join($table, $table .'.id', '=', 'taxes.'. $this->joins[$column])->orderBy($column)->paginate($this->pagination);
                } else {
                    $items = Tax::orderBy($column)->paginate($this->pagination);
                }
                break;
            case 'desc':
                if(isset($table)) {
                    $items = Tax::join($table, $table .'.id', '=', 'taxes.'. $this->joins[$column])->orderByDesc($column)->paginate($this->pagination);
                } else {
                    $items = Tax::orderByDesc($column)->paginate($this->pagination);
                }
                break;
        }

        return response()->json($items, 200);
    }
    
    public function all() {
        $taxes = Tax::all();
        
        return response()->json($taxes, 200);
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $taxes = Tax::paginate($this->pagination);
        
        return response()->json($taxes, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $tax = Tax::create($request->all());
        
        return response()->json($tax, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Tax $tax)
    {
        return $tax;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Tax $tax)
    {
        $tax->update($request->all());
        
        return response()->json($tax, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delete(Tax $tax)
    {
        $tax->delete();
        
        return response()->json(null, 204);
    }
}
