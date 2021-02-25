<?php

namespace App\Http\Controllers;

use App\WarehousesPlace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class WarehousesPlaceController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'users.name',
        'warehouses.name',
        'items.model_name',
        'name',
    ];

    protected $joins = [
        'users.id' => 'user_id',
        'warehouses.id' => 'warehouse_id',
        'items.id' => 'item_id',
    ];

    protected $with = [
        'user',
        'warehouse',
        'item',
    ];

    public function __construct() {
        $this->middleware('permission:warehousesPlace-list');
        $this->middleware('permission:warehousesPlace-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:warehousesPlace-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:warehousesPlace-delete', ['only' => ['delete']]);
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
                $result = WarehousesPlace::with($this->with)
                    ->select('warehouses_places.*')
                    ->leftJoin($table, "{$table}.id", "=", "warehouses_places.{$this->joins[$column]}")
                    ->where('warehouses_places.name', 'LIKE', "%{$request->q}%")
                    ->orWhereHas('warehouse', function($query) use ($request) {
                        $query->where('name', 'LIKE', "%{$request->q}%");
                    })
                    ->orWhereHas('item', function($query) use ($request) {
                        $query->where('model_name', 'LIKE', "%{$request->q}")->orWhere('id', $request->q);
                    });

                $result = $result->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            } else {
                $result = WarehousesPlace::with($this->with)
                    ->select('warehouses_places.*')
                    ->leftJoin($table, "{$table}.id", "=", "warehouses_places.{$this->joins[$column]}")
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            }
        } else {
            if($request->q) {
                $result = WarehousesPlace::with($this->with)
                    ->where('warehouses_places.name', 'LIKE', "%{$request->q}%")
                    ->orWhereHas('warehouse', function($query) use ($request) {
                        $query->where('name', 'LIKE', "%{$request->q}%");
                    })
                    ->orWhereHas('item', function($query) use ($request) {
                        $query->where('model_name', 'LIKE', "%{$request->q}")->orWhere('id', $request->q);
                    })
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            } else {
                $result = WarehousesPlace::with($this->with)
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            }
        }

        return response()->json($result, 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $result = WarehousesPlace::with($this->with)
            ->where('id', 'LIKE', $request->q)
            ->orWhere('name', 'LIKE', "%{$request->q}%")
            ->orWhereHas('warehouse', function($query) use ($request) {
                $query->where('name', 'LIKE', "%{$request->q}%");
            })
            ->orWhereHas('item', function($query) use ($request) {
                $query->where('model_name', 'LIKE', "%{$request->q}%");
            })
            ->orWhereHas('user', function($query) use ($request) {
                $query->where('name', 'LIKE', "%{$request->q}");
            });

        $result = $result->paginate($this->pagination);

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
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'warehouse_id' => 'integer|exists:warehouses,id',
            'item_id' => 'nullable|integer|exists:items,id|unique:warehouses_places,item_id,null,null,warehouse_id,'. $request->warehouse_id,
            'name' => 'required|string',
        ]);

        $object = WarehousesPlace::create([
            'warehouse_id' => $request->warehouse_id,
            'user_id' => auth()->user()->id,
            'item_id' => $request->item_id,
            'name' => $request->name,
        ]);

        return response()->json($object, 201);
    }

    /**
     * Mass import of items
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function import(Request $request)
    {
        $request->validate([
            'warehouse_id' => 'required|integer|exists:warehouses,id',
            'items.*.name' => 'required',
            'items.*.item_id' => 'nullable|integer|exists:items,id',
        ]);

        foreach($request->items as $item) {
            $item = (object) $item;

            WarehousesPlace::create([
                'user_id' => auth()->user()->id,
                'warehouse_id' => $request->warehouse_id,
                'name' => $item->name,
                'item_id' => $item->item_id,
            ]);
        }

        return response()->json(null, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $object = WarehousesPlace::with($this->with)->find($id);

        if(!$object) {
            return response()->json(null, 422);
        }

        return response()->json($object, 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function edit($id)
    {
        $object = WarehousesPlace::with($this->with)->find($id);

        if(!$object) {
            return response()->json(null, 422);
        }

        return response()->json($object, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'warehouse_id' => 'integer|exists:warehouses,id',
            'item_id' => 'nullable|integer|exists:items,id',
            'name' => 'string',
        ]);

        $object = WarehousesPlace::find($id);

        if(!$object) {
            return response()->json(null, 422);
        }

        $object->update([
            'warehouse_id' => $request->warehouse_id,
            'item_id' => $request->item_id,
            'name' => $request->name,
        ]);

        return response()->json($object, 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $object = WarehousesPlace::find($id);

        if(!$object) {
            return response()->json(null, 422);
        }

        $object->delete();

        return response()->json(null, 204);
    }
}
