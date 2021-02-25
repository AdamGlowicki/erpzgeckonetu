<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ItemsManufacturer;
use Illuminate\Validation\Rule;
use Validator;

class ItemsManufacturerController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = ['id', 'name', 'item_count'];
    protected $joins = [];

    public function __construct() {
        $this->middleware('permission:itemsManufacturer-list');
        $this->middleware('permission:itemsManufacturer-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:itemsManufacturer-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:itemsManufacturer-delete', ['only' => ['delete']]);
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
                    $items = ItemsManufacturer::join($table, $table .'.id', '=', 'items.'. $this->joins[$column])->withCount('item')->orderBy($column)->paginate($this->pagination);
                } else {
                    $items = ItemsManufacturer::withCount('item')->orderBy($column)->paginate($this->pagination);
                }
                break;
            case 'desc':
                if(isset($table)) {
                    $items = ItemsManufacturer::join($table, $table .'.id', '=', 'items.'. $this->joins[$column])->withCount('item')->orderByDesc($column)->paginate($this->pagination);
                } else {
                    $items = ItemsManufacturer::withCount('item')->orderByDesc($column)->paginate($this->pagination);
                }
                break;
        }

        return response()->json($items, 200);
    }

    public function items(ItemsManufacturer $itemsManufacturer) {
        $items = $itemsManufacturer->item()->get();

        return response()->json($items, 200);
    }

    public function all() {
        $result = ItemsManufacturer::orderBy('name')->get();

        return response()->json($result, 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return ItemsManufacturer::withCount('item')->paginate(10);
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
            'name' => 'required|unique:items_manufacturers'
        ]);

        $itemsManufacturer = ItemsManufacturer::create($request->all());

        return response()->json($itemsManufacturer, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(ItemsManufacturer $itemsManufacturer)
    {
        return $itemsManufacturer;
    }

    public function edit($id)
    {
        $result = ItemsManufacturer::all()->find($id);

        return response()->json($result, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ItemsManufacturer $itemsManufacturer)
    {
        $itemsManufacturer->update($request->all());

        return response()->json($itemsManufacturer, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delete(ItemsManufacturer $itemsManufacturer)
    {
        $itemsManufacturer->delete();

        return response()->json(null, 204);
    }
}
