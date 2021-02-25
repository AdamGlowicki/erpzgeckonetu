<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ItemsCategory;
use Illuminate\Validation\Rule;
use Validator;

class ItemsCategoryController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = ['id', 'name', 'item_count'];
    protected $joins = [];

    public function __construct() {
        $this->middleware('permission:itemsCategory-list');
        $this->middleware('permission:itemsCategory-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:itemsCategory-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:itemsCategory-delete', ['only' => ['delete']]);
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
                    $items = ItemsCategory::join($table, $table .'.id', '=', 'items.'. $this->joins[$column])
                                ->withCount('item')
                                ->orderBy($column)
                                ->paginate($this->pagination);
                } else {
                    $items = ItemsCategory::withCount('item')
                                ->orderBy($column)
                                ->paginate($this->pagination);
                }
                break;
            case 'desc':
                if(isset($table)) {
                    $items = ItemsCategory::join($table, $table .'.id', '=', 'items.'. $this->joins[$column])
                                ->withCount('item')
                                ->orderByDesc($column)
                                ->paginate($this->pagination);
                } else {
                    $items = ItemsCategory::withCount('item')
                                ->orderByDesc($column)
                                ->paginate($this->pagination);
                }
                break;
        }

        return response()->json($items, 200);
    }

    public function items(ItemsCategory $itemsCategory) {
        $items = $itemsCategory->item()->get();

        return response()->json($items, 200);
    }

    public function all() {
        $categories = ItemsCategory::orderBy('name')->get();

        return response()->json($categories, 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return ItemsCategory::withCount('item')->paginate($this->pagination);
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
            'name' => 'required|unique:items_categories'
        ]);

        $itemsCategory = ItemsCategory::create($request->all());

        return response()->json($itemsCategory, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(ItemsCategory $itemsCategory)
    {
        return $itemsCategory;
    }

    public function edit($id)
    {
        $result = ItemsCategory::all()->find($id);

        return response()->json($result, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ItemsCategory $itemsCategory)
    {
        $itemsCategory->update($request->all());

        return response()->json($itemsCategory, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delete(ItemsCategory $itemsCategory)
    {
        try {
            $itemsCategory->delete();
        } catch(\Exception $e) {
            return response()->json(null, 409);
        }

        return response()->json(null, 204);
    }
}
