<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Unit;
use Illuminate\Validation\Rule;
use Validator;

class UnitController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = ['id', 'name', 'short_name'];
    protected $joins = [];

    public function __construct() {
        $this->middleware('permission:unit-list');
        $this->middleware('permission:unit-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:unit-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:unit-delete', ['only' => ['delete']]);
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
                    $items = Unit::join($table, $table .'.id', '=', 'items.'. $this->joins[$column])->withCount('item')->orderBy($column)->paginate($this->pagination);
                } else {
                    $items = Unit::withCount('item')->orderBy($column)->paginate($this->pagination);
                }
                break;
            case 'desc':
                if(isset($table)) {
                    $items = Unit::join($table, $table .'.id', '=', 'items.'. $this->joins[$column])->withCount('item')->orderByDesc($column)->paginate($this->pagination);
                } else {
                    $items = Unit::withCount('item')->orderByDesc($column)->paginate($this->pagination);
                }
                break;
        }

        return response()->json($items, 200);
    }

    public function all() {
        $units = Unit::all();

        return response()->json($units, 200);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $units = Unit::paginate(25);

        return response()->json($units, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'short_name' => 'required',
            'type' => 'required',
        ]);

        $unit = Unit::create($request->all());

        return response()->json($unit, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Unit
     */
    public function show(Unit $unit)
    {
        return $unit;
    }

    public function edit($id)
    {
        $result = Unit::all()->find($id);

        return response()->json($result, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Unit $unit)
    {
        $unit->update($request->all());

        return response()->json($unit, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(Unit $unit)
    {
        $unit->delete();

        return response()->json(null, 204);
    }
}
