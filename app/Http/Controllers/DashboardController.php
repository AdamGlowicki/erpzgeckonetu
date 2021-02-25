<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Item;
use Validator;
use Illuminate\Validation\Rule;

class DashboardController extends Controller
{
    protected $with = [
        'items_low' => [
            'itemsCategory',
            'itemsManufacturer',
            'unit',
            'quantity',
        ],
        'items_usage' => [
            'itemsCategory',
            'itemsManufacturer',
            'unit',
            'carsOutsItem',
        ],
        'users_items_usage' => [
            'itemsCategory',
            'itemsManufacturer',
            'unit',
            'quantity',
        ],
        'cars_items_usage' => [
            'itemsCategory',
            'itemsManufacturer',
            'unit',
            'quantity',
        ],
    ];

    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'items_low' => [
            'id',
            'model_name',
            'items_manufacturers.name',
            'items_categories.name',
            'units.short_name',
            'low_quant',
        ],
        'items_usage' => [
            'id',
            'model_name',
            'items_manufacturers.name',
            'units.name',
            'q',
        ],
        'users_items_usage' => [
            'id',
            'model_name',
            'items_manufacturers.name',
            'units.name',
            'q',
        ],
        'cars_items_usage' => [
            'id',
            'model_name',
            'items_manufacturers.name',
            'units.name',
            'q',
        ],
    ];

    protected $joins = [
        'items_low' => [
            'items_manufacturers.name' => 'items_manufacturer_id',
            'items_categories.name' => 'items_category_id',
            'units.short_name' => 'unit_id',
        ],
        'items_usage' => [
            'items_manufacturers.name' => 'items_manufacturer_id',
            'units.name' => 'unit_id',
        ],
        'users_items_usage' => [
            'items_manufacturers.name' => 'items_manufacturer_id',
            'units.name' => 'unit_id',
        ],
        'cars_items_usage' => [
            'items_manufacturers.name' => 'items_manufacturer_id',
            'units.name' => 'unit_id',
        ],
    ];

    public function __construct() {
        $this->columns = (object) $this->columns;
        $this->joins = (object) $this->joins;
        $this->with = (object) $this->with;

        $this->middleware('permission:items_low-list', ['only' => ['items_low', 'items_low_sort']]);
        $this->middleware('permission:items_usage-list', ['only' => ['items_usage', 'items_usage_sort']]);
        $this->middleware('permission:users_items_usage-list', ['only' => ['users_items_usage', 'users_items_usage_sort']]);
        $this->middleware('permission:cars_items_usage-list', ['only' => ['cars_items_usage', 'cars_items_usage_sort']]);
    }

    public function items_low() {
        $result = Item::with($this->with->items_low)
            ->where('low_quant', '>', 0)
            ->where(function($query) {
                $query->where(function($query) {
                    $query->whereHas('warehousesStock', function ($query) {
                        $query->havingRaw('SUM(`warehouses_stocks`.`quantity`) < `items`.`low_quant`')
                        ->whereHas('warehouse', function($query) {
                            $query->where('type', 0);
                        });
                    })
                    ->orWhereDoesntHave('warehousesStock');
                });
            })
            ->paginate($this->pagination);

       return response()->json($result, 200);
    }

    public function items_low_sort(Request $request, $direction, $column) {
        $validation = Validator::make(['column' => $column, 'direction' => $direction], [
            'column' => ['required', Rule::in($this->columns->items_low)],
            'direction' => ['required', Rule::in($this->directions)]
        ]);

        if($validation->fails()) {
            return response()->json(null, 400);
        }

        if(count(explode('.', $column)) > 1) {
            $table = explode('.', $column)[0];
        }

        if(isset($table)) {
            $items = Item::with($this->with->items_low)
                        ->select('items.*')
                        ->leftJoin($table, "{$table}.id", "=", "items.{$this->joins->items_low[$column]}")
                        ->where('low_quant', '>', 0)
                        ->where(function($query) {
                            $query->whereHas('warehousesStock', function($query) {
                                $query->havingRaw('SUM(`warehouses_stocks`.`quantity`) < `items`.`low_quant`');
                            })
                            ->orWhereDoesntHave('warehousesStock');
                        })
                        ->orderByRaw("{$column} {$direction}")
                        ->paginate($this->pagination);
        } else {
            $items = Item::with($this->with->items_low)
                        ->where('low_quant', '>', 0)
                        ->where(function($query) {
                            $query->whereHas('warehousesStock', function($query) {
                                $query->havingRaw('SUM(`warehouses_stocks`.`quantity`) < `items`.`low_quant`');
                            })
                            ->orWhereDoesntHave('warehousesStock');
                        })
                        ->orderByRaw("{$column} {$direction}")
                        ->paginate($this->pagination);
        }

        return response()->json($items, 200);
    }

    public function items_usage() {
        $items = Item::with($this->with->items_usage)
                    ->withCount(['carsOutsItem as q' => function($query) {
                        $query->select(\DB::raw('SUM(`quantity`)'))->whereYear('created_at', date('Y'))->whereMonth('created_at', date('m'));;
                    }])
                    ->whereHas('carsOutsItem', function($query) {
                        $query->havingRaw('SUM(`cars_outs_items`.`quantity`) > 0')->whereYear('created_at', date('Y'))->whereMonth('created_at', date('m'));
                    })
                    ->orderBy('q', 'desc')
                    ->paginate($this->pagination);

       return response()->json($items, 200);
    }

    public function items_usage_sort(Request $request, $direction, $column) {
        $validation = Validator::make(['column' => $column, 'direction' => $direction], [
            'column' => ['required', Rule::in($this->columns->items_usage)],
            'direction' => ['required', Rule::in($this->directions)]
        ]);

        if($validation->fails()) {
            return response()->json(null, 400);
        }

        if(count(explode('.', $column)) > 1) {
            $table = explode('.', $column)[0];
        }

        if(isset($table)) {
            $items = Item::with($this->with->items_usage)
                        ->withCount(['carsOutsItem as q' => function($query) {
                            $query->select(\DB::raw('SUM(`quantity`)'))->whereYear('created_at', date('Y'))->whereMonth('created_at', date('m'));
                        }])
                        ->select('items.*')
                        ->leftJoin($table, "{$table}.id", "=", "items.{$this->joins->items_usage[$column]}")
                        ->whereHas('carsOutsItem', function($query) {
                            $query->havingRaw('SUM(`cars_outs_items`.`quantity`) > 0')->whereYear('created_at', date('Y'))->whereMonth('created_at', date('m'));
                        })
                        ->orderByRaw("{$column} {$direction}")
                        ->paginate($this->pagination);
        } else {
            $items = Item::with($this->with->items_usage)
                        ->withCount(['carsOutsItem as q' => function($query) {
                            $query->select(\DB::raw('SUM(`quantity`)'))->whereYear('created_at', date('Y'))->whereMonth('created_at', date('m'));
                        }])
                        ->whereHas('carsOutsItem', function($query) {
                            $query->havingRaw('SUM(`cars_outs_items`.`quantity`) > 0')->whereYear('created_at', date('Y'))->whereMonth('created_at', date('m'));
                        })
                        ->orderByRaw("{$column} {$direction}")
                        ->paginate($this->pagination);
        }

        return response()->json($items, 200);
    }

    public function users_items_usage(Request $request) {
        $items = Item::with($this->with->users_items_usage)
                    ->withCount(['carsOutsItem as q' => function($query) use($request) {
                        $query->select(\DB::raw('SUM(`quantity`)'))->whereHas('carsOut', function($query) use ($request) {
                            $query->where('user_id', $request->user_id)->whereYear('created_at', date('Y', strtotime($request->date)))->whereMonth('created_at', date('m', strtotime($request->date)));
                        });
                    }])
                    ->whereHas('carsOutsItem', function($query) use($request) {
                        $query->havingRaw('SUM(`cars_outs_items`.`quantity`) > 0')->whereHas('carsOut', function($query) use ($request) {
                            $query->where('user_id', $request->user_id)->whereYear('created_at', date('Y', strtotime($request->date)))->whereMonth('created_at', date('m', strtotime($request->date)));
                        });
                    })
                    ->orderBy('q', 'desc')
                    ->paginate($this->pagination);

       return response()->json($items, 200);
    }

    public function users_items_usage_sort(Request $request, $direction, $column) {
        $validation = Validator::make(['column' => $column, 'direction' => $direction], [
            'column' => ['required', Rule::in($this->columns->users_items_usage)],
            'direction' => ['required', Rule::in($this->directions)]
        ]);

        if($validation->fails()) {
            return response()->json(null, 400);
        }

        if(count(explode('.', $column)) > 1) {
            $table = explode('.', $column)[0];
        }

        if(isset($table)) {
            $items = Item::with($this->with->users_items_usage)
                    ->withCount(['carsOutsItem as q' => function($query) use($request) {
                        $query->select(\DB::raw('SUM(`quantity`)'))->whereHas('carsOut', function($query) use ($request) {
                            $query->where('user_id', $request->user_id)->whereYear('created_at', date('Y', strtotime($request->date)))->whereMonth('created_at', date('m', strtotime($request->date)));
                        });
                    }])
                        ->select('items.*')
                        ->leftJoin($table, "{$table}.id", "=", "items.{$this->joins->users_items_usage[$column]}")
                        ->whereHas('carsOutsItem', function($query) use($request) {
                            $query->havingRaw('SUM(`cars_outs_items`.`quantity`) > 0')->whereYear('created_at', date('Y', strtotime($request->date)))->whereMonth('created_at', date('m', strtotime($request->date)))->whereHas('carsOut', function($query) use ($request) {
                                $query->where('user_id', $request->user_id);
                            });
                        })
                        ->orderByRaw("{$column} {$direction}")
                        ->paginate($this->pagination);
        } else {
            $items = Item::with($this->with->users_items_usage)
                    ->withCount(['carsOutsItem as q' => function($query) use($request) {
                        $query->select(\DB::raw('SUM(`quantity`)'))->whereHas('carsOut', function($query) use ($request) {
                            $query->where('user_id', $request->user_id)->whereYear('created_at', date('Y', strtotime($request->date)))->whereMonth('created_at', date('m', strtotime($request->date)));
                        });
                    }])
                        ->whereHas('carsOutsItem', function($query) use($request) {
                            $query->havingRaw('SUM(`cars_outs_items`.`quantity`) > 0')->whereYear('created_at', date('Y', strtotime($request->date)))->whereMonth('created_at', date('m', strtotime($request->date)))->whereHas('carsOut', function($query) use ($request) {
                                $query->where('user_id', $request->user_id);
                            });
                        })
                        ->orderByRaw("{$column} {$direction}")
                        ->paginate($this->pagination);
        }

        return response()->json($items, 200);
    }

    public function cars_items_usage(Request $request) {
        $result = Item::with($this->with->cars_items_usage)
            ->withCount(['carsOutsItem as q' => function($query) use($request) {
                $query->select(\DB::raw('SUM(`quantity`)'))->whereHas('carsOut', function($query) use ($request) {
                    $query->where('car_id', $request->car_id)->whereYear('created_at', date('Y', strtotime($request->date)))->whereMonth('created_at', date('m', strtotime($request->date)));
                });
            }])
            ->whereHas('carsOutsItem', function($query) use($request) {
                $query->havingRaw('SUM(`cars_outs_items`.`quantity`) > 0')->whereHas('carsOut', function($query) use ($request) {
                    $query->where('car_id', $request->car_id)->whereYear('created_at', date('Y', strtotime($request->date)))->whereMonth('created_at', date('m', strtotime($request->date)));
                });
            })
            ->orderBy('q', 'desc')
            ->paginate($this->pagination);

        return response()->json($result, 200);
    }

    public function cars_items_usage_sort(Request $request, $direction, $column) {
        $validation = Validator::make(['column' => $column, 'direction' => $direction], [
            'column' => ['required', Rule::in($this->columns->cars_items_usage)],
            'direction' => ['required', Rule::in($this->directions)]
        ]);

        if($validation->fails()) {
            return response()->json(null, 400);
        }

        if(count(explode('.', $column)) > 1) {
            $table = explode('.', $column)[0];
        }

        if(isset($table)) {
            $result = Item::with($this->with->cars_items_usage)
                ->withCount(['carsOutsItem as q' => function($query) use($request) {
                    $query->select(\DB::raw('SUM(`quantity`)'))->whereHas('carsOut', function($query) use ($request) {
                        $query->where('car_id', $request->car_id)->whereYear('created_at', date('Y', strtotime($request->date)))->whereMonth('created_at', date('m', strtotime($request->date)));
                    });
                }])
                ->select('items.*')
                ->leftJoin($table, "{$table}.id", "=", "items.{$this->joins->cars_items_usage[$column]}")
                ->whereHas('carsOutsItem', function($query) use($request) {
                    $query->havingRaw('SUM(`cars_outs_items`.`quantity`) > 0')->whereYear('created_at', date('Y', strtotime($request->date)))->whereMonth('created_at', date('m', strtotime($request->date)))->whereHas('carsOut', function($query) use ($request) {
                        $query->where('car_id', $request->car_id);
                    });
                })
                ->orderByRaw("{$column} {$direction}")
                ->paginate($this->pagination);
        } else {
            $result = Item::with($this->with->cars_items_usage)
                ->withCount(['carsOutsItem as q' => function($query) use($request) {
                    $query->select(\DB::raw('SUM(`quantity`)'))->whereHas('carsOut', function($query) use ($request) {
                        $query->where('car_id', $request->car_id)->whereYear('created_at', date('Y', strtotime($request->date)))->whereMonth('created_at', date('m', strtotime($request->date)));
                    });
                }])
                ->whereHas('carsOutsItem', function($query) use($request) {
                    $query->havingRaw('SUM(`cars_outs_items`.`quantity`) > 0')->whereYear('created_at', date('Y', strtotime($request->date)))->whereMonth('created_at', date('m', strtotime($request->date)))->whereHas('carsOut', function($query) use ($request) {
                        $query->where('car_id', $request->car_id);
                    });
                })
                ->orderByRaw("{$column} {$direction}")
                ->paginate($this->pagination);
        }

        return response()->json($result, 200);
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
        //
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
