<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Element;
use App\WarehousesIn;
use App\WarehousesInItem;
use App\WarehousesImport;
use App\WarehousesImportsItem;
use App\WarehousesStock;
use App\Tax;
use App\Item;
use Illuminate\Validation\Rule;
use Validator;
use DB;

class WarehousesInController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'contractors.name',
        'users.name',
        'warehouses.name',
        'document_name',
        'invoice_name',
        'invoice_date',
        'created_at',
    ];

    protected $joins = [
        'contractors.name' => 'contractor_id',
        'users.name' => 'user_id',
        'warehouses.name' => 'warehouse_id',
    ];

    protected $with = [
        'contractor',
        'warehouse',
        'user',
        'price',
    ];

    public function __construct() {
        $this->middleware('permission:warehousesIn-list');
        $this->middleware('permission:warehousesIn-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:warehousesIn-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:warehousesIn-delete', ['only' => ['delete']]);
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
                $result = WarehousesIn::with($this->with)
                    ->select('warehouses_in.*')
                    ->leftJoin($table, "{$table}.id", "=", "warehouses_in.{$this->joins[$column]}")
                    ->where('document_name', 'LIKE', "%{$request->q}%")
                    ->orWhere('invoice_name', 'LIKE', "%{$request->q}%")
                    ->orWhere('invoice_date', 'LIKE', "%{$request->q}%")
                    ->orWhereHas('warehouse', function($query) use ($request) {
                        $query->where('name', 'LIKE', "%{$request->q}%");
                    })
                    ->orWhereHas('contractor', function($query) use ($request) {
                        $query->where('name', 'LIKE', "%{$request->q}%");
                    })
                    ->orWhereHas('user', function($query) use ($request) {
                        $query->where('name', 'LIKE', "%{$request->q}%");
                    })
                    ->orWhereHas('warehousesInItem.item', function($query) use ($request) {
                        $query->where('model_name', 'LIKE', "%{$request->q}%")->orWhere('id', $request->q);
                    })
                    ->orWhereHas('warehousesInItem.element', function($query) use ($request) {
                        $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                    })
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            } else {
                $result = WarehousesIn::with($this->with)
                    ->select('warehouses_in.*')
                    ->leftJoin($table, "{$table}.id", "=", "warehouses_in.{$this->joins[$column]}")
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            }
        } else {
            if($request->q) {
                $result = WarehousesIn::with($this->with)
                    ->where('document_name', 'LIKE', "%{$request->q}%")
                    ->orWhere('invoice_name', 'LIKE', "%{$request->q}%")
                    ->orWhere('invoice_date', 'LIKE', "%{$request->q}%")
                    ->orWhereHas('warehouse', function($query) use ($request) {
                        $query->where('name', 'LIKE', "%{$request->q}%");
                    })
                    ->orWhereHas('contractor', function($query) use ($request) {
                        $query->where('name', 'LIKE', "%{$request->q}%");
                    })
                    ->orWhereHas('user', function($query) use ($request) {
                        $query->where('name', 'LIKE', "%{$request->q}%");
                    })
                    ->orWhereHas('warehousesInItem.item', function($query) use ($request) {
                        $query->where('model_name', 'LIKE', "%{$request->q}%")->orWhere('id', $request->q);
                    })
                    ->orWhereHas('warehousesInItem.element', function($query) use ($request) {
                        $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                    })
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            } else {
                $result = WarehousesIn::with($this->with)
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
        $result = WarehousesIn::with($this->with)->paginate($this->pagination);

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
        $request->merge(['items' => json_decode($request->items, true)]);

        if(!(count($request->items) > 0)) {
            return response()->json(null, 400);
        }

        foreach($request->items as $item) {
            $item = (object) $item;

            foreach(json_decode($item->data) as $data) {
                $data->sn = strtolower($data->sn);
                $data->mac = strtolower($data->mac);

                $result = Element::where('element_type', 'App\WarehousesStock')
                    ->where('item_id', $item->item_id)
                    ->whereRaw("LOWER(`sn`) LIKE '{$data->sn}'")
                    ->whereRaw("LOWER(`mac`) LIKE '{$data->mac}'")
                    ->first();

                if($result) {
                    return response()->json(null, 400);
                }
            }
        }

        if($request->import_only) {
            $request->validate([
                'warehouse_id' => 'required|integer',
                'items.*.item_id' => 'required|integer',
                'items.*.quantity' => 'required|integer',
                'items.*.data' => 'required',
            ]);

            $warehousesImport = WarehousesImport::create([
                'warehouse_id' => $request->warehouse_id,
                'user_id' => auth()->user()->id,
                'notes' => $request->notes,
            ]);

            foreach($request->items as $item) {
                $item = (object) $item;

                $warehousesImportsItem = WarehousesImportsItem::create([
                    'warehouses_import_id' => $warehousesImport->id,
                    'item_id' => $item->item_id,
                    'quantity' => $item->quantity,
                ]);

                if(!WarehousesStock::where(['item_id' => $item->item_id, 'warehouse_id' => $request->warehouse_id])->increment('quantity', $item->quantity)) {
                    $stock = WarehousesStock::create([
                        'item_id' => $item->item_id,
                        'warehouse_id' => $request->warehouse_id,
                        'quantity' => $item->quantity,
                    ]);
                } else {
                    $stock = WarehousesStock::where(['item_id' => $item->item_id, 'warehouse_id' => $request->warehouse_id])->first();
                }

                $itemObj = Item::find($item->item_id);

                if(!$itemObj->has_data) {
                    continue;
                }

                foreach(json_decode($item->data) as $data) {
                    $warehousesImportsItem->element()->create([
                        'item_id' => $item->item_id,
                        'mac' => $data->mac,
                        'sn' => $data->sn,
                    ]);

                    $stock->element()->create([
                        'item_id' => $item->item_id,
                        'mac' => $data->mac,
                        'sn' => $data->sn,
                    ]);
                }
            }

            return response()->json($warehousesImport, 201);
        } else {
            $request->validate([
                'contractor_id' => 'required|integer',
                'warehouse_id' => 'required|integer',
                'document_name' => 'required',
                'file.*' => 'mimes:pdf,jpg,jpeg,bmp,png',
                'items.*.item_id' => 'required|integer',
                'items.*.tax_id' => 'required|integer',
                'items.*.price_notax' => 'required',
                'items.*.quantity' => 'required|integer',
                'items.*.data' => 'required',
            ]);

            $check = WarehousesIn::where('document_id', 1)->whereYear('created_at', Carbon::now()->year)->first();

            if($check) {
                $id = WarehousesIn::whereYear('created_at', Carbon::now()->year)->max('document_id') + 1;
            } else {
                $id = 1;
            }

            $warehousesIn = WarehousesIn::create([
                'document_id' => $id,
                'contractor_id' => $request->contractor_id,
                'warehouse_id' => $request->warehouse_id,
                'user_id' => auth()->user()->id,
                'invoice_name' => $request->document_name,
                'invoice_date' => date('Y-m-d', strtotime($request->invoice_date)),
                'document_name' => 'PZ/'. Carbon::now()->year .'/'. $id,
                'notes' => $request->notes,
            ]);

            if($request->file('file')) {
                foreach($request->file('file') as $file) {
                    $name = $file->getClientOriginalName();
                    $path = $file->store('files', 'local');

                    $warehousesIn->file()->create([
                        'name' => $name,
                        'path' => $path,
                    ]);
                }
            }

            foreach($request->items as $item) {
                $item = (object) $item;

                $warehousesInItem = WarehousesInItem::create([
                    'warehouses_in_id' => $warehousesIn->id,
                    'item_id' => $item->item_id,
                    'tax_id' => $item->tax_id,
                    'price_notax' => $item->price_notax,
                    'price_withtax' => round((float) ((Tax::find($item->tax_id)->first()->multipler/100)+1) * (float) $item->price_notax, 2),
                    'quantity' => $item->quantity,
                ]);

                if(!WarehousesStock::where(['item_id' => $item->item_id, 'warehouse_id' => $request->warehouse_id])->increment('quantity', $item->quantity)) {
                    $stock = WarehousesStock::create([
                        'item_id' => $item->item_id,
                        'warehouse_id' => $request->warehouse_id,
                        'quantity' => $item->quantity,
                    ]);
                } else {
                    $stock = WarehousesStock::where(['item_id' => $item->item_id, 'warehouse_id' => $request->warehouse_id])->first();
                }

                $itemObj = Item::find($item->item_id);

                if(!$itemObj->has_data) {
                    continue;
                }

                foreach(json_decode($item->data) as $data) {
                    $warehousesInItem->element()->create([
                        'item_id' => $item->item_id,
                        'mac' => $data->mac,
                        'sn' => $data->sn,
                    ]);

                    $stock->element()->create([
                        'item_id' => $item->item_id,
                        'mac' => $data->mac,
                        'sn' => $data->sn,
                    ]);
                }
            }

            return response()->json($warehousesIn, 201);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $result = WarehousesIn::with(['contractor', 'warehouse', 'user', 'warehousesInItem', 'warehousesInItem.item', 'warehousesInItem.item.itemsManufacturer', 'warehousesInItem.tax', 'warehousesInItem.element', 'warehousesInItem.item.unit', 'file'])
            ->find($id);

        return response()->json($result, 200);
    }

    public function edit($id) {
        $result = WarehousesIn::with(['contractor', 'warehouse', 'user', 'warehousesInItem', 'warehousesInItem.item', 'warehousesInItem.item.itemsManufacturer', 'warehousesInItem.tax', 'warehousesInItem.element', 'warehousesInItem.item.unit', 'file'])
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
    public function update(Request $request, WarehousesIn $object)
    {
        $request->validate([
            'contractor_id' => 'required|integer|exists:contractors,id',
            'document_name' => 'required',
            'invoice_date' => 'required|date',
            'items.*.id' => 'required|integer|exists:warehouses_in_items,id',
            'items.*.tax_id' => 'required|integer|exists:taxes,id',
            'items.*.price_notax' => 'required',
        ]);

        foreach($request->items as $item) {
            $item = (object) $item;

            $object->warehousesInItem()->where('id', $item->id)->update([
                'tax_id' => $item->tax_id,
                'price_notax' => $item->price_notax,
                'price_withtax' => (float) ((Tax::find($item->tax_id)->first()->multipler/100)+1) * (float) $item->price_notax,
            ]);
        }

        $object->update([
            'contractor_id' => $request->contractor_id,
            'invoice_name' => $request->document_name,
            'invoice_date' => $request->invoice_date,
            'notes' => $request->notes,
        ]);

        return response()->json($object, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(WarehousesIn $warehousesIn)
    {
        if(!$warehousesIn) {
            return response()->json(null, 410);
        }

        try {
            $warehousesIn->delete();
        } catch(\Exception $e) {
            return response()->json(null, 409);
        }

        return response()->json(null, 204);
    }

    public function document($id) {
        $data = \App\WarehousesIn::with(['contractor', 'warehouse', 'user', 'warehousesInItem', 'warehousesInItem.item', 'warehousesInItem.item.itemsManufacturer', 'warehousesInItem.tax', 'warehousesInItem.element', 'warehousesInItem.item.unit'])
            ->where('id', $id)
            ->first();

        return base64_encode(app('App\Pdf')->create('pdf.warehousesIn', compact('data')));
    }
}
