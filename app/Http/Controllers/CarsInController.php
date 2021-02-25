<?php

namespace App\Http\Controllers;

use App\Car;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Validator;
use DB;
use App\CarsIn;
use App\CarsInsItem;
use App\CarsItem;
use App\ClientsItem;
use App\InvestmentsItem;
use App\Item;
use App\Client;
use App\Element;

class CarsInController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'client_id',
        'cars.name',
        'users.name',
        'clients.name',
        'investments.investment_name',
        'document_name',
        'created_at',
    ];

    protected $joins = [
        'cars.name' => 'car_id',
        'users.name' => 'user_id',
        'clients.name' => 'client_id',
        'investments.investment_name' => 'investment_id',
    ];

    protected $with = [
        'car',
        'user',
        'client',
        'investment',
    ];

    public function __construct() {
        $this->middleware('permission:carsIn-list');
        $this->middleware('permission:carsIn-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:carsIn-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:carsIn-delete', ['only' => ['delete']]);
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
                $result = CarsIn::with($this->with)
                    ->select('cars_ins.*')
                    ->where(function($query) {
                        if(!auth()->user()->can('carsIn-all')) {
                            $query->where('user_id', auth()->user()->id);
                        }
                    })
                    ->leftJoin($table, "{$table}.id", "=", "cars_ins.{$this->joins[$column]}")
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
                            ->orWhereHas('carsInsItem.item', function($query) use ($request) {
                                $query->where('model_name', 'LIKE', "%{$request->q}%")
                                        ->orWhere('id', $request->q);
                            })
                            ->orWhereHas('carsInsItem.element', function($query) use ($request) {
                                $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                            });
                    })
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            } else {
                $result = CarsIn::with($this->with)
                    ->select('cars_ins.*')
                    ->where(function($query) {
                        if(!auth()->user()->can('carsIn-all')) {
                            $query->where('user_id', auth()->user()->id);
                        }
                    })
                    ->leftJoin($table, "{$table}.id", "=", "cars_ins.{$this->joins[$column]}")
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            }
        } else {
            if($request->q) {
                $result = CarsIn::with($this->with)
                    ->where(function($query) {
                        if(!auth()->user()->can('carsIn-all')) {
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
                            ->orWhereHas('carsInsItem.item', function($query) use ($request) {
                                $query->where('model_name', 'LIKE', "%{$request->q}%")
                                        ->orWhere('id', $request->q);
                            })
                            ->orWhereHas('carsInsItem.element', function($query) use ($request) {
                                $query->where('sn', 'LIKE', "%{$request->q}")->orWhere('mac', 'LIKE', "%{$request->q}");
                            });
                    })
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            } else {
                $result = CarsIn::with($this->with)
                    ->where(function($query) {
                        if(!auth()->user()->can('carsIn-all')) {
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
            'items.*.item_id' => 'required|integer',
            'items.*.quantity' => 'required|integer',
            'items.*.data' => 'required',
            'items.*.item_new' => 'required|integer',
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

            $request->investment_id = null;
        }

        $car = \App\CarsUser::where('user_id', auth()->user()->id)->first();

        if(!$car) {
            return response()->json(null, 400);
        }

        $car_id = $car->car_id;

        if(Car::where('id', $car_id)->first()->locked && !auth()->user()->can('car-move-locked')) {
            return response()->json(null, 422);
        }

        if($errors > 0) {
            return response()->json(null, 400);
        }

        foreach($request->items as $item) {
            $itemObj = Item::find($item['item_id']);

            if($item['item_new']) {
                continue;
            }

            if(!$itemObj->has_data) {
                continue;
            }

            if($request->type) {
                $stock = InvestmentsItem::where(['item_id' => $item['item_id'], 'investment_id' => $request->investment_id])->first();

                if($stock->quantity < $item['quantity']) {
                    $errors++;
                }

                foreach(json_decode($item['data']) as $data) {
                    $itemStock = InvestmentsItem::where(['item_id' => $item['item_id'], 'investment_id' => $request->investment_id])->first();

                    $element = Element::where(['element_type' => 'App\InvestmentsItem', 'element_id' => $itemStock->id, 'item_id' => $item['item_id'], 'mac' => $data->mac, 'sn' => $data->sn])->get();

                    if(!(count($element) > 0)) {
                        $errors++;
                    }
                }
            } else {
                $stock = ClientsItem::where(['item_id' => $item['item_id'], 'client_id' => $request->client_id])->first();

                if($stock->quantity < $item['quantity']) {
                    $errors++;
                }

                foreach(json_decode($item['data']) as $data) {
                    $itemStock = ClientsItem::where(['item_id' => $item['item_id'], 'client_id' => $request->client_id])->first();

                    $element = Element::where(['element_type' => 'App\ClientsItem', 'element_id' => $itemStock->id, 'item_id' => $item['item_id'], 'mac' => $data->mac, 'sn' => $data->sn])->get();

                    if(!(count($element) > 0)) {
                        $errors++;
                    }
                }
            }
        }

        if($errors > 0) {
            return response()->json(null, 400);
        }

        $check = CarsIn::where('document_id', 1)->whereYear('created_at', Carbon::now()->year)->first();

        if($check) {
            $id = CarsIn::whereYear('created_at', Carbon::now()->year)->max('document_id') + 1;
        } else {
            $id = 1;
        }

        // add
        $carsIn = CarsIn::create([
            'document_id' => $id,
            'car_id' => $car_id,
            'client_id' => $request->client_id,
            'investment_id' => $request->investment_id,
            'user_id' => auth()->user()->id,
            'document_name' => 'ZWROT/'. Carbon::now()->year .'/'. $id,
            'notes' => $request->notes,
        ]);

        foreach($request->items as $item) {
            $carsInsItem = CarsInsItem::create([
                'cars_in_id' => $carsIn->id,
                'item_id' => $item['item_id'],
                'quantity' => $item['quantity'],
            ]);

            if(!$item['item_new']) {
                if($request->type) {
                    $stock = InvestmentsItem::where(['item_id' => $item['item_id'], 'investment_id' => $request->investment_id])->first();
                    $stock->decrement('quantity', $item['quantity']);
                } else {
                    $stock = ClientsItem::where(['item_id' => $item['item_id'], 'client_id' => $request->client_id])->first();
                    $stock->decrement('quantity', $item['quantity']);
                }
            }

            if(!CarsItem::where(['item_id' => $item['item_id'], 'car_id' => $car_id])->increment('quantity', $item['quantity'])) {
                $carsItem = CarsItem::create([
                    'item_id' => $item['item_id'],
                    'car_id' => $car_id,
                    'quantity' => $item['quantity'],
                ]);
            } else {
                $carsItem = CarsItem::where(['item_id' => $item['item_id'], 'car_id' => $car_id])->first();
            }

            foreach(json_decode($item['data']) as $data) {
                $carsInsItem->element()->create([
                    'item_id' => $item['item_id'],
                    'mac' => $data->mac,
                    'sn' => $data->sn,
                ]);

                $carsItem->element()->create([
                    'item_id' => $item['item_id'],
                    'mac' => $data->mac,
                    'sn' => $data->sn,
                ]);

                if(!$item['item_new']) {
                    $stock->element()->where(['mac' => $data->mac, 'sn' => $data->sn])->delete();
                }
            }
        }

        return response()->json($carsIn, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $result = CarsIn::with([
                'car',
                'user',
                'client',
                'investment',
                'carsInsItem',
                'carsInsItem.element',
                'carsInsItem.item',
                'carsInsItem.item.itemsManufacturer',
                'carsInsItem.item.unit'
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
        $data = CarsIn::with([
            'car',
            'user',
            'investment',
            'client',
            'carsInsItem' => function($query) {
                $query->where('quantity', '>', 0);
            },
            'carsInsItem.item',
            'carsInsItem.item.itemsManufacturer',
            'carsInsItem.item.unit',
            'carsInsItem.element',
        ])
            ->where('id', $id)
            ->first();

        return base64_encode(app('App\Pdf')->create('pdf.carsIn', compact('data')));
    }
}
