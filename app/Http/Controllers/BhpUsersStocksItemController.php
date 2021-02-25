<?php

namespace App\Http\Controllers;

use App\BhpUsersStocksItem;
use App\User;
use Illuminate\Http\Request;

class BhpUsersStocksItemController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'name',
    ];

    protected $joins = [
    ];

    protected $with = [
    ];

    public function __construct() {
        $this->middleware('permission:bhpUsersStocksItem-list');
        $this->middleware('permission:bhpUsersStocksItem-edit', ['only' => ['edit', 'update']]);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
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
            $result = User::with($this->with)
                ->select('users.*')
                ->leftJoin($table, "{$table}.id", "=", "users.{$this->joins[$request->sortCol]}");
        } else {
            $result = User::with($this->with);
        }

        if($request->q) {
            $request->q = preg_replace('/\s+/', '%', $request->q);

            $result = $result->where(function($query) use ($request) {
                $query->where('id', 'LIKE', "%{$request->q}%")
                    ->orWhere('name', 'LIKE', "%{$request->q}%");
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
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $result = User::where('id', $id)->with([
            'bhpUsersStocksItem',
            'bhpUsersStocksItem.bhpItem',
            'bhpUsersStocksItem.bhpItem.unit',
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
        $user = User::where('id', $id)
            ->first();

        $items = BhpUsersStocksItem::with([
                'bhpItem',
                'bhpItem.unit',
            ])
            ->where('user_id', $id)
            ->where('quantity', '>', 0)
            ->get();

        return base64_encode(app('App\Pdf')->create('pdf.bhpUsersStocksItem', compact('user', 'items')));
    }
}
