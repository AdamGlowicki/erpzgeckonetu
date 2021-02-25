<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Validator;
use DB;
use App\Item;
use App\CarsMove;
use App\CarsMovesItem;
use App\CarsUser;
use App\CarsItem;
use App\Element;

class CarsMoveController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'cars.name{car_in}',
        'cars.name{car_out}',
        'users.name{user_in}',
        'users.name{user_out}',
        'document_name',
        'created_at',
    ];

    protected $joins = [
        'users.name{user_in}' => 'user_in_id',
        'users.name{user_out}' => 'user_out_id',
        'cars.name{car_in}' => 'car_in_id',
        'cars.name{car_out}' => 'car_out_id',
    ];

    protected $with = [
        'car_in',
        'car_out',
        'user_in',
        'user_out',
    ];

    public function __construct() {
        $this->middleware('permission:carsMove-list');
        $this->middleware('permission:carsMove-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:carsMove-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:carsMove-delete', ['only' => ['delete']]);
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
            $result = CarsMove::with($this->with)
                ->select('cars_moves.*')
                ->withCount('carsMovesItem')
                ->where(function($query) {
                    if(!auth()->user()->can('carsMove-all')) {
                        $query->where('user_in_id', auth()->user()->id)
                            ->orWhere('user_out_id', auth()->user()->id);
                    }
                });

            if($request->q) {
                $result = $result->where(function($query) use ($request) {
                    $query->where('id', $request->q)
                        ->orWhere('document_name', 'LIKE', "%{$request->q}%")
                        ->orWhereHas('user_in', function($query) use ($request) {
                            $query->where('name', 'LIKE', "%{$request->q}%");
                        })
                        ->orWhereHas('user_out', function($query) use ($request) {
                            $query->where('name', 'LIKE', "%{$request->q}%");
                        })
                        ->orWhereHas('car_in', function($query) use ($request) {
                            $query->where('name', 'LIKE', "%{$request->q}%")->orWhere('registration', 'LIKE', "%{$request->q}%");
                        })
                        ->orWhereHas('car_out', function($query) use ($request) {
                            $query->where('name', 'LIKE', "%{$request->q}%")->orWhere('registration', 'LIKE', "%{$request->q}%");
                        });
                });
            }

            $result = $result->leftJoin($table, "{$table}.id", "=", "cars_moves.{$this->joins[$column]}")
                ->orderByRaw(preg_replace('/{.*/', '', $column) ." {$direction}")
                ->paginate($this->pagination);
        } else {
            $result = CarsMove::with($this->with)
                ->withCount('carsMovesItem')
                ->where(function($query) {
                    if(!auth()->user()->can('carsMove-all')) {
                        $query->where('user_in_id', auth()->user()->id)
                            ->orWhere('user_out_id', auth()->user()->id);
                    }
                });

            if($request->q) {
                $result = $result->where(function($query) use ($request) {
                    $query->where('id', $request->q)
                        ->orWhere('document_name', 'LIKE', "%{$request->q}%")
                        ->orWhereHas('user_in', function($query) use ($request) {
                            $query->where('name', 'LIKE', "%{$request->q}%");
                        })
                        ->orWhereHas('user_out', function($query) use ($request) {
                            $query->where('name', 'LIKE', "%{$request->q}%");
                        })
                        ->orWhereHas('car_in', function($query) use ($request) {
                            $query->where('name', 'LIKE', "%{$request->q}%")->orWhere('registration', 'LIKE', "%{$request->q}%");
                        })
                        ->orWhereHas('car_out', function($query) use ($request) {
                            $query->where('name', 'LIKE', "%{$request->q}%")->orWhere('registration', 'LIKE', "%{$request->q}%");
                        });
                });
            }

            $result = $result->orderByRaw(isset($this->extra[$column]) ? $this->extra[$column] : $column ." {$direction}")
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // verify
        if(!(count($request->items) > 0)) {
            return response()->json(null, 400);
        }

        $carsUser = CarsUser::where('user_id', auth()->user()->id)->first();

        if(!$carsUser) {
            return response()->json(null, 400);
        }

        if($carsUser->car()->first()->locked && !auth()->user()->can('car-move-locked')) {
            return response()->json(null, 422);
        }

        $request->validate([
            'user_id' => 'required|integer|exists:cars_users,user_id',
            'items.*.item_id' => 'required|integer|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.data' => 'required',
        ]);

        if($request->user_id == auth()->user()->id) {
            return response()->json(null, 400);
        }

        $errors = 0;

        foreach($request->items as $item) {
            $item = (object) $item;

            $itemObj = Item::find($item->item_id);

            if(!$itemObj->has_data) {
                continue;
            }

            $stock = CarsItem::where(['item_id' => $item->item_id, 'car_id' => $carsUser->car_id])->first();

            if(!$stock) {
                $errors++;
                continue;
            }

            if($stock->quantity < $item->quantity) {
                $errors++;
            }

            foreach(json_decode($item->data) as $data) {
                $itemStock = CarsItem::where(['item_id' => $item->item_id, 'car_id' => $carsUser->car_id])->first();

                $element = Element::where(['element_type' => 'App\CarsItem', 'element_id' => $itemStock->id, 'item_id' => $item->item_id, 'mac' => $data->mac, 'sn' => $data->sn])->get();

                if(!(count($element) > 0)) {
                    $errors++;
                }
            }
        }

        if($errors > 0) {
            return response()->json(null, 400);
        }

        $check = CarsMove::where('document_id', 1)->whereYear('created_at', Carbon::now()->year)->first();

        if($check) {
            $id = CarsMove::whereYear('created_at', Carbon::now()->year)->max('document_id') + 1;
        } else {
            $id = 1;
        }

        // add
        $carsMove = CarsMove::create([
            'document_id' => $id,
            'car_in_id' => $carsUser->car_id,
            'car_out_id' => CarsUser::where('user_id', $request->user_id)->first()->car_id,
            'user_in_id' => auth()->user()->id,
            'user_out_id' => $request->user_id,
            'document_name' => 'MM/T/'. Carbon::now()->year .'/'. $id,
            'notes' => $request->notes,
            'approved' => false,
        ]);

        foreach($request->items as $item) {
            $item = (object) $item;

            $carsMovesItem = CarsMovesItem::create([
                'cars_move_id' => $carsMove->id,
                'item_id' => $item->item_id,
                'quantity' => $item->quantity,
            ]);

            foreach(json_decode($item->data) as $data) {
                $carsMovesItem->element()->create([
                    'item_id' => $item->item_id,
                    'mac' => $data->mac,
                    'sn' => $data->sn,
                ]);
            }
        }

        try {
            \App\User::find($request->user_id)->notify(new \App\Notifications\NewCarsMoveNotification($carsMove->load('user_in')));
        } catch (\Illuminate\Broadcasting\BroadcastException $e) {
            report($e);
        }

        return response()->json($carsMove, 201);
    }

    public function approve(CarsMove $carsMove) {
        if($carsMove->approved != false) {
            return response()->json(null, 400);
        }

        if($carsMove->user_out_id != auth()->user()->id) {
            return response()->json(null, 400);
        }

        $errors = 0;

        foreach(CarsMovesItem::where('cars_move_id', $carsMove->id)->get() as $item) {
            $itemObj = Item::find($item->item_id);

            $stock = CarsItem::where(['item_id' => $item->item_id, 'car_id' => $carsMove->car_in_id])->first();

            if(!$stock) {
                $errors++;
                continue;
            }

            if($stock->quantity < $item->quantity) {
                $errors++;
                continue;
            }

            if(!$itemObj->has_data) {
                continue;
            }

            foreach(CarsMovesItem::where(['item_id' => $item->item_id, 'cars_move_id' => $carsMove->id])->first()->element as $data) {
                $itemStock = CarsItem::where(['item_id' => $item->item_id, 'car_id' => $carsMove->car_in_id])->first();

                $element = Element::where(['element_type' => 'App\CarsItem', 'element_id' => $itemStock->id, 'item_id' => $item->item_id, 'mac' => $data->mac, 'sn' => $data->sn])->get();

                if(!(count($element) > 0)) {
                    $errors++;
                }
            }
        }

        if($errors > 0) {
            return response()->json(null, 400);
        }

        foreach($carsMove->carsMovesItem as $item) {
            $stock = CarsItem::where(['item_id' => $item->item_id, 'car_id' => $carsMove->car_in_id])->first();
            $stock->decrement('quantity', $item->quantity);

            if(!CarsItem::where(['item_id' => $item->item_id, 'car_id' => $carsMove->car_out_id])->increment('quantity', $item->quantity)) {
                $newStock = CarsItem::create([
                    'item_id' => $item->item_id,
                    'car_id' => $carsMove->car_out_id,
                    'quantity' => $item->quantity,
                ]);
            } else {
                $newStock = CarsItem::where(['item_id' => $item->item_id, 'car_id' => $carsMove->car_out_id])->first();
            }

            foreach(CarsMovesItem::where(['item_id' => $item->item_id, 'cars_move_id' => $carsMove->id])->first()->element as $data) {
                $newStock->element()->create([
                    'item_id' => $item->item_id,
                    'mac' => $data->mac,
                    'sn' => $data->sn,
                ]);

                $stock->element()->where(['mac' => $data->mac, 'sn' => $data->sn])->delete();
            }
        }

        $carsMove->update([
            'approved' => true,
        ]);

        try {
            \App\User::find($carsMove->user_in_id)->notify(new \App\Notifications\ApprovedCarsMoveNotification($carsMove->load('user_out')));
        } catch (\Illuminate\Broadcasting\BroadcastException $e) {
            report($e);
        }

        return response()->json(['data' => $carsMove], 204);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $result = CarsMove::with([
                'car_in',
                'car_out',
                'user_in',
                'user_out',
                'carsMovesItem',
                'carsMovesItem.element',
                'carsMovesItem.item',
                'carsMovesItem.item.itemsManufacturer',
                'carsMovesItem.item.unit'])
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $object = CarsMove::find($id);

        if($object->approved || $object->user_in_id !== auth()->user()->id) {
            return response()->json(null, 400);
        }

        $object->delete();

        return response()->json(null, 204);
    }
}
