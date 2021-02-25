<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Client;
use App\LMS;
use Illuminate\Validation\Rule;
use Validator;

class ClientController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'client_id',
        'name',
        'address',
        'created_at',
    ];

    protected $joins = [];
    protected $with = [];

    public function __construct() {
        $this->middleware('permission:client-list');
        $this->middleware('permission:client-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:client-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:client-delete', ['only' => ['delete']]);
        $this->middleware('permission:client-search', ['only' => ['search']]);
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
                activity()
                    ->withProperties(['string' => $request->q])
                    ->log('Wyszukanie klienta w ERP');

                $result = Client::with($this->with)
                            ->select('clients.*')
                            ->leftJoin($table, "{$table}.id", "=", "clients.{$this->joins[$column]}")
                            ->where('name', 'LIKE', "%{$request->q}%")
                            ->orWhere('address', 'LIKE', "%{$request->q}%")
                            ->orWhere('client_id', 'LIKE', "{$request->q}")

                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            } else {
                $result = Client::where('id', -1)->paginate($this->pagination);
            }
        } else {
            if($request->q) {
                activity()
                    ->withProperties(['string' => $request->q])
                    ->log('Wyszukanie klienta w ERP');

                $result = Client::with($this->with)
                            ->where('name', 'LIKE', "%{$request->q}%")
                            ->orWhere('address', 'LIKE', "%{$request->q}%")
                            ->orWhere('client_id', 'LIKE', "{$request->q}")
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            } else {
                $result = Client::where('id', -1)->paginate($this->pagination);
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
        return Client::with($this->with)->paginate(25);
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
        $result = Client::with(['clientsItem' => function($query) {
                $query->where('quantity', '>', 0);
            }, 'clientsItem.item', 'clientsItem.item.itemsManufacturer', 'clientsItem.element', 'clientsItem.item.unit'])
            ->find($id);

        return response()->json($result, 200);
    }

    public function showLMS($client) {
        $result = Client::with(['clientsItem' => function($query) {
                        $query->where('quantity', '>', 0);
                    }, 'clientsItem.item', 'clientsItem.item.itemsManufacturer', 'clientsItem.element', 'clientsItem.item.unit'])
                    ->where('client_id', $client)
                    ->get()
                    ->first();

        if($result) {
            return response()->json($result, 200);
        } else {
            return response()->json(null, 400);
        }
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

    public function search(Client $client, $string) {
        activity()
            ->withProperties(['string' => $string])
            ->log('Wyszukanie klienta w LMS');

        $result = $client->search($string);

        foreach($result as $key => $object) {
            unset($result[$key]->nodes);
        }

        return response()->json(['data' => $result], 200);
    }

    public function searchNodes(Client $client, LMS $lms, $string) {
        activity()
            ->withProperties(['string' => $string])
            ->log('Wyszukanie klienta w LMS');

        $result = $client->search($string);
        $cc = $lms->clientsFromCC();

        foreach($result as $key => $object) {
            if(!in_array($object->id, $cc)) {
                unset($result[$key]->nodes);
            }
        }

        return response()->json(['data' => $result], 200);
    }

    public function checkPin(Client $client, $id, $pin) {
        $result = $client->checkPin($pin, $id);

        if($result) {
            $nodes = $client->search($id)[0]->nodes;
            $addr = $client->search($id)[0]->addresses;
        } else {
            $nodes = [];
            $addr = [];
        }

        return response()->json([
            'data' => $result,
            'nodes' => $nodes,
            'addr' => $addr,
        ]);
    }
}
