<?php

namespace App\Http\Controllers;

use App\Car;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Validator;
use DB;
use App\CarsOut;
use App\CarsOutsItem;
use App\CarsItem;
use App\ClientsItem;
use App\InvestmentsItem;
use App\Item;
use App\Client;
use App\Element;

class CarsOutController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'clients.name',
        'cars.name',
        'users.name',
        'investments.investment_name',
        'document_name',
        'created_at',
    ];

    protected $joins = [
        'cars.name' => 'car_id',
        'users.name' => 'user_id',
        'investments.investment_name' => 'investment_id',
        'clients.name' => 'client_id',
    ];

    protected $with = [
        'car',
        'user',
        'investment',
        'client',
    ];

    public function __construct() {
        $this->middleware('permission:carsOut-list');
        $this->middleware('permission:carsOut-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:carsOut-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:carsOut-delete', ['only' => ['delete']]);
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
            if($request->q) {
                $result = CarsOut::with($this->with)
                            ->select('cars_outs.*')
                            ->where(function($query) {
                                if(!auth()->user()->can('carsOut-all')) {
                                    $query->where('user_id', auth()->user()->id);
                                }
                            })
                            ->leftJoin($table, "{$table}.id", "=", "cars_outs.{$this->joins[$column]}")
                            ->where(function($query) use($request) {
                                $query->where('document_name', 'LIKE', "%{$request->q}%")
                                        ->orWhereHas('client', function($query) use ($request) {
                                            $query->where('client_id', 'LIKE', "{$request->q}")
                                                    ->orWhere('name', 'LIKE', "%{$request->q}%");
                                        })
                                        ->orWhereHas('investment', function($query) use ($request) {
                                            $query->where('id', 'LIKE', "{$request->q}")
                                                    ->orWhere('name', 'LIKE', "%{$request->q}%")
                                                    ->orWhere('investment_name', 'LIKE', "%{$request->q}%");
                                        })
                                        ->orWhereHas('user', function($query) use ($request) {
                                            $query->where('name', 'LIKE', "%{$request->q}%");
                                        })
                                        ->orWhereHas('car', function($query) use ($request) {
                                            $query->where('name', 'LIKE', "%{$request->q}%")
                                                    ->orWhere('registration', 'LIKE', "%{$request->q}%");
                                        })
                                        ->orWhereHas('carsOutsItem.item', function($query) use ($request) {
                                            $query->where('model_name', 'LIKE', "%{$request->q}%")
                                                    ->orWhere('id', $request->q);
                                        })
                                        ->orWhereHas('carsOutsItem.element', function($query) use ($request) {
                                            $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                                        });
                            })
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            } else {
                $result = CarsOut::with($this->with)
                            ->select('cars_outs.*')
                            ->where(function($query) {
                                if(!auth()->user()->can('carsOut-all')) {
                                    $query->where('user_id', auth()->user()->id);
                                }
                            })
                            ->leftJoin($table, "{$table}.id", "=", "cars_outs.{$this->joins[$column]}")
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            }
        } else {
            if($request->q) {
                $result = CarsOut::with($this->with)
                            ->where(function($query) {
                                if(!auth()->user()->can('carsOut-all')) {
                                    $query->where('user_id', auth()->user()->id);
                                }
                            })
                            ->where(function($query) use($request) {
                                $query->where('document_name', 'LIKE', "%{$request->q}%")
                                        ->orWhereHas('client', function($query) use ($request) {
                                            $query->where('client_id', 'LIKE', "{$request->q}")
                                                    ->orWhere('name', 'LIKE', "%{$request->q}%");
                                        })
                                        ->orWhereHas('investment', function($query) use ($request) {
                                            $query->where('id', 'LIKE', "{$request->q}")
                                                    ->orWhere('name', 'LIKE', "%{$request->q}%")
                                                    ->orWhere('investment_name', 'LIKE', "%{$request->q}%");
                                        })
                                        ->orWhereHas('user', function($query) use ($request) {
                                            $query->where('name', 'LIKE', "%{$request->q}%");
                                        })
                                        ->orWhereHas('car', function($query) use ($request) {
                                            $query->where('name', 'LIKE', "%{$request->q}%")
                                                    ->orWhere('registration', 'LIKE', "%{$request->q}%");
                                        })
                                        ->orWhereHas('carsOutsItem.item', function($query) use ($request) {
                                            $query->where('model_name', 'LIKE', "%{$request->q}%")
                                                    ->orWhere('id', $request->q);
                                        })
                                        ->orWhereHas('carsOutsItem.element', function($query) use ($request) {
                                            $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                                        });
                            })
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            } else {
                $result = CarsOut::with($this->with)
                            ->where(function($query) {
                                if(!auth()->user()->can('carsOut-all')) {
                                    $query->where('user_id', auth()->user()->id);
                                }
                            })
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

        $errors = 0;

        $request->validate([
            'items.*.item_id' => 'required|integer|exists:items,id',
            'items.*.quantity' => 'required|integer',
            'items.*.data' => 'required',
        ]);

        if($request->type) {
            $request->validate([
                'investment_id' => 'required|integer',
            ]);

            $request->client_id = null;
        } else {
            $request->validate([
                'client_id' => 'required|integer',
            ]);

            $request->investment_id = null;
        }

        if(!\App\CarsUser::where('user_id', auth()->user()->id)->first()) {
            return response()->json(null, 400);
        }

        $car = \App\CarsUser::where('user_id', auth()->user()->id)->first();

        if(!$car) {
            return response()->json(null, 400);
        }

        $car_id = $car->car_id;

        if($car->car()->first()->locked && !auth()->user()->can('car-move-locked')) {
            return response()->json(null, 422);
        }

        foreach($request->items as $item) {
            $itemObj = Item::find($item['item_id']);

            if(!$itemObj->has_data) {
                continue;
            }

            $stock = CarsItem::where(['item_id' => $item['item_id'], 'car_id' => $car_id])->first();

            if($stock->quantity < $item['quantity']) {
                $errors++;
            }

            foreach(json_decode($item['data']) as $data) {
                $itemStock = CarsItem::where(['item_id' => $item['item_id'], 'car_id' => $car_id])->first();

                $element = Element::where(['element_type' => 'App\CarsItem', 'element_id' => $itemStock->id, 'item_id' => $item['item_id'], 'mac' => $data->mac, 'sn' => $data->sn])->get();

                if(!(count($element) > 0)) {
                    $errors++;
                }
            }
        }

        if($errors > 0) {
            return response()->json(null, 400);
        }

        if(!$request->type) {
            if(!Client::where('client_id', $request->client_id)->first()) {
                $clientArr = app('App\Client')->search($request->client_id);

                $address = '';

                if(isset($clientArr[0]->addresses)) {
                    if(isset($clientArr[0]->addresses[0])) {
                        if($clientArr[0]->addresses[0]->street !== null) {
                            $address = $clientArr[0]->addresses[0]->street .' '. $clientArr[0]->addresses[0]->house . ($clientArr[0]->addresses[0]->flat !== null ? ' lokal '. $clientArr[0]->addresses[0]->flat : '') .', '. $clientArr[0]->addresses[0]->city;
                        } else {
                            $address = $clientArr[0]->addresses[0]->city .' '. $clientArr[0]->addresses[0]->house . ($clientArr[0]->addresses[0]->flat !== null ? ' lokal '. $clientArr[0]->addresses[0]->flat : '') .', '. $clientArr[0]->addresses[0]->city;
                        }
                    }
                }

                $client = Client::create([
                    'client_id' => $request->client_id,
                    'name' => $clientArr[0]->name .' '. $clientArr[0]->lastname,
                    'address' => $address,
                ]);

                $request->client_id = $client->id;
            } else {
                $request->client_id = Client::where('client_id', $request->client_id)->first()->id;
            }
        }

        $check = CarsOut::where('document_id', 1)->whereYear('created_at', Carbon::now()->year)->first();

        if($check) {
            $id = CarsOut::whereYear('created_at', Carbon::now()->year)->max('document_id') + 1;
        } else {
            $id = 1;
        }

        // add
        $carsOut = CarsOut::create([
            'document_id' => $id,
            'car_id' => $car_id,
            'client_id' => $request->client_id,
            'investment_id' => $request->investment_id,
            'user_id' => auth()->user()->id,
            'document_name' => 'WZ/'. Carbon::now()->year .'/'. $id,
            'notes' => $request->notes,
        ]);

        foreach($request->items as $item) {
            $carsOutsItem = CarsOutsItem::create([
                'cars_out_id' => $carsOut->id,
                'item_id' => $item['item_id'],
                'quantity' => $item['quantity'],
            ]);

            $stock = CarsItem::where(['item_id' => $item['item_id'], 'car_id' => $car_id])->first();
            $stock->decrement('quantity', $item['quantity']);

            if($request->type) {
                if(!InvestmentsItem::where(['item_id' => $item['item_id'], 'investment_id' => $request->investment_id])->increment('quantity', $item['quantity'])) {
                    $investmentsItem = InvestmentsItem::create([
                        'item_id' => $item['item_id'],
                        'investment_id' => $request->investment_id,
                        'quantity' => $item['quantity'],
                    ]);
                } else {
                    $investmentsItem = InvestmentsItem::where(['item_id' => $item['item_id'], 'investment_id' => $request->investment_id])->first();
                }
            } else {
                if(!ClientsItem::where(['item_id' => $item['item_id'], 'client_id' => $request->client_id])->increment('quantity', $item['quantity'])) {
                    $clientsItem = ClientsItem::create([
                        'item_id' => $item['item_id'],
                        'client_id' => $request->client_id,
                        'quantity' => $item['quantity'],
                    ]);
                } else {
                    $clientsItem = ClientsItem::where(['item_id' => $item['item_id'], 'client_id' => $request->client_id])->first();
                }
            }

            foreach(json_decode($item['data']) as $data) {
                $carsOutsItem->element()->create([
                    'item_id' => $item['item_id'],
                    'mac' => $data->mac,
                    'sn' => $data->sn,
                ]);

                if($request->type) {
                    $investmentsItem->element()->create([
                        'item_id' => $item['item_id'],
                        'mac' => $data->mac,
                        'sn' => $data->sn,
                    ]);
                } else {
                    $clientsItem->element()->create([
                        'item_id' => $item['item_id'],
                        'mac' => $data->mac,
                        'sn' => $data->sn,
                    ]);
                }

                $stock->element()->where(['mac' => $data->mac, 'sn' => $data->sn])->delete();
            }
        }

        return response()->json($carsOut, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $result = CarsOut::with([
                'car',
                'user',
                'investment',
                'client',
                'carsOutsItem',
                'carsOutsItem.element',
                'carsOutsItem.item',
                'carsOutsItem.item.itemsManufacturer',
                'carsOutsItem.item.unit'
            ])
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
     * Generate PDF document from this model
     *
     * @param  int  $id
     * @return string
     */
    public function document($id) {
        $data = CarsOut::with([
                'car',
                'user',
                'investment',
                'client',
                'carsOutsItem' => function($query) {
                    $query->where('quantity', '>', 0);
                },
                'carsOutsItem.item',
                'carsOutsItem.item.itemsManufacturer',
                'carsOutsItem.item.unit',
                'carsOutsItem.element',
            ])
            ->where('id', $id)
            ->first();

        return base64_encode(app('App\Pdf')->create('pdf.carsOut', compact('data')));
    }
}
