<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\WarehousesOutCar;
use App\WarehousesOutCarsItem;
use App\WarehousesStock;
use App\CarsItem;
use App\CarsUser;
use App\Item;
use App\Element;
use Illuminate\Validation\Rule;
use Validator;
use DB;

class WarehousesOutCarController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'cars.name',
        'warehouses.name',
        'users.name{user_approved}',
        'users.name{user_get}',
        'document_name',
        'created_at',
    ];

    protected $joins = [
        'cars.name' => 'car_id',
        'warehouses.name' => 'warehouse_id',
        'users.name{user_approved}' => 'user_approved_id',
        'users.name{user_get}' => 'user_get_id',
    ];

    protected $with = [
        'car',
        'warehouse',
        'user_approved',
        'user_get',
    ];

    public function __construct() {
        $this->middleware('permission:warehousesOutCar-list');
        $this->middleware('permission:warehousesOutCar-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:warehousesOutCar-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:warehousesOutCar-delete', ['only' => ['delete']]);
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
            $table = explode('.', preg_replace('/{.*/', '', $column))[0];
        }

        if(isset($table)) {
            if($request->q) {
                $result = WarehousesOutCar::with($this->with)
                    ->select('warehouses_out_cars.*')
                    ->withCount('warehousesOutCarsItem')
                    ->leftJoin($table, "{$table}.id", "=", "warehouses_out_cars.{$this->joins[$column]}")
                    ->where(function($query) {
                        if(!auth()->user()->can('warehousesOutCar-create')) {
                            $query->where('user_get_id', auth()->user()->id);
                        }
                    })
                    ->where(function($query) use($request) {
                        $query->where('document_name', 'LIKE', "%{$request->q}%")
                            ->orWhereHas('warehouse', function($query) use ($request) {
                                $query->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('car', function($query) use ($request) {
                                $query->where('name', 'LIKE', "%{$request->q}%")->orWhere('registration', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('user_approved', function($query) use ($request) {
                                $query->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('user_get', function($query) use ($request) {
                                $query->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('warehousesOutCarsItem.item', function($query) use ($request) {
                                $query->where('model_name', 'LIKE', "%{$request->q}%")->orWhere('id', $request->q);
                            })
                            ->orWhereHas('warehousesOutCarsItem.element', function($query) use ($request) {
                                $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                            });
                    })
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            } else {
                $result = WarehousesOutCar::with($this->with)
                    ->select('warehouses_out_cars.*')
                    ->withCount('warehousesOutCarsItem')
                    ->leftJoin($table, "{$table}.id", "=", "warehouses_out_cars.{$this->joins[$column]}")
                    ->where(function($query) {
                        if(!auth()->user()->can('warehousesOutCar-create')) {
                            $query->where('user_get_id', auth()->user()->id);
                        }
                    })
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            }
        } else {
            if($request->q) {
                $result = WarehousesOutCar::with($this->with)
                    ->withCount('warehousesOutCarsItem')
                    ->where(function($query) {
                        if(!auth()->user()->can('warehousesOutCar-create')) {
                            $query->where('user_get_id', auth()->user()->id);
                        }
                    })
                    ->where(function($query) use($request) {
                        $query->where('document_name', 'LIKE', "%{$request->q}%")
                            ->orWhereHas('warehouse', function ($query) use ($request) {
                                $query->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('car', function ($query) use ($request) {
                                $query->where('name', 'LIKE', "%{$request->q}%")->orWhere('registration', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('user_approved', function ($query) use ($request) {
                                $query->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('user_get', function ($query) use ($request) {
                                $query->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('warehousesOutCarsItem.item', function ($query) use ($request) {
                                $query->where('model_name', 'LIKE', "%{$request->q}%")->orWhere('id', $request->q);
                            })
                            ->orWhereHas('warehousesOutCarsItem.element', function ($query) use ($request) {
                                $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                            });
                    })
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            } else {
                $result = WarehousesOutCar::with($this->with)
                    ->withCount('warehousesOutCarsItem')
                    ->where(function($query) {
                        if(!auth()->user()->can('warehousesOutCar-create')) {
                            $query->where('user_get_id', auth()->user()->id);
                        }
                    })
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
    public function index()
    {
        $result = WarehousesOutCar::with($this->with)
            ->where(function($query) {
                if(!auth()->user()->can('warehousesOutCar-create')) {
                    $query->where('user_get_id', auth()->user()->id);
                }
            })
            ->paginate($this->pagination);

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
        // verify
        if(!(count($request->items) > 0)) {
            return response()->json(null, 400);
        }

        $errors = 0;

        $request->validate([
            'warehouse_id' => 'required|integer',
            'user_get_id' => 'required|integer',
            'items.*.item_id' => 'required|integer',
            'items.*.quantity' => 'required|integer',
            'items.*.data' => 'required',
        ]);

        if(!CarsUser::where('user_id', $request->user_get_id)->first()) {
            $errors++;
        }

        if($errors > 0) {
            return response()->json(null, 400);
        }

        $car_id = CarsUser::where('user_id', $request->user_get_id)->first()->car_id;

        foreach($request->items as $item) {
            $itemObj = Item::find($item['item_id']);

            if(!$itemObj->has_data) {
                continue;
            }

            $stock = WarehousesStock::where(['item_id' => $item['item_id'], 'warehouse_id' => $request->warehouse_id])->first();

            if($stock->quantity < $item['quantity']) {
                $errors++;
            }

            foreach(json_decode($item['data']) as $data) {
                $itemStock = WarehousesStock::where(['item_id' => $item['item_id'], 'warehouse_id' => $request->warehouse_id])->first();

                $element = Element::where(['element_type' => 'App\WarehousesStock', 'element_id' => $itemStock->id, 'item_id' => $item['item_id'], 'mac' => $data->mac, 'sn' => $data->sn])->get();

                if(!(count($element) > 0)) {
                    $errors++;
                }
            }
        }

        if($errors > 0) {
            return response()->json(null, 400);
        }

        $check = WarehousesOutCar::where('document_id', 1)->whereYear('created_at', Carbon::now()->year)->first();

        if($check) {
            $id = WarehousesOutCar::whereYear('created_at', Carbon::now()->year)->max('document_id') + 1;
        } else {
            $id = 1;
        }

        // add
        $warehousesOutCar = WarehousesOutCar::create([
            'document_id' => $id,
            'car_id' => $car_id,
            'warehouse_id' => $request->warehouse_id,
            'user_approved_id' => auth()->user()->id,
            'user_get_id' => $request->user_get_id,
            'document_name' => 'RW/'. Carbon::now()->year .'/'. $id,
            'notes' => $request->notes,
        ]);

        foreach($request->items as $item) {
            $warehousesOutCarsItem = WarehousesOutCarsItem::create([
                'warehouses_out_car_id' => $warehousesOutCar->id,
                'item_id' => $item['item_id'],
                'quantity' => $item['quantity'],
            ]);

            $stock = WarehousesStock::where(['item_id' => $item['item_id'], 'warehouse_id' => $request->warehouse_id])->first();
            $stock->decrement('quantity', $item['quantity']);


            if(!CarsItem::where(['item_id' => $item['item_id'], 'car_id' => $car_id])->increment('quantity', $item['quantity'])) {
                $carsItem = CarsItem::create([
                    'item_id' => $item['item_id'],
                    'car_id' => $car_id,
                    'quantity' => $item['quantity'],
                ]);
            } else {
                $carsItem = CarsItem::where(['item_id' => $item['item_id'], 'car_id' => $car_id])->first();
            }

            foreach(json_decode($item['data']) as $data) {
                $warehousesOutCarsItem->element()->create([
                    'item_id' => $item['item_id'],
                    'mac' => $data->mac,
                    'sn' => $data->sn,
                ]);

                $carsItem->element()->create([
                    'item_id' => $item['item_id'],
                    'mac' => $data->mac,
                    'sn' => $data->sn,
                ]);

                $stock->element()->where(['mac' => $data->mac, 'sn' => $data->sn])->delete();
            }
        }

        return response()->json($warehousesOutCar, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $result = WarehousesOutCar::with(['car', 'warehouse', 'user_approved', 'user_get', 'warehousesOutCarsItem', 'warehousesOutCarsItem.element', 'warehousesOutCarsItem.item', 'warehousesOutCarsItem.item.itemsManufacturer', 'warehousesOutCarsItem.item.unit'])
                            ->find($id);

        return response()->json($result, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, WarehousesOutCar $warehousesOutCar)
    {
        $warehousesOutCar->update($request->all());

        return response()->json($warehousesOutCar, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(WarehousesOutCar $warehousesOutCar)
    {
        if(!$warehousesOutCar) {
            return response()->json(null, 410);
        }

        try {
            $warehousesOutCar->delete();
        } catch(\Exception $e) {
            return response()->json(null, 409);
        }

        return response()->json(null, 204);
    }

    public function document($id) {
        $data = \App\WarehousesOutCar::with(['car', 'warehouse', 'user_approved', 'user_get', 'warehousesOutCarsItem', 'warehousesOutCarsItem.element', 'warehousesOutCarsItem.item', 'warehousesOutCarsItem.item.itemsManufacturer', 'warehousesOutCarsItem.item.unit'])
            ->where('id', $id)
            ->first();

        return base64_encode(app('App\Pdf')->create('pdf.warehousesOutCar', compact('data')));
    }
}
