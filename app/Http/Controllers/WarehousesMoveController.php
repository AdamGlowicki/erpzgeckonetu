<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Validator;
use DB;
use App\Item;
use App\WarehousesMove;
use App\WarehousesMovesItem;
use App\WarehousesStock;
use App\Element;

class WarehousesMoveController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'warehouses.name{warehouse_in}',
        'warehouses.name{warehouse_out}',
        'users.name',
        'document_name',
        'created_at',
    ];

    protected $joins = [
        'users.name' => 'user_id',
        'warehouses.name{warehouse_in}' => 'warehouse_in_id',
        'warehouses.name{warehouse_out}' => 'warehouse_out_id',
    ];

    protected $with = [
        'warehouse_in',
        'warehouse_out',
        'user',
    ];

    public function __construct() {
        $this->middleware('permission:warehousesMove-list');
        $this->middleware('permission:warehousesMove-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:warehousesMove-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:warehousesMove-delete', ['only' => ['delete']]);
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
                    $items = WarehousesMove::with($this->with)
                                ->select('warehouses_moves.*')
                                ->withCount('warehousesMovesItem')
                                ->leftJoin($table, "{$table}.id", "=", "warehouses_moves.{$this->joins[$column]}")
                                ->orderByRaw(preg_replace('/{.*/', '', $column) ." ASC")
                                ->paginate($this->pagination);
                } else {
                    $items = WarehousesMove::with($this->with)
                                ->withCount('warehousesMovesItem')
                                ->orderByRaw(isset($this->extra[$column]) ? $this->extra[$column] : $column .' ASC')
                                ->paginate($this->pagination);
                }

                break;
            case 'desc':
                if(isset($table)) {
                    $items = WarehousesMove::with($this->with)
                                ->select('warehouses_moves.*')
                                ->withCount('warehousesMovesItem')
                                ->leftJoin($table, "{$table}.id", "=", "warehouses_moves.{$this->joins[$column]}")
                                ->orderByRaw(preg_replace('/{.*/', '', $column) ." DESC")
                                ->paginate($this->pagination);
                } else {
                    $items = WarehousesMove::with($this->with)
                                ->withCount('warehousesMovesItem')
                                ->orderByRaw(isset($this->extra[$column]) ? $this->extra[$column] : $column .' DESC')
                                ->paginate($this->pagination);
                }

                break;
        }

        return response()->json($items, 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
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
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // verify
        if(!(count($request->items) > 0)) {
            return response()->json(null, 400);
        }

        $errors = 0;

        $request->validate([
            'warehouse_in_id' => 'required|integer|exists:warehouses,id',
            'warehouse_out_id' => 'required|integer|exists:warehouses,id',
            'items.*.item_id' => 'required|integer|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.data' => 'required',
        ]);

        foreach($request->items as $item) {
            $item = (object) $item;

            $itemObj = Item::find($item->item_id);

            if(!$itemObj->has_data) {
                continue;
            }

            $stock = WarehousesStock::where(['item_id' => $item->item_id, 'warehouse_id' => $request->warehouse_in_id])->first();

            if(!$stock) {
                $errors++;
                continue;
            }

            if($stock->quantity < $item->quantity) {
                $errors++;
            }

            foreach(json_decode($item->data) as $data) {
                $itemStock = WarehousesStock::where(['item_id' => $item->item_id, 'warehouse_id' => $request->warehouse_in_id])->first();

                $element = Element::where(['element_type' => 'App\WarehousesStock', 'element_id' => $itemStock->id, 'item_id' => $item->item_id, 'mac' => $data->mac, 'sn' => $data->sn])->get();

                if(!(count($element) > 0)) {
                    $errors++;
                }
            }
        }

        if($errors > 0) {
            return response()->json(null, 400);
        }

        $check = WarehousesMove::where('document_id', 1)->whereYear('created_at', Carbon::now()->year)->first();

        if($check) {
            $id = WarehousesMove::whereYear('created_at', Carbon::now()->year)->max('document_id') + 1;
        } else {
            $id = 1;
        }

        // add
        $warehousesMove = WarehousesMove::create([
            'document_id' => $id,
            'warehouse_in_id' => $request->warehouse_in_id,
            'warehouse_out_id' => $request->warehouse_out_id,
            'user_id' => auth()->user()->id,
            'document_name' => 'MM/'. Carbon::now()->year .'/'. $id,
            'notes' => $request->notes,
        ]);

        foreach($request->items as $item) {
            $item = (object) $item;

            $warehousesMovesItem = WarehousesMovesItem::create([
                'warehouses_move_id' => $warehousesMove->id,
                'item_id' => $item->item_id,
                'quantity' => $item->quantity,
            ]);

            $stock = WarehousesStock::where(['item_id' => $item->item_id, 'warehouse_id' => $request->warehouse_in_id])->first();
            $stock->decrement('quantity', $item->quantity);

            if(!WarehousesStock::where(['item_id' => $item->item_id, 'warehouse_id' => $request->warehouse_out_id])->increment('quantity', $item->quantity)) {
                $newWarehousesStock = WarehousesStock::create([
                    'item_id' => $item->item_id,
                    'warehouse_id' => $request->warehouse_out_id,
                    'quantity' => $item->quantity,
                ]);
            } else {
                $newWarehousesStock = WarehousesStock::where(['item_id' => $item->item_id, 'warehouse_id' => $request->warehouse_out_id])->first();
            }

            foreach(json_decode($item->data) as $data) {
                $warehousesMovesItem->element()->create([
                    'item_id' => $item->item_id,
                    'mac' => $data->mac,
                    'sn' => $data->sn,
                ]);

                $newWarehousesStock->element()->create([
                    'item_id' => $item->item_id,
                    'mac' => $data->mac,
                    'sn' => $data->sn,
                ]);

                $stock->element()->where(['mac' => $data->mac, 'sn' => $data->sn])->delete();
            }
        }

        return response()->json($warehousesMove, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $result = WarehousesMove::with(['warehouse_in', 'warehouse_out', 'user', 'warehousesMovesItem', 'warehousesMovesItem.element', 'warehousesMovesItem.item', 'warehousesMovesItem.item.itemsManufacturer', 'warehousesMovesItem.item.unit'])
                            ->find($id);

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

    public function document($id) {
        $data = \App\WarehousesMove::with(['warehouse_in', 'warehouse_out', 'user', 'warehousesMovesItem', 'warehousesMovesItem.element', 'warehousesMovesItem.item', 'warehousesMovesItem.item.itemsManufacturer', 'warehousesMovesItem.item.unit'])
            ->where('id', $id)
            ->first();

        return base64_encode(app('App\Pdf')->create('pdf.warehousesMove', compact('data')));
    }
}
