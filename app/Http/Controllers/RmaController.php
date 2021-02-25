<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Validator;
use DB;
use App\Rma;
use App\RmasItem;
use App\RmasStock;
use App\WarehousesStock;

class RmaController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'document_name',
        'contractors.name',
        'warehouses_in.invoice_name',
        'rmas_reasons.name',
        'rma_status',
        'contractor_rma_id',
        'created_at',
        'type',
    ];

    protected $joins = [
        'contractors.name' => 'contractor_id',
        'warehouses_in.invoice_name' => 'warehouses_in_id',
        'rmas_reasons.name' => 'rmas_reason_id',
    ];

    protected $with = [
        'contractor',
        'warehousesIn',
        'rmasReason',
        'user',
    ];

    public function __construct() {
        $this->middleware('permission:rma-list');
        $this->middleware('permission:rma-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:rma-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:rma-delete', ['only' => ['delete']]);
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
                $result = Rma::with($this->with)
                            ->select('rmas.*')
                            ->leftJoin($table, "{$table}.id", "=", "rmas.{$this->joins[$column]}")
                            ->where('document_name', 'LIKE', "%{$request->q}%")
                            ->orWhere('contractor_rma_id', 'LIKE', "%{$request->q}%")
                            ->orWhereHas('contractor', function($query) use ($request) {
                                $query->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('warehousesIn', function($query) use ($request) {
                                $query->where('invoice_name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('rmasReason', function($query) use ($request) {
                                $query->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            } else {
                $result = Rma::with($this->with)
                            ->select('rmas.*')
                            ->leftJoin($table, "{$table}.id", "=", "rmas.{$this->joins[$column]}")
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            }
        } else {
            if($request->q) {
                $result = Rma::with($this->with)
                            ->where('document_name', 'LIKE', "%{$request->q}%")
                            ->orWhere('contractor_rma_id', 'LIKE', "%{$request->q}%")
                            ->orWhereHas('contractor', function($query) use ($request) {
                                $query->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('warehousesIn', function($query) use ($request) {
                                $query->where('invoice_name', 'LIKE', "%{$request->q}%");
                            })
                            ->orWhereHas('rmasReason', function($query) use ($request) {
                                $query->where('name', 'LIKE', "%{$request->q}%");
                            })
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            } else {
                $result = Rma::with($this->with)
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
        $result = Rma::with($this->with)->paginate($this->pagination);

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
            'item_id' => 'required|integer|exists:items,id',
            'item_data' => 'required|json',
            'contractor_id' => 'required|integer|exists:contractors,id',
            'rmas_reason_id' => 'required|integer|exists:rmas_reasons,id',
            'warehouses_in_id' => 'integer|exists:warehouses_in,id|nullable',
        ]);

        $data = json_decode($request->item_data)[0];

        $stock = WarehousesStock::where('item_id', $request->item_id)
                    ->where('quantity', '>', 0)
                    ->whereHas('item', function($query) use($request) {
                        $query->where('id', $request->item_id)->where('has_data', 1);
                    })
                    ->whereHas('element', function($query) use($data) {
                        $query->where('sn', $data->sn)->where('mac', $data->mac);
                    })
                    ->first();

        if(!$stock) {
            return response()->json(null, 400);
        }

        $check = Rma::where('document_id', 1)->whereYear('created_at', Carbon::now()->year)->first();

        if($check) {
            $id = Rma::whereYear('created_at', Carbon::now()->year)->max('document_id') + 1;
        } else {
            $id = 1;
        }

        $object = Rma::create([
            'document_id' => $id,
            'user_id' => auth()->user()->id,
            'contractor_id' => $request->contractor_id,
            'warehouses_in_id' => $request->warehouses_in_id,
            'rmas_reason_id' => $request->rmas_reason_id,
            'document_name' => 'RMA/'. Carbon::now()->year .'/'. $id,
            'note' => $request->note,
            'contractor_rma_id' => $request->contractor_rma_id,
            'rma_status' => 0,
            'end_status' => 0,
        ]);

        if(!$object) {
            return response()->json(null, 400);
        }

        $item = RmasItem::create([
            'rma_id' => $object->id,
            'item_id' => $request->item_id,
            'quantity' => 1,
        ]);

        if(!RmasStock::where(['item_id' => $request->item_id, 'rma_id' => $object->id])->increment('quantity', 1)) {
            $stockRma = RmasStock::create([
                'item_id' => $request->item_id,
                'rma_id' => $object->id,
                'quantity' => 1,
            ]);
        } else {
            $stockRma = RmasStock::where(['item_id' => $request->item_id, 'rma_id' => $object->id])->first();
        }

        $stock->decrement('quantity', 1);

        $item->element()->create([
            'item_id' => $item->item_id,
            'mac' => $data->mac,
            'sn' => $data->sn,
        ]);

        $stockRma->element()->create([
            'item_id' => $item->item_id,
            'mac' => $data->mac,
            'sn' => $data->sn,
        ]);

        $stock->element()->where(['mac' => $data->mac, 'sn' => $data->sn])->delete();

        return response()->json($object, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $result = RMA::with([
                        'contractor',
                        'warehousesIn',
                        'rmasReason',
                        'rmasItem' => function($query) {
                            $query->with('item', 'item.itemsManufacturer', 'item.itemsCategory', 'item.unit', 'element');
                        },
                        'rmasItemNew' => function($query) {
                            $query->with('item', 'item.itemsManufacturer', 'item.itemsCategory', 'item.unit', 'element');
                        },
                        'user'
                    ])
                    ->where('id', $id)->first();

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
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'rma_status' => 'required|integer',
        ]);

        $object = Rma::find($id);

        if($request->rma_status == $object->rma_status) {
            return response()->json(null, 400);
        }

        switch($request->rma_status) {
            case 0:
                break;
            case 1:
                $object->sent_at = (new \DateTime())->format('Y-m-d H:i:s');
                $object->rma_status = 1;
                $object->note = $request->note;
                $object->save();

                return response()->json($object, 200);
            case 2:
                $object->received_at = (new \DateTime())->format('Y-m-d H:i:s');
                $object->rma_status = 2;
                $object->note = $request->note;
                $object->end_status = $request->end_status;
                $object->warehouse_id = $request->warehouse_id;
                $object->new_invoice = $request->new_invoice;
                $object->save();

                $item = $object->rmasItem()->first();

                $request->merge(['sn' => $request->sn !== null ? $request->sn : '']);
                $request->merge(['mac' => $request->mac !== null ? $request->mac : '']);

                if(in_array($request->end_status, [0, 1, 3])) {
                    $stock = WarehousesStock::where(['item_id' => $item->item_id, 'warehouse_id' => $request->warehouse_id])->first();

                    if(!$stock) {
                        $stock = WarehousesStock::create([
                            'item_id' => $item->item_id,
                            'warehouse_id' => $request->warehouse_id,
                            'quantity' => 1,
                        ]);
                    } else {
                        $stock->increment('quantity', 1);
                    }

                    $stock->element()->create([
                        'item_id' => $item->item_id,
                        'sn' => $request->end_status === '1' ? $request->sn : $item->element()->first()->sn,
                        'mac' => $request->end_status === '1' ? $request->mac : $item->element()->first()->mac,
                    ]);
                }

                if($request->end_status === '1') {
                    $itemNew = RmasItem::create([
                        'rma_id' => $object->id,
                        'item_id' => $item->item_id,
                        'quantity' => 1,
                        'new' => true,
                    ]);

                    $itemNew->element()->create([
                        'item_id' => $item->item_id,
                        'sn' => $request->sn,
                        'mac' => $request->mac,
                    ]);
                }

                $stockRma = $object->rmasStock()->first();
                $stockRma->decrement('quantity', 1);
                $stockRma->element()->where([
                    'sn' => $request->end_status === '1' ? $request->sn : $item->element()->first()->sn,
                    'mac' => $request->end_status === '1' ? $request->mac : $item->element()->first()->mac,
                ])->delete();

                return response()->json($object, 200);
        }

        return response()->json(null, 400);
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
        $data = \App\Rma::with([
                'contractor',
                'warehousesIn',
                'rmasReason',
                'rmasItem' => function($query) {
                    $query->with('item', 'item.itemsManufacturer', 'item.itemsCategory', 'item.unit', 'element');
                },
                'rmasItemNew' => function($query) {
                    $query->with('item', 'item.itemsManufacturer', 'item.itemsCategory', 'item.unit', 'element');
                },
                'user'
            ])
            ->where('id', $id)
            ->first();

        return base64_encode(app('App\Pdf')->create('pdf.rma', compact('data')));
    }
}
