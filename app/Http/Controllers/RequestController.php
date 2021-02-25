<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Request as Req;
use App\RequestsItem as ReqItem;
use App\RequestsItem;
use App\Item;
use Illuminate\Validation\Rule;
use Validator;
use DB;

class RequestController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'users.name',
        'cars.name',
        'document_name',
        'created_at',
        'date',
    ];

    protected $joins = [
        'users.name' => 'user_id',
        'cars.name' => 'car_id',
    ];

    protected $with = [
        'user',
        'car',
    ];

    public function __construct() {
        $this->middleware('permission:request-list');
        $this->middleware('permission:request-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:request-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:request-delete', ['only' => ['delete']]);
    }

    public function sort($direction, $column) {
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

        switch($direction) {
            case 'asc':
                if(isset($table)) {
                    $items = Req::with($this->with)
                        ->select('requests.*')
                        ->where(function($query) {
                            if(!auth()->user()->can('request-approve')) {
                                $query->where('user_id', auth()->user()->id);
                            }
                        })
                        ->withCount('requestsItem')
                        ->leftJoin($table, "{$table}.id", "=", "requests.{$this->joins[$column]}")
                        ->orderBy('approved', 'ASC')
                        ->orderByRaw(preg_replace('/{.*/', '', $column) ." ASC")
                        ->paginate($this->pagination);
                } else {
                    $items = Req::with($this->with)
                        ->where(function($query) {
                            if(!auth()->user()->can('request-approve')) {
                                $query->where('user_id', auth()->user()->id);
                            }
                        })
                        ->withCount('requestsItem')
                        ->orderBy('approved', 'ASC')
                        ->orderByRaw(isset($this->extra[$column]) ? $this->extra[$column] : $column .' ASC')
                        ->paginate($this->pagination);
                }

                break;
            case 'desc':
                if(isset($table)) {
                    $items = Req::with($this->with)
                        ->select('requests.*')
                        ->where(function($query) {
                            if(!auth()->user()->can('request-approve')) {
                                $query->where('user_id', auth()->user()->id);
                            }
                        })
                        ->withCount('requestsItem')
                        ->leftJoin($table, "{$table}.id", "=", "requests.{$this->joins[$column]}")
                        ->orderBy('approved', 'ASC')
                        ->orderByRaw(preg_replace('/{.*/', '', $column) ." DESC")
                        ->paginate($this->pagination);
                } else {
                    $items = Req::with($this->with)
                        ->where(function($query) {
                            if(!auth()->user()->can('request-approve')) {
                                $query->where('user_id', auth()->user()->id);
                            }
                        })
                        ->withCount('requestsItem')
                        ->orderBy('approved', 'ASC')
                        ->orderByRaw(isset($this->extra[$column]) ? $this->extra[$column] : $column .' DESC')
                        ->paginate($this->pagination);
                }

                break;
        }

        return response()->json($items, 200);
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // verify
        if(!(count($request->items) > 0)) {
            return response()->json(null, 400);
        }

        $request->validate([
            'warehouse_id' => 'required|integer|exists:warehouses,id',
            'car_id' => 'sometimes|integer|exists:cars,id',
            'items.*.item_id' => 'required|integer|exists:items,id',
            'items.*.quantity' => 'required|integer',
        ]);

        $check = Req::where('document_id', 1)->whereYear('created_at', Carbon::now()->year)->first();

        if($check) {
            $id = Req::whereYear('created_at', Carbon::now()->year)->max('document_id') + 1;
        } else {
            $id = 1;
        }

        // add
        $result = Req::create([
            'document_id' => $id,
            'warehouse_id' => $request->warehouse_id,
            'car_id' => auth()->user()->can('investment-create') ? $request->car_id : null,
            'user_id' => auth()->user()->id,
            'document_name' => 'ZAP/'. Carbon::now()->year .'/'. $id,
            'date' => date('Y-m-d', strtotime($request->date)),
            'notes' => $request->notes,
            'approved' => 0,
        ]);

        foreach($request->items as $item) {
            $item = (object) $item;

            $result->requestsItem()->create([
                'item_id' => $item->item_id,
                'quantity' => $item->quantity,
            ]);
        }

        foreach(\App\User::permission('request-approve')->get() as $user) {
            try {
                $user->notify(new \App\Notifications\NewRequestNotification($result->load('user')));
            } catch(\Illuminate\Broadcasting\BroadcastException $e) {
                report($e);
            }
        }

        return response()->json($result, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $result = Req::with(['user', 'warehouse', 'requestsItem', 'requestsItem.item', 'requestsItem.item.itemsManufacturer', 'requestsItem.item.unit', 'requestsItem.item.quantity', 'car'])
            ->find($id);

        return response()->json($result, 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function edit($id)
    {
        $result = Req::with(['user', 'warehouse', 'requestsItem', 'requestsItem.item', 'requestsItem.item.itemsManufacturer', 'requestsItem.item.unit', 'requestsItem.item.quantity', 'car'])
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
    public function update(Request $request, $id)
    {
        if(isset($request->approved)) {
            if(!auth()->user()->can('request-approve')) {
                return response()->json(null, 403);
            }

            $request->validate([
                'approved' => 'required|in:0,1',
            ]);

            $r = Req::find($id);

            $r->update([
                'approved' => $request->approved,
            ]);

            try {
                \App\User::find($r->user_id)->notify(new \App\Notifications\ApprovedRequestNotification($r));
            } catch(\Illuminate\Broadcasting\BroadcastException $e) {
                report($e);
            }

            return response()->json($r, 200);
        }

        if(!(count($request->items) > 0)) {
            return response()->json(null, 400);
        }

        $request->validate([
            'warehouse_id' => 'required|integer|exists:warehouses,id',
            'car_id' => 'sometimes|integer|exists:cars,id',
            'items.*.item_id' => 'required|integer|exists:items,id',
            'items.*.quantity' => 'required|integer',
        ]);

        $object = Req::find($id);

        if(!$object) {
            return response()->json(null, 400);
        }

        if($object->approved) {
            return response()->json(null, 400);
        }

        // add
        $object->update([
            'car_id' => auth()->user()->can('investment-create') ? $request->car_id : $object->car_id,
            'warehouse_id' => $request->warehouse_id,
            'date' => date('Y-m-d', strtotime($request->date)),
            'notes' => $request->notes,
            'approved' => 0,
        ]);

        $object->requestsItem()->delete();

        foreach($request->items as $item) {
            $item = (object) $item;

            $object->requestsItem()->create([
                'item_id' => $item->item_id,
                'quantity' => $item->quantity,
            ]);
        }

        return response()->json($object, 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $object = Req::find($id);

        if(!$object) {
            return response()->json(null, 400);
        }

        if($object->approved) {
            return response()->json(null, 400);
        }

        $object->requestsItem()->delete();
        $object->delete();

        return response()->json(null, 200);
    }

    public function document($id) {
        $data = Req::with([
                'warehouse',
                'user',
                'requestsItem' => function($query) {
                    $query->where('quantity', '>', 0);
                },
                'requestsItem.item',
                'requestsItem.item.itemsManufacturer',
                'requestsItem.item.itemsCategory',
                'requestsItem.item.unit',
            ])
            ->where('id', $id)
            ->first();

        return base64_encode(app('App\Pdf')->create('pdf.request', compact('data')));
    }
}
