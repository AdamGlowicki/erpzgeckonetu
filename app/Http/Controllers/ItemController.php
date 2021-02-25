<?php

namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Item;
use App\WarehousesStock;
use App\WarehousesIn;
use App\Element;

class ItemController extends Controller
{
    protected $pagination = 50;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'model_name',
        'items_manufacturers.name',
        'items_categories.name',
        'low_quant',
        'units.name',
    ];

    protected $joins = [
        'items_manufacturers.name' => 'items_manufacturer_id',
        'items_categories.name' => 'items_category_id',
        'units.name' => 'unit_id',
    ];

    protected $with = [
        'itemsCategory',
        'itemsManufacturer',
        'unit',
        'avgPrice',
        'quantity',
        'quantityCars',
    ];

    public function __construct() {
        $this->middleware('permission:item-list');
        $this->middleware('permission:item-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:item-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:item-delete', ['only' => ['delete']]);
    }

    public function stock($id) {
        $result = Item::with([
            'unit',
            'itemsManufacturer',
            'itemsCategory',
            'warehousesStock' => function($query) {
                $query->where('quantity', '>', 0);
            },
            'warehousesStock.warehouse',
            'warehousesStock.warehouse.warehousesPlace' => function($query) use($id) {
                $query->where('item_id', $id);
            },
            'warehousesStock.element',
            'warehousesInItem' => function($query) {
                $query->latest()->limit(10);
            },
            'warehousesInItem.warehousesIn',
            'warehousesInItem.warehousesIn.warehouse',
            'warehousesInItem.warehousesIn.contractor',
            'warehousesInItem.warehousesIn.user',
        ])
        ->where('id', $id)
        ->first();

        return response()->json($result, 200);
    }

    public function stockElements($stock) {
        $result = WarehousesStock::with(['element', 'item'])
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

    public function search($str) {
        $items = Item::with($this->with)
            ->whereNull('parent_id')
            ->where(function($query) use ($str) {
                $query->where('id', '=', "{$str}")
                    ->orWhere('model_name', 'LIKE', "%{$str}%")
                    ->orWhereHas('itemsManufacturer', function($query) use ($str) {
                        $query->where('name', 'LIKE', "%{$str}%");
                    });
            })
            ->get();

        return response()->json(['data' => $items], 200);
    }

    public function all() {
        $items = Item::with($this->with)
                    ->get();

        return response()->json($items, 200);
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
                $items = Item::with($this->with)
                    ->select('items.*')
                    ->leftJoin($table, "{$table}.id", "=", "items.{$this->joins[$column]}")
                    ->parentsOnly()
                    ->where('items.model_name', 'LIKE', "%{$request->q}%")
                    ->orWhere('items.id', 'LIKE', $request->q)
                    ->orWhereHas('itemsManufacturer', function($query) use ($request) {
                        $query->where('name', 'LIKE', "%{$request->q}%");
                    })
                    ->orWhereHas('itemsCategory', function($query) use ($request) {
                        $query->where('name', 'LIKE', "%{$request->q}%");
                    })
                    ->orWhereHas('warehousesStock.element', function($query) use ($request) {
                        $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                    });

                if(!$request->hidden) {
                    $items = $items->withoutHidden();
                }

                $items = $items->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            } else {
                $items = Item::with($this->with)
                    ->select('items.*')
                    ->leftJoin($table, "{$table}.id", "=", "items.{$this->joins[$column]}")
                    ->parentsOnly();

                if(!$request->hidden) {
                    $items = $items->withoutHidden();
                }

                $items = $items
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            }
        } else {
            if($request->q) {
                $items = Item::with($this->with)
                    ->parentsOnly()
                    ->where('items.model_name', 'LIKE', "%{$request->q}%")
                    ->orWhere('items.id', 'LIKE', $request->q)
                    ->orWhereHas('itemsManufacturer', function($query) use ($request) {
                        $query->where('name', 'LIKE', "%{$request->q}%");
                    })
                    ->orWhereHas('itemsCategory', function($query) use ($request) {
                        $query->where('name', 'LIKE', "%{$request->q}%");
                    })
                    ->orWhereHas('warehousesStock.element', function($query) use ($request) {
                        $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                    });

                if(!$request->hidden) {
                    $items = $items->withoutHidden();
                }

                $items = $items->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            } else {
                $items = Item::with($this->with)
                    ->parentsOnly();

                if(!$request->hidden) {
                    $items = $items->withoutHidden();
                }

                $items = $items->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            }
        }

        return response()->json($items, 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $result = Item::with($this->with)
            ->parentsOnly()
            ->where('model_name', 'LIKE', "%{$request->q}%")
            ->orWhere('id', 'LIKE', $request->q)
            ->orWhereHas('itemsManufacturer', function($query) use ($request) {
                $query->where('name', 'LIKE', "%{$request->q}%");
            })
            ->orWhereHas('itemsCategory', function($query) use ($request) {
                $query->where('name', 'LIKE', "%{$request->q}%");
            })
            ->orWhereHas('warehousesStock.element', function($query) use ($request) {
                $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
            });

        if(!$request->hidden) {
            $result = $result->withoutHidden();
        }

        $result = $result->paginate($this->pagination);

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
            'model_name' => 'required|string',
            'parent_id' => 'nullable|integer|exists:items,id',
            'items_category_id' => 'required|integer|exists:items_categories,id',
            'items_manufacturer_id' => 'required|integer|exists:items_manufacturers,id',
            'unit_id' => 'required|integer|exists:units,id',
            'hidden' => 'required|boolean',
            'low_quant' => 'required|integer|min:0',
            'has_data' => 'required|boolean',
        ]);

        if($request->photo) {
            $request->validate([
                'photo' => 'mimes:jpeg,png,jpg,gif,webp|max:3072',
                'parent_id' => 'nullable|integer|exists:items,id',
            ]);
        }

        $item = Item::create($request->all());

        if($request->photo) {
            $path = $request->file('photo')->store('items');
            $item->photo = $path;
            $item->save();
        }

        return response()->json($item, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $result = Item::with($this->with)
                    ->find($id);

        return response()->json($result, 200);
    }

    public function edit($id)
    {
        $result = Item::all()->find($id);

        return response()->json($result, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Item $item)
    {
        if($request->photo) {
            $request->validate([
                'photo' => 'mimes:jpeg,png,jpg,gif,webp|max:3072',
                'parent_id' => 'nullable|integer|exists:items,id',
            ]);
        }

        $item->update($request->all());

        if($request->photo) {
            $path = $request->file('photo')->store('items');
            $item->photo = $path;
            $item->save();
        }

        return response()->json($item, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(Item $item)
    {
        try {
            $item->delete();
        } catch(\Exception $e) {
            return response()->json(null, 409);
        }

        return response()->json(null, 204);
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
            'items.*.items_manufacturer_id' => 'required|integer|exists:items_manufacturers,id',
            'items.*.model_name' => 'required',
            'items.*.items_category_id' => 'required|integer|exists:items_categories,id',
            'items.*.unit_id' => 'required|integer|exists:units,id',
            'items.*.low_quant' => 'required|integer|gte:0',
            'items.*.has_data' => 'required|integer|in:0,1',
        ]);

        foreach($request->items as $item) {
            $item = (object) $item;

            Item::create([
                'items_manufacturer_id' => $item->items_manufacturer_id,
                'model_name' => $item->model_name,
                'items_category_id' => $item->items_category_id,
                'unit_id' => $item->unit_id,
                'low_quant' => $item->low_quant,
                'has_data' => $item->has_data,
            ]);
        }

        return response()->json(null, 201);
    }

    public function document() {
        $template = file_get_contents(resource_path('pdf/item.blade.php'));

        $element = Item::with(['itemsManufacturer', 'itemsCategory', 'unit'])
            ->select('items.*')
            ->leftJoin('items_categories', 'items_categories.id', '=', 'items_category_id')
            ->orderBy('items_categories.name', 'asc')
            ->orderBy('model_name', 'asc')
            ->get()
            ->toArray();

        $data['date'] = date('Y-m-d H:i:s');
        $data['username'] = auth()->user()->name;

        $category = null;

        $out = preg_replace_callback('/{([a-zA-Z0-9._]*)}/mU', function($matches) use($element, $category, $data) {
            $match = $matches[1];

            switch($match) {
                case 'elements':
                    $str = '';

                    foreach($element as $item) {
                        if($category !== null && $category !== $item['items_category']['id']) {
                            $str .= "<tr><td colspan=\"6\" style=\"padding: 0; border-top-color: rgba(34, 42, 66, 0.2); border-top-width: 3px;\"></td></tr>";
                        }

                        $category = $item['items_category']['id'];

                        $str .= "<tr>
                            <td>{$item['id']}</td>
                            <td>{$item['items_category']['name']}</td>
                            <td>{$item['items_manufacturer']['name']}</td>
                            <td>{$item['model_name']}</td>
                            <td>{$item['unit']['short_name']}</td>
                        </tr>";
                    }

                    return $str;
                default:
                    return \Helpers::value($match, $data);
            }

        }, $template);

        return base64_encode(app('App\Pdf')->create($out));
    }
}
