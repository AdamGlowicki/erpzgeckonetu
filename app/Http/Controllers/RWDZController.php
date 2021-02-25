<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Validator;
use App\RWDZ;

class RWDZController extends Controller
{
    protected $pagination = 25;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id', 
        'data_wplywu_wniosku', 
        'data_wydania_decyzji',
        'miasto',
        'ulica',
        'nazwa_zam_budowlanego',
        'nazwa_zamierzenia_bud',
    ];
    
    protected $joins = [];
    protected $with = [];
    
    public function __construct() {
        $this->middleware('permission:rwdz-list');
        $this->middleware('permission:rwdz-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:rwdz-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:rwdz-delete', ['only' => ['delete']]);
    }
    
    public function sort(Request $request, $direction, $column) {
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
        
        if(isset($table)) {
            if($request->q) {
                $result = RWDZ::with($this->with)
                            ->select('rwdz.*')
                            ->leftJoin($table, "{$table}.id", "=", "rwdz.{$this->joins[$column]}")
                            ->where('nazwa_zam_budowlanego', 'LIKE', "%{$request->q}%")
                            ->orWhere('')
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            } else {
                $result = RWDZ::with($this->with)
                            ->select('rwdz.*')
                            ->leftJoin($table, "{$table}.id", "=", "rwdz.{$this->joins[$column]}")
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            }
        } else {
            if($request->q) {
                $result = RWDZ::with($this->with)
                            ->where('nazwa_zam_budowlanego', 'LIKE', "%{$request->q}%")
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            } else {
                $result = RWDZ::with($this->with)
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            }
        }

        return response()->json($result, 200);
    }  
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if($request->q) {
            $result = RWDZ::with($this->with)
                        ->where('nazwa_zam_budowlanego', 'LIKE', "%{$request->q}%")
                        ->paginate($this->pagination);
        } else {
            $result = RWDZ::with($this->with)
                        ->paginate($this->pagination);
        }
        
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
