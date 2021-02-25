<?php

namespace App\Http\Controllers;

use App\Item;
use App\Tax;
use App\WarehousesImport;
use App\WarehousesIn;
use App\WarehousesInItem;
use App\WarehousesStock;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Validator;

class WarehousesImportController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'users.name',
        'warehouses.name',
        'created_at',
    ];

    protected $joins = [
        'users.name' => 'user_id',
        'warehouses.name' => 'warehouse_id',
    ];

    protected $with = [
        'warehouse',
        'user',
    ];

    public function __construct() {
        $this->middleware('permission:warehousesImport-list');
        $this->middleware('permission:warehousesImport-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:warehousesImport-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:warehousesImport-delete', ['only' => ['delete']]);
    }

    /**
     * Display a listing of the resource using sorting
     *
     * @return \Illuminate\Http\JsonResponse
     */
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
                $result = WarehousesImport::with($this->with)
                    ->select('warehouses_imports.*')
                    ->leftJoin($table, "{$table}.id", "=", "warehouses_imports.{$this->joins[$column]}")
                    ->orWhereHas('warehouse', function($query) use ($request) {
                        $query->where('name', 'LIKE', "%{$request->q}%");
                    })
                    ->orWhereHas('user', function($query) use ($request) {
                        $query->where('name', 'LIKE', "%{$request->q}%");
                    })
                    ->orWhereHas('warehousesImportsItem.item', function($query) use ($request) {
                        $query->where('model_name', 'LIKE', "%{$request->q}%")->orWhere('id', $request->q);
                    })
                    ->orWhereHas('warehousesImportsItem.element', function($query) use ($request) {
                        $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                    })
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            } else {
                $result = WarehousesImport::with($this->with)
                    ->select('warehouses_imports.*')
                    ->leftJoin($table, "{$table}.id", "=", "warehouses_imports.{$this->joins[$column]}")
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            }
        } else {
            if($request->q) {
                $result = WarehousesImport::with($this->with)
                    ->orWhereHas('warehouse', function($query) use ($request) {
                        $query->where('name', 'LIKE', "%{$request->q}%");
                    })
                    ->orWhereHas('user', function($query) use ($request) {
                        $query->where('name', 'LIKE', "%{$request->q}%");
                    })
                    ->orWhereHas('warehousesImportsItem.item', function($query) use ($request) {
                        $query->where('model_name', 'LIKE', "%{$request->q}%")->orWhere('id', $request->q);
                    })
                    ->orWhereHas('warehousesImportsItem.element', function($query) use ($request) {
                        $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                    })
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            } else {
                $result = WarehousesImport::with($this->with)
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
        $result = WarehousesImport::with($this->with)
            ->paginate(25);

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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $relations = ['warehousesImportsItem', 'warehousesImportsItem.item', 'warehousesImportsItem.item.itemsCategory', 'warehousesImportsItem.item.itemsManufacturer', 'warehousesImportsItem.item.unit', 'warehousesImportsItem.element'];

        foreach($relations as $relation) {
            $this->with[] = $relation;
        }

        $result = WarehousesImport::with($this->with)
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

    /**
     * Converts import to PZ
     *
     * @param int $id
     * @param $contractor
     * @param $warehouse
     * @param $invoice_name
     * @param $invoice_date
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function changeToWarehousesIn($id, $contractor, $warehouse, $invoice_name, $invoice_date)
    {
        $object = WarehousesImport::with([
                'warehousesImportsItem',
                'warehousesImportsItem.item',
                'warehousesImportsItem.item.itemsCategory',
                'warehousesImportsItem.item.itemsManufacturer',
                'warehousesImportsItem.item.unit',
                'warehousesImportsItem.element'
            ])
            ->where('id', $id)
            ->first();

        if(!$object) {
            return response()->json(null, 200);
        }

        $check = WarehousesIn::where('document_id', 1)->whereYear('created_at', Carbon::now()->year)->first();

        if($check) {
            $id = WarehousesIn::whereYear('created_at', Carbon::now()->year)->max('document_id') + 1;
        } else {
            $id = 1;
        }

        $result = WarehousesIn::create([
            'document_id' => $id,
            'contractor_id' => $contractor,
            'warehouse_id' => $warehouse,
            'user_id' => 1,
            'invoice_name' => $invoice_name,
            'invoice_date' => date('Y-m-d', strtotime($invoice_date)),
            'document_name' => 'PZ/'. Carbon::now()->year .'/'. $id,
            'notes' => '',
        ]);

        foreach($object->warehousesImportsItem as $item) {
            $item = (object) $item;

            $warehousesInItem = WarehousesInItem::create([
                'warehouses_in_id' => $result->id,
                'item_id' => $item->item_id,
                'tax_id' => 1,
                'price_notax' => 0.00,
                'price_withtax' => 0.00,
                'quantity' => $item->quantity,
            ]);

            $itemObj = Item::find($item->item_id);

            if(!$itemObj->has_data) {
                $item->delete();

                continue;
            }

            foreach($item->element as $data) {
                $warehousesInItem->element()->create([
                    'item_id' => $item->item_id,
                    'mac' => $data->mac,
                    'sn' => $data->sn,
                ]);

                $data->delete();
            }

            $item->delete();
        }

        $object->delete();

        return response()->json(null, 200);
    }
}
