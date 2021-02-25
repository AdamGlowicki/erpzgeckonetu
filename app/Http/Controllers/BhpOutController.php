<?php

namespace App\Http\Controllers;

use App\BhpOutsItem;
use App\BhpUsersStocksItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\BhpOut;
use Illuminate\Support\Facades\DB;

class BhpOutController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'users.name',
        'users.name{user_out}',
        'document_name',
        'created_at',
    ];

    protected $joins = [
        'users.name' => 'user_id',
        'users.name{user_out}' => 'user_out_id',
    ];

    protected $with = [
        'user',
        'userOut',
    ];

    public function __construct() {
        $this->middleware('permission:bhpOut-list');
        $this->middleware('permission:bhpOut-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:bhpOut-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:bhpOut-delete', ['only' => ['delete']]);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        if($request->sortCol && $request->sortDir) {
            $validation = \Validator::make(['column' => $request->sortCol, 'direction' => $request->sortDir], [
                'column' => [\Illuminate\Validation\Rule::in($this->columns)],
                'direction' => [\Illuminate\Validation\Rule::in($this->directions)]
            ]);

            if($validation->fails()) {
                return response()->json(null, 400);
            }
        }

        if(count(explode('.', $request->sortCol)) > 1) {
            $table = explode('.', preg_replace('/{.*/', '', $request->sortCol))[0];
        }

        if(isset($table)) {
            $result = BhpOut::with($this->with)
                        ->select('bhp_outs.*')
                        ->leftJoin($table, "{$table}.id", "=", "bhp_outs.{$this->joins[$request->sortCol]}");
        } else {
            $result = BhpOut::with($this->with);
        }

        if($request->q) {
            $request->q = preg_replace('/\s+/', '%', $request->q);

            $result = $result->where(function($query) use ($request) {
                $query->where('bhp_outs.id', 'LIKE', "%{$request->q}%")
                ->orWhere('bhp_outs.document_name', 'LIKE', "%{$request->q}%")
                ->orWhere('bhp_outs.created_at', 'LIKE', "%{$request->q}%")
                ->orWhereHas('userOut', function($query) use ($request) {
                    $query->where('name', 'LIKE', "%{$request->q}%");
                })
                ->orWhereHas('user', function($query) use ($request) {
                    $query->where('name', 'LIKE', "%{$request->q}%");
                });
            });
        }

        if($request->sortCol && $request->sortDir) {
            $result = $result->orderByRaw(preg_replace('/{.*/', '', $request->sortCol) ." {$request->sortDir}");
        }

        $result = $result->paginate($this->pagination);

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
        if(!(count($request->items) > 0)) {
            return response()->json(null, 400);
        }

        $request->validate([
            'user_out_id' => 'required|integer|exists:users,id',
            'items.*.item_id' => 'required|integer|exists:bhp_items,id',
            'items.*.quantity' => 'required|integer|gt:0',
        ]);

        $check = BhpOut::where('document_id', 1)->whereYear('created_at', Carbon::now()->year)->first();

        if($check) {
            $id = BhpOut::whereYear('created_at', Carbon::now()->year)->max('document_id') + 1;
        } else {
            $id = 1;
        }

        $object = BhpOut::create([
            'user_id' => auth()->user()->id,
            'user_out_id' => $request->user_out_id,
            'document_name' => 'RW/B/'. Carbon::now()->year .'/'. $id,
            'notes' => $request->notes
        ]);

        foreach($request->items as $item) {
            $item = (object) $item;

            BhpOutsItem::create([
                'bhp_out_id' => $object->id,
                'bhp_item_id' => $item->item_id,
                'quantity' => $item->quantity,
            ]);

            $stock = BhpUsersStocksItem::where([
                'bhp_item_id' => 'bhp_item_id',
                'user_id' => $request->user_out_id,
            ])->first();

            if($stock) {
                $stock->increment('quantity', $item->quantity);
            } else {
                BhpUsersStocksItem::create([
                    'bhp_item_id' => $item->item_id,
                    'user_id' => $request->user_out_id,
                    'quantity' => $item->quantity,
                ]);
            }
        }

        return response()->json($object, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $result = BhpOut::where('id', $id)->with([
            'user',
            'userOut',
            'bhpOutsItem',
            'bhpOutsItem.bhpItem',
            'bhpOutsItem.bhpItem.unit',
        ])->first();

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
        $data = BhpOut::with([
                'userOut',
                'user',
                'bhpOutsItem' => function($query) {
                    $query->where('quantity', '>', 0);
                },
                'bhpOutsItem.bhpItem',
                'bhpOutsItem.bhpItem.unit',
            ])
            ->where('id', $id)
            ->first();

        return base64_encode(app('App\Pdf')->create('pdf.bhpOut', compact('data')));
    }
}
