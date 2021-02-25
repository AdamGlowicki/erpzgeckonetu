<?php

namespace App\Http\Controllers;

use App\Ekw;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EkwController extends Controller
{    
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id', 
        'sad', 
        'numer', 
        'ck',
    ];
    
    protected $joins = [
    ];
    
    protected $with = [
    ];
    
    public function __construct() {
        $this->middleware('permission:ekw-list');
        $this->middleware('permission:ekw-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:ekw-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:ekw-delete', ['only' => ['delete']]);
    }
    
    public function search($str) {
        $items = Ekw::existing()
                    ->select('id', 'sad', 'numer', 'ck', 'exists')
                    ->where('id', '=', "{$str}")
                    ->orWhere('sad', 'LIKE', "%{$str}%")
                    ->orWhere('numer', 'LIKE', "%{$str}%")
                    ->get();
        
        return response()->json(['data' => $items], 200);
    }
    
    public function all() {
        $items = Item::all()
                    ->select('id', 'sad', 'numer', 'ck', 'exists')
                    ->existing()
                    ->get();
        
        return response()->json($items, 200);
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
                $items = Ekw::with($this->with)
                            ->select('ekw.id', 'ekw.sad', 'ekw.numer', 'ekw.ck', 'ekw.exists')
                            ->leftJoin($table, "{$table}.id", "=", "ekw.{$this->joins[$column]}")
                            ->existing()
                            ->where('id', '=', "{$request->q}")
                            ->orWhere('sad', 'LIKE', "%{$request->q}%")
                            ->orWhere('numer', 'LIKE', "%{$request->q}%")
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            } else {
                $items = Ekw::with($this->with)
                            ->select('ekw.id', 'ekw.sad', 'ekw.numer', 'ekw.ck', 'ekw.exists')
                            ->leftJoin($table, "{$table}.id", "=", "ekw.{$this->joins[$column]}")
                            ->existing()
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            }
        } else {
            if($request->q) {
                $items = Ekw::with($this->with)
                            ->select('id', 'sad', 'numer', 'ck', 'exists')
                            ->existing()
                            ->where('id', '=', "{$request->q}")
                            ->orWhere('sad', 'LIKE', "%{$request->q}%")
                            ->orWhere('numer', 'LIKE', "%{$request->q}%")
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            } else {
                $items = Ekw::with($this->with)
                            ->select('id', 'sad', 'numer', 'ck', 'exists')
                            ->existing()
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            }
        }

        return response()->json($items, 200);
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if($request->q) {
            $items = Ekw::with($this->with)
                        ->select('id', 'sad', 'numer', 'ck', 'exists')
                        ->existing()
                        ->where('id', '=', "{$request->q}")
                        ->orWhere('sad', 'LIKE', "%{$request->q}%")
                        ->orWhere('numer', 'LIKE', "%{$request->q}%")
                        ->paginate($this->pagination);
        } else {
            $items = Ekw::with($this->with)
                        ->existing()
                        ->select('id', 'sad', 'numer', 'ck', 'exists')
                        ->paginate($this->pagination);
        }
        
        return response()->json($items, 200);
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
        $result = Ekw::find($id);
        
        $name = $result->sad . $result->numer . $result->ck;
        
        $result->adres = app('App\Ekw')->loadData('adres', $name);
        $result->hipo = app('App\Ekw')->loadData('hipo', $name);
        $result->okladka = app('App\Ekw')->loadData('okladka', $name);
        $result->prawa = app('App\Ekw')->loadData('prawa', $name);
        $result->roszcz = app('App\Ekw')->loadData('roszcz', $name);
        $result->wlasc = app('App\Ekw')->loadData('wlasc', $name);
        
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
