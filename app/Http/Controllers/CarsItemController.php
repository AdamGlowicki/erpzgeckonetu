<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Validator;
use App\CarsItem;
use App\CarsUser;
use App\Car;

class CarsItemController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'item_id',
        'items.model_name',
        'items.items_manufacturers.name',
        'items.items_categories.name',
        'quantity',
        'items.units.short_name'
    ];

    protected $with = [
        'item',
        'item.itemsManufacturer',
        'item.itemsCategory',
        'item.unit',
        'element',
    ];

    protected $joins = [
        'items.model_name' => ['item_id'],
        'items.items_manufacturers.name' => ['item_id', 'items_manufacturer_id'],
        'items.items_categories.name' => ['item_id', 'items_category_id'],
        'items.units.short_name' => ['item_id', 'unit_id'],
    ];

    public function stock($car, Request $request) {
        $result = CarsItem::select('cars_items.*');

        if($request->sortDir && $request->sortCol) {
            $validation = Validator::make(['column' => $request->sortCol, 'direction' => $request->sortDir], [
                'column' => ['required', Rule::in($this->columns)],
                'direction' => ['required', Rule::in($this->directions)]
            ]);

            if($validation->fails()) {
                return response()->json(null, 400);
            }

            $tables = explode('.', $request->sortCol);
            $column = array_pop($tables);

            $joining = 'cars_items';

            $i = 0;

            foreach($tables as $table) {
                $result->leftJoin($table, "{$table}.id", "=", "{$joining}.{$this->joins[$request->sortCol][$i]}");

                $joining = $table;
                $i++;
            }
        }

        if($request->q) {
            $result = $result->where('car_id', $car)
                        ->where('quantity', '>', 0)
                        ->where(function($query) use ($request) {
                            $query->whereHas('item', function($q) use($request) {
                                $q->where('model_name', 'LIKE', "%{$request->q}%")->orWhere('id', $request->q);
                            })
                            ->orWhereHas('item.itemsManufacturer', function($q) use($request) {
                                $q->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('item.itemsCategory', function($q) use($request) {
                                $q->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('element', function($q) use($request) {
                                $q->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                            });
                        });
        } else {
            $result = $result->where('car_id', $car)
                        ->where('quantity', '>', 0);
        }

        if($request->sortDir && $request->sortCol) {
            $result->orderByRaw("`{$joining}`.`{$column}` {$request->sortDir}");
        }

        $result = $result->with($this->with);

        $data = $result->paginate($this->pagination);

        $car = Car::with([
            'carsUser',
            'carsUser.user',
        ])->find($car);

        return response()->json([
            'items' => $data,
            'car' => $car,
        ], 200);
    }

    public function stockOwn(Request $request) {
        $carUser = CarsUser::where('user_id', auth()->user()->id)->first();

        if(!$carUser) {
            return response()->json([], 422);
        }

        $result = CarsItem::with($this->with);

        if($request->sortDir && $request->sortCol) {
            $validation = Validator::make(['column' => $request->sortCol, 'direction' => $request->sortDir], [
                'column' => ['required', Rule::in($this->columns)],
                'direction' => ['required', Rule::in($this->directions)]
            ]);

            if($validation->fails()) {
                return response()->json(null, 400);
            }

            $tables = explode('.', $request->sortCol);
            $column = array_pop($tables);

            $joining = 'cars_items';

            $i = 0;

            foreach($tables as $table) {
                $result->leftJoin($table, "{$table}.id", "=", "{$joining}.{$this->joins[$request->sortCol][$i]}");

                $joining = $table;
                $i++;
            }
        }

        if($request->q) {
            $result = $result->where('car_id', $carUser->car_id)
                        ->where('quantity', '>', 0)
                        ->where(function($query) use ($request) {
                            $query->whereHas('item', function($q) use($request) {
                                $q->where('model_name', 'LIKE', "%{$request->q}%")->orWhere('id', $request->q);
                            })
                            ->orWhereHas('item.itemsManufacturer', function($q) use($request) {
                                $q->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('item.itemsCategory', function($q) use($request) {
                                $q->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('element', function($q) use($request) {
                                $q->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                            });
                        });
        } else {
            $result = $result->where('car_id', $carUser->car_id)
                        ->where('quantity', '>', 0);
        }

        if($request->sortDir && $request->sortCol) {
            $result->orderByRaw("`{$joining}`.`{$column}` {$request->sortDir}");
        }

        $data = $result->paginate($this->pagination);

        return response()->json($data, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $carsItem = CarsItem::create($request->all());

        return response()->json($carsItem, 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param CarsItem $carsItem
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function delete(CarsItem $carsItem)
    {
        $carsItem->delete();

        return response()->json(null, 204);
    }

    /**
     * Get all STB on cars
     *
     * @return \Illuminate\Http\Response
     */
    public function stb()
    {
        $result = \App\Element::with(['item'])->where('element_type', 'App\CarsItem')
            ->whereHas('item', function ($query) {
                $query->whereHas('itemsCategory', function ($query) {
                    $query->where('id', 3);
                });
        })->get();

        return response()->json($result, 200);
    }
}
