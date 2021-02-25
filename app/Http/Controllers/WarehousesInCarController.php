<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\WarehousesInCar;
use App\WarehousesInCarsItem;
use App\WarehousesStock;
use App\Item;
use App\CarsItem;
use App\Element;
use Illuminate\Validation\Rule;
use Validator;
use DB;

class WarehousesInCarController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'cars.name',
        'users.name{user_approved}',
        'users.name{user_get}',
        'warehouses.name',
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
        $this->middleware('permission:warehousesInCar-list');
        $this->middleware('permission:warehousesInCar-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:warehousesInCar-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:warehousesInCar-delete', ['only' => ['delete']]);
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
                $result = WarehousesInCar::with($this->with)
                    ->select('warehouses_in_cars.*')
                    ->withCount('warehousesInCarsItem')
                    ->leftJoin($table, "{$table}.id", "=", "warehouses_in_cars.{$this->joins[$column]}")
                    ->where(function($query) {
                        if(!auth()->user()->can('warehousesInCar-create')) {
                            $query->where('user_get_id', auth()->user()->id);
                        }
                    })
                    ->where(function($query) use ($request) {
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
                            ->orWhereHas('warehousesInCarsItem.item', function($query) use ($request) {
                                $query->where('model_name', 'LIKE', "%{$request->q}%")->orWhere('id', $request->q);
                            })
                            ->orWhereHas('warehousesInCarsItem.element', function($query) use ($request) {
                                $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                            });
                    })
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            } else {
                $result = WarehousesInCar::with($this->with)
                    ->select('warehouses_in_cars.*')
                    ->withCount('warehousesInCarsItem')
                    ->leftJoin($table, "{$table}.id", "=", "warehouses_in_cars.{$this->joins[$column]}")
                    ->where(function($query) {
                        if(!auth()->user()->can('warehousesInCar-create')) {
                            $query->where('user_get_id', auth()->user()->id);
                        }
                    })
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            }
        } else {
            if($request->q) {
                $result = WarehousesInCar::with($this->with)
                    ->withCount('warehousesInCarsItem')
                    ->where(function($query) {
                        if(!auth()->user()->can('warehousesInCar-create')) {
                            $query->where('user_get_id', auth()->user()->id);
                        }
                    })
                    ->where(function($query) use ($request) {
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
                            ->orWhereHas('warehousesInCarsItem.item', function($query) use ($request) {
                                $query->where('model_name', 'LIKE', "%{$request->q}%")->orWhere('id', $request->q);
                            })
                            ->orWhereHas('warehousesInCarsItem.element', function($query) use ($request) {
                                $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                            });
                    })
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            } else {
                $result = WarehousesInCar::with($this->with)
                    ->withCount('warehousesInCarsItem')
                    ->where(function($query) {
                        if(!auth()->user()->can('warehousesInCar-create')) {
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
        $result = WarehousesInCar::with($this->with)
            ->where(function($query) {
                if(!auth()->user()->can('warehousesInCar-create')) {
                    $query->where('user_get_id', auth()->user()->id);
                }
            })
            ->paginate($this->pagination);

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

        if(!\App\CarsUser::where('user_id', $request->user_get_id)->first()) {
            $errors++;
        }

        if($errors > 0) {
            return response()->json(null, 400);
        }

        $car_id = \App\CarsUser::where('user_id', $request->user_get_id)->first()->car_id;

        foreach($request->items as $item) {
            $itemObj = Item::find($item['item_id']);

            if(!$itemObj->has_data) {
                continue;
            }

            $stock = CarsItem::where(['item_id' => $item['item_id'], 'car_id' => $car_id])->first();

            if($stock->quantity < $item['quantity']) {
                $errors++;
            }

            foreach(json_decode($item['data']) as $data) {
                $itemStock = CarsItem::where(['item_id' => $item['item_id'], 'car_id' => $car_id])->first();

                $element = Element::where(['element_type' => 'App\CarsItem', 'element_id' => $itemStock->id, 'item_id' => $item['item_id'], 'mac' => $data->mac, 'sn' => $data->sn])->get();

                if(!(count($element) > 0)) {
                    $errors++;
                }
            }
        }

        if($errors > 0) {
            return response()->json(null, 400);
        }

        // add
        $warehousesInCar = WarehousesInCar::create([
            'car_id' => $car_id,
            'warehouse_id' => $request->warehouse_id,
            'user_approved_id' => auth()->user()->id,
            'user_get_id' => $request->user_get_id,
            'document_name' => 'ZW/' . date('Y', time()) . '/' . (string)((int)DB::table('warehouses_in_cars')->max('id') + 1),
            'notes' => $request->notes,
        ]);

        foreach($request->items as $item) {
            $warehousesInCarsItem = WarehousesInCarsItem::create([
                'warehouses_in_car_id' => $warehousesInCar->id,
                'item_id' => $item['item_id'],
                'quantity' => $item['quantity'],
            ]);

            $stock = CarsItem::where(['item_id' => $item['item_id'], 'car_id' => $car_id])->first();
            $stock->decrement('quantity', $item['quantity']);

            if(!WarehousesStock::where(['item_id' => $item['item_id'], 'warehouse_id' => $request->warehouse_id])->increment('quantity', $item['quantity'])) {
                $warehousesStock = WarehousesStock::create([
                    'item_id' => $item['item_id'],
                    'warehouse_id' => $request->warehouse_id,
                    'quantity' => $item['quantity'],
                ]);
            } else {
                $warehousesStock = WarehousesStock::where(['item_id' => $item['item_id'], 'warehouse_id' => $request->warehouse_id])->first();
            }

            foreach(json_decode($item['data']) as $data) {
                $warehousesInCarsItem->element()->create([
                    'item_id' => $item['item_id'],
                    'mac' => $data->mac,
                    'sn' => $data->sn,
                ]);

                $warehousesStock->element()->create([
                    'item_id' => $item['item_id'],
                    'mac' => $data->mac,
                    'sn' => $data->sn,
                ]);

                $stock->element()->where(['mac' => $data->mac, 'sn' => $data->sn])->delete();
            }
        }

        return response()->json($warehousesInCar, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $result = WarehousesInCar::with(['car', 'warehouse', 'user_approved', 'user_get', 'warehousesInCarsItem', 'warehousesInCarsItem.element', 'warehousesInCarsItem.item', 'warehousesInCarsItem.item.itemsManufacturer', 'warehousesInCarsItem.item.unit'])
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
        $data = \App\WarehousesInCar::with(['car', 'warehouse', 'user_approved', 'user_get', 'warehousesInCarsItem', 'warehousesInCarsItem.element', 'warehousesInCarsItem.item', 'warehousesInCarsItem.item.itemsManufacturer', 'warehousesInCarsItem.item.unit'])
            ->where('id', $id)
            ->first();

        return base64_encode(app('App\Pdf')->create('pdf.warehousesInCar', compact('data')));
    }
}
