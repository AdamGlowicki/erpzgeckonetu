<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Warehouse;
use App\WarehousesStock;
use Illuminate\Validation\Rule;
use Validator;
use DB;

class WarehouseController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = ['id', 'name', 'descr', 'city'];
    protected $joins = [];

    public function __construct() {
        $this->middleware('permission:warehouse-list');
        $this->middleware('permission:warehouse-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:warehouse-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:warehouse-delete', ['only' => ['delete']]);
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
                    $items = Warehouse::join($table, $table .'.id', '=', 'items.'. $this->joins[$column])->with('country')->orderBy($column)->paginate($this->pagination);
                } else {
                    $items = Warehouse::with('country')->orderBy($column)->paginate($this->pagination);
                }
                break;
            case 'desc':
                if(isset($table)) {
                    $items = Warehouse::join($table, $table .'.id', '=', 'items.'. $this->joins[$column])->with('country')->orderByDesc($column)->paginate($this->pagination);
                } else {
                    $items = Warehouse::with('country')->orderByDesc($column)->paginate($this->pagination);
                }
                break;
        }

        return response()->json($items, 200);
    }

    public function elements(Warehouse $warehouse) {
        $items = $warehouse->itemsElement()->get();

        return response()->json($items, 200);
    }

    public function all() {
        return Warehouse::all();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $result = Warehouse::with('country')->paginate(10);

        return response()->json($result, 200);
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
            'street' => 'required',
            'postcode' => 'required',
            'city' => 'required',
            'country_id' => 'required|integer|exists:countries,id',
            'type' => 'required|integer'
        ]);

        $warehouse = Warehouse::create($request->all());

        return response()->json($warehouse, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Warehouse $warehouse)
    {
        return response()->json($warehouse, 200);
    }

    public function verify(Request $request) {
        $request->validate([
            'warehouse_id' => 'required|integer|exists:warehouses,id',
            'item_id' => 'required|integer|exists:items,id',
        ]);

        $verify = WarehousesStock::where('warehouse_id', $request->warehouse_id)
                    ->where('item_id', $request->item_id)
                    ->whereHas('element', function($query) use ($request) {
                        $query->where(DB::raw('LOWER(`sn`)'), strtolower($request->sn))
                                ->where(DB::raw('LOWER(`mac`)'), strtolower($request->mac));
                    })
                    ->first();

        return response()->json($verify, 200);
    }

    public function edit($id) {
        $result = Warehouse::all()->find($id);

        return response()->json($result, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Warehouse $warehouse)
    {
        $warehouse->update($request->all());

        return response()->json($warehouse, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(Warehouse $warehouse)
    {
        $warehouse->delete();

        return response()->json(null, 204);
    }

    public function document($id) {
        $data = Warehouse::where('id', $id)
                    ->first();

        $stock = WarehousesStock::with(['item', 'warehouse', 'item.itemsManufacturer', 'item.itemsCategory', 'item.unit', 'element'])
                    ->select('warehouses_stocks.*')
                    ->leftJoin('items', 'items.id', '=', 'warehouses_stocks.item_id')
                    ->leftJoin('items_categories', 'items_categories.id', '=', 'items.items_category_id')
                    ->where('warehouse_id', $id)
                    ->where('quantity', '>', 0)
                    ->orderBy('items_categories.name', 'asc')
                    ->orderBy('items.model_name', 'asc')
                    ->get();

        return base64_encode(app('App\Pdf')->create('pdf.warehouse', compact('data', 'stock')));
    }
}
