<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Validator;
use App\RmasReason;

class RmasReasonController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id', 
        'name',
        'created_at',
    ];
    
    protected $joins = [
    ];
    
    protected $with = [
    ];
    
    public function __construct() {
        $this->middleware('permission:rmas_reason-list');
        $this->middleware('permission:rmas_reason-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:rmas_reason-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:rmas_reason-delete', ['only' => ['delete']]);
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
            $table = explode('.', preg_replace('/{.*/', '', $column))[0];
        }
        
        switch($direction) {
            case 'asc':
                if(isset($table)) {
                    $result = RmasReason::with($this->with)
                                ->select('rmas_reasons.*')
                                ->leftJoin($table, "{$table}.id", "=", "rmas_reasons.{$this->joins[$column]}")
                                ->orderByRaw(preg_replace('/{.*/', '', $column) ." ASC")
                                ->paginate($this->pagination);
                } else {
                    $result = RmasReason::with($this->with)
                                ->orderByRaw(isset($this->extra[$column]) ? $this->extra[$column] : $column .' ASC')
                                ->paginate($this->pagination);
                }
                
                break;
            case 'desc':
                if(isset($table)) {
                    $result = RmasReason::with($this->with)
                                ->select('rmas_reasons.*')
                                ->leftJoin($table, "{$table}.id", "=", "rmas_reasons.{$this->joins[$column]}")
                                ->orderByRaw(preg_replace('/{.*/', '', $column) ." DESC")
                                ->paginate($this->pagination);
                } else {
                    $result = RmasReason::with($this->with)
                                ->orderByRaw(isset($this->extra[$column]) ? $this->extra[$column] : $column .' DESC')
                                ->paginate($this->pagination);
                }
                
                break;
        }

        return response()->json($result, 200);
    }
    
    public function all() {
        $result = RmasReason::all();
        
        return response()->json($result, 200);
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $result = RmasReason::paginate($this->pagination);
        
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
        $request->validate([
            'name' => 'string|required',
        ]);
        
        $result = RmasReason::create([
            'name' => $request->name,
        ]);
        
        return response()->json($result, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(RmasReason $result)
    {
        return response()->json($result, 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $result = RmasReason::find($id);
        
        return response()->json($result, 200);
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
        $result = RmasReason::find($id);
        
        $result->name = $request->name;
        $result->save();
        
        return response()->json($result, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        RmasReason::destroy($id);
        
        return response()->json(null, 204);
    }
}
