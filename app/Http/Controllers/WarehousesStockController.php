<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Validator;
use App\Warehouse;
use App\WarehousesStock;
use App\Element;
use App\WarehousesIn;

class WarehousesStockController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'item_id',
        'quantity',
        'items.model_name',
        'items.items_manufacturers.name',
        'items.items_categories.name',
        'items.units.short_name'
    ];

    protected $with = [
        'warehousesPlace',
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

    public function stock($warehouse, Request $request) {
        $stock = WarehousesStock::with($this->with);

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

            $joining = 'warehouses_stocks';

            $i = 0;

            foreach($tables as $table) {
                $stock->leftJoin($table, "{$table}.id", "=", "{$joining}.{$this->joins[$request->sortCol][$i]}");

                $joining = $table;
                $i++;
            }
        }

        if($request->q) {
            $stock = $stock->where('warehouse_id', $warehouse)
                        ->where('quantity', '>', 0)
                        ->where(function($query) use($request) {
                            $query->whereHas('item', function($q) use($request) {
                                $q->where('model_name', 'LIKE', "%{$request->q}%")->orWhere('id', $request->q);
                            })
                            ->orWhereHas('item.itemsManufacturer', function($q) use($request) {
                                $q->where('name', 'LIKE', "%{$request->q}%");
                            });
                        });
        } else {
            $stock = $stock->where('warehouse_id', $warehouse)
                        ->where('quantity', '>', 0);
        }

        if($request->sortDir && $request->sortCol) {
            $stock->orderByRaw("`{$joining}`.`{$column}` {$request->sortDir}");
        }

        $result = $stock->paginate($this->pagination);

        $warehouse = Warehouse::find($warehouse);

        return response()->json([
            'warehouse' => $warehouse,
            'items' => $result,
        ], 200);
    }

    public function search($item, $warehouse) {
        $stock = WarehousesStock::with(['item', 'item.itemsManufacturer', 'item.unit', 'element' => function($query) use ($item) {
                        $query->where('sn', 'LIKE', "%{$item}")->orWhere('mac', 'LIKE', "%{$item}");
                    }])
                    ->where('quantity', '>', 0)
                    ->where('warehouse_id', $warehouse)
                    ->where(function($query) use ($item, $warehouse) {
                        $query->where('item_id', $item)
                        ->orWhere(function($query) use ($item, $warehouse) {
                            $query->whereHas('item', function($query) use ($item) {
                                $query->where('model_name', 'LIKE', "%{$item}%");
                            });
                        })
                        ->orWhere(function($query) use ($item, $warehouse) {
                            $query->whereHas('item.itemsManufacturer', function($query) use ($item) {
                                $query->where('name', 'LIKE', "%{$item}%");
                            });
                        })
                        ->orWhere(function($query) use ($item, $warehouse) {
                            $query->whereHas('element', function($query) use ($item) {
                                $query->where('sn', 'LIKE', "%{$item}")->orWhere('mac', 'LIKE', "%{$item}");
                            });
                        });
                    })
                    ->get();

        return response()->json(['data' => $stock], 200);
    }

    public function searchRma($item) {
        $stock = WarehousesStock::with(['item', 'item.itemsManufacturer', 'item.unit', 'element' => function($query) use ($item) {
                        $query->where('sn', 'LIKE', "%{$item}")->orWhere('mac', 'LIKE', "%{$item}");
                    }])
                    ->where('quantity', '>', 0)
                    ->where(function($query) use ($item) {
                        $query->where(function($query) use ($item) {
                            $query->whereHas('element', function($query) use ($item) {
                                $query->where('sn', 'LIKE', "%{$item}")->orWhere('mac', 'LIKE', "%{$item}");
                            });
                        });
                    })
                    ->get();

        $stock->map(function($item) {
            $item->element->map(function($e) {
                $element = Element::where(['sn' => $e->sn,
                    'mac' => $e->mac,
                    'element_type' => 'App\\WarehousesInItem'])->first();

                if($element) {
                    $r = WarehousesIn::whereHas('warehousesInItem', function($query) use ($element) {
                        $query->where('id', $element->element_id);
                    })->first();

                    $e->warehouses_in = $r;
                }
            });
        });

        return response()->json(['data' => $stock], 200);
    }

    public function import(Request $request) {
        $lines = explode("\n", $request->csv);
        foreach($lines as $item) {
            $array = explode(',', $item);

            $stock = json_decode(app('App\Http\Controllers\ItemController')->search($array[0])->content())->data;

            if(count($stock) < 1 || count($stock) > 1) {
                continue;
            }

            $item_id = $stock[0]->id;
            $warehouse_id = $request->warehouse_id;
            $quantity = $array[1];

            if(!WarehousesStock::where(['item_id' => $item_id, 'warehouse_id' => $warehouse_id])->increment('quantity', $quantity)) {
                WarehousesStock::create([
                    'item_id' => $item_id,
                    'warehouse_id' => $warehouse_id,
                    'quantity' => $quantity,
                ]);
            }
        }

        return response()->json(null, 201);
    }
}
