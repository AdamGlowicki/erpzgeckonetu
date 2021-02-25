<?php

namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Car;
use App\CarsItem;
use App\CarsUser;
use App\Element;
use App\WarehousesIn;
use DB;

class CarController extends Controller
{
    protected $pagination = 30;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'name',
        'registration',
        'service_date',
    ];

    protected $joins = [];
    protected $with = [
        'carsUser',
        'carsUser.user',
    ];

    public function __construct() {
        $this->middleware('permission:car-list');
        $this->middleware('permission:car-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:car-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:car-delete', ['only' => ['delete']]);
    }

    public function search($str) {
        $cars = Car::all()
                    ->where('name', 'LIKE', "%{$str}%")
                    ->orWhere('registration', 'LIKE', "%{$str}%")
                    ->get();

        return response()->json(['data' => $cars], 200);
    }

    public function all() {
        return response()->json(Car::all(), 200);
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
                $result = Car::with($this->with)
                            ->select('cars.*')
                            ->leftJoin($table, "{$table}.id", "=", "cars.{$this->joins[$column]}")
                            ->where('name', 'LIKE', "%{$request->q}%")
                            ->orWhere('registration', 'LIKE', "%{$request->q}%")
                            ->orWhereHas('carsUser.user', function($query) use ($request) {
                                $query->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('carsItem', function($query) use ($request) {
                                $query->where('quantity', '>', 0)
                                    ->whereHas('item', function($query) use ($request) {
                                        $query->where('model_name', 'LIKE', "%{$request->q}%")->orWhere('id', $request->q);
                                    });
                            })
                            ->orWhereHas('carsItem.element', function($query) use ($request) {
                                $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                            })
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            } else {
                $result = Car::with($this->with)
                            ->select('cars.*')
                            ->leftJoin($table, "{$table}.id", "=", "cars.{$this->joins[$column]}")
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            }
        } else {
            if($request->q) {
                $result = Car::with($this->with)
                            ->where('name', 'LIKE', "%{$request->q}%")
                            ->orWhere('registration', 'LIKE', "%{$request->q}%")
                            ->orWhereHas('carsUser.user', function($query) use ($request) {
                                $query->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('carsItem', function($query) use ($request) {
                                $query->where('quantity', '>', 0)
                                    ->whereHas('item', function($query) use ($request) {
                                        $query->where('model_name', 'LIKE', "%{$request->q}%")->orWhere('id', $request->q);
                                    });
                            })
                            ->orWhereHas('carsItem.element', function($query) use ($request) {
                                $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                            })
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            } else {
                $result = Car::with($this->with)
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
        $result = Car::with($this->with)
                            ->where('name', 'LIKE', "%{$request->q}%")
                            ->orWhere('registration', 'LIKE', "%{$request->q}%")
                            ->orWhereHas('carsUser.user', function($query) use ($request) {
                                $query->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('carsItem', function($query) use ($request) {
                                $query->where('quantity', '>', 0)
                                    ->whereHas('item', function($query) use ($request) {
                                        $query->where('model_name', 'LIKE', "%{$request->q}%")->orWhere('id', $request->q);
                                    });
                            })
                            ->orWhereHas('carsItem.element', function($query) use ($request) {
                                $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
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
        $request->validate([
            'name' => 'required',
            'user_id' => 'required',
        ]);

        // $request->request->add(['user_id' => auth()->user()->id]);

        $car = Car::create([
            'name' => $request->name,
            'registration' => $request->registration,
            'user_id' => auth()->user()->id,
            'locked' => $request->locked ? true : false,
        ]);

        foreach($request->user_id as $user) {
            CarsUser::create([
                'user_id' => $user,
                'car_id' => $car->id,
            ]);
        }

        return response()->json($car, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $result = Car::with(['carsItem', 'carsItem.item', 'carsItem.item.itemsManufacturer'])
                    ->find($id);

        return response()->json($result, 200);
    }

    public function edit($id)
    {
        $result = Car::with(['carsItem', 'carsItem.item', 'carsItem.item.itemsManufacturer', 'carsUser', 'carsUser.user'])
                    ->find($id);

        return response()->json($result, 200);
    }

    public function stockElements($stock) {
        $result = CarsItem::with(['element', 'item'])
                    ->where('id', $stock)
                    ->firstOrFail();

        $result->element->map(function($item) {
            $element = Element::where(['sn' => $item->sn,
                'mac' => $item->mac,
                'element_type' => 'App\\WarehousesInItem'])->first();

            if($element) {
                $r = WarehousesIn::with(['warehousesInItem' => function($query) use ($element) {
                    $query->where('id', $element->element_id);
                }])
                ->whereHas('warehousesInItem', function($query) use ($element) {
                    $query->where('id', $element->element_id);
                })->first();

                $item->warehouses_in = $r;
            }
        });

        return response()->json($result, 200);
    }

    public function verify(Request $request) {
        $request->validate([
            'user_id' => 'required|integer',
            'item_id' => 'required|integer',
        ]);

        $car = CarsUser::where('user_id', $request->user_id)->first();

        if(!$car) {
            return response()->json([], 201);
        }

        $verify = CarsItem::where('car_id', $car->car_id)
                    ->where('item_id', $request->item_id)
                    ->whereHas('element', function($query) use($request) {
                        $query->where(DB::raw('LOWER(`sn`)'), strtolower($request->sn))
                                ->where(DB::raw('LOWER(`mac`)'), strtolower($request->mac));
                    })
                    ->first();

        return response()->json($verify, 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Car $car)
    {
        $request->validate([
            'name' => 'required',
            'registration' => 'required',
        ]);

        $car->update([
            'name' => $request->name,
            'registration' => $request->registration,
            'user_id' => auth()->user()->id,
            'service_date' => $request->service_date,
            'locked' => $request->locked ? true : false,
        ]);

        CarsUser::where('car_id', $car->id)->delete();

        foreach($request->user_id as $user) {
            CarsUser::create([
                'user_id' => $user,
                'car_id' => $car->id,
            ]);
        }

        return response()->json($car, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Car $car
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function delete(Car $car)
    {
        if($car->delete()) {
            CarsUser::where('car_id', null)->delete();
        }

        return response()->json(null, 204);
    }

    public function searchStockOfUser($item, $user) {
        $object = CarsUser::where('user_id', $user)->first();

        if(!$object) {
            return response()->json(null, 400);
        }

        $car = $object->car_id;

        $stock = CarsItem::with(['item', 'item.itemsManufacturer', 'item.unit', 'element' => function($query) use ($item) {
                $query->where('sn', 'LIKE', "%{$item}")->orWhere('mac', 'LIKE', "%{$item}");
            }])
            ->where('quantity', '>', 0)
            ->where(function($query) use ($item, $car) {
                $query->where(function($query) use ($item, $car) {
                    $query->where(['item_id' => $item, 'car_id' => $car]);
                })
                ->orWhere(function($query) use ($item, $car) {
                    $query->where(['car_id' => $car])->whereHas('item', function($query) use ($item) {
                        $query->where('model_name', 'LIKE', "%{$item}%");
                    });
                })
                ->orWhere(function($query) use ($item, $car) {
                    $query->where(['car_id' => $car])->whereHas('item.itemsManufacturer', function($query) use ($item) {
                        $query->where('name', 'LIKE', "%{$item}%");
                    });
                })
                ->orWhere(function($query) use ($item, $car) {
                    $query->where(['car_id' => $car])->whereHas('element', function($query) use ($item) {
                        $query->where('sn', 'LIKE', "%{$item}")->orWhere('mac', 'LIKE', "%{$item}");
                    });
                });
            })
            ->get();

        return response()->json(['data' => $stock], 200);
    }

    public function searchStock($item) {
        $object = CarsUser::where('user_id', auth()->user()->id)->first();

        if(!$object) {
            return response()->json(null, 400);
        }

        $car = $object->car_id;

        $stock = CarsItem::with(['item', 'item.itemsManufacturer', 'item.unit', 'element' => function($query) use ($item) {
                        $query->where('sn', 'LIKE', "%{$item}")->orWhere('mac', 'LIKE', "%{$item}");
                    }])
                    ->where('quantity', '>', 0)
                    ->where(function($query) use ($item, $car) {
                        $query->where(function($query) use ($item, $car) {
                            $query->where(['item_id' => $item, 'car_id' => $car]);
                        })
                        ->orWhere(function($query) use ($item, $car) {
                            $query->where(['car_id' => $car])->whereHas('item', function($query) use ($item) {
                                $query->where('model_name', 'LIKE', "%{$item}%");
                            });
                        })
                        ->orWhere(function($query) use ($item, $car) {
                            $query->where(['car_id' => $car])->whereHas('item.itemsManufacturer', function($query) use ($item) {
                                $query->where('name', 'LIKE', "%{$item}%");
                            });
                        })
                        ->orWhere(function($query) use ($item, $car) {
                            $query->where(['car_id' => $car])->whereHas('element', function($query) use ($item) {
                                $query->where('sn', 'LIKE', "%{$item}")->orWhere('mac', 'LIKE', "%{$item}");
                            });
                        });
                    })
                    ->get();

        return response()->json(['data' => $stock], 200);
    }

    public function document($id) {
        $data = Car::where('id', $id)
            ->first();

        $stock = CarsItem::with(['item', 'item.itemsManufacturer', 'item.itemsCategory', 'item.unit', 'element'])
            ->select('cars_items.*')
            ->leftJoin('items', 'items.id', '=', 'cars_items.item_id')
            ->leftJoin('items_categories', 'items_categories.id', '=', 'items.items_category_id')
            ->where('car_id', $id)
            ->where('quantity', '>', 0)
            ->orderBy('items_categories.name', 'asc')
            ->orderBy('items.model_name', 'asc')
            ->get();

        return base64_encode(app('App\Pdf')->create('pdf.car', compact('data', 'stock')));
    }
}
