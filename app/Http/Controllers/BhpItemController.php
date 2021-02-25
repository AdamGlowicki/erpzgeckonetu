<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\BhpItem;

class BhpItemController extends Controller
{
    protected $pagination = 40;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'units.short_name',
        'name',
        'created_at',
    ];

    protected $joins = [
        'units.short_name' => 'unit_id',
    ];

    protected $with = [
        'unit',
    ];

    public function __construct() {
        $this->middleware('permission:bhpItem-list');
        $this->middleware('permission:bhpItem-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:bhpItem-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:bhpItem-delete', ['only' => ['delete']]);
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
            $result = BhpItem::with($this->with)
                        ->select('bhp_items.*')
                        ->leftJoin($table, "{$table}.id", "=", "bhp_items.{$this->joins[$request->sortCol]}");
        } else {
            $result = BhpItem::with($this->with);
        }

        if($request->q) {
            $request->q = preg_replace('/\s+/', '%', $request->q);

            $result = $result->where(function($query) use ($request) {
                $query->where('id', 'LIKE', "%{$request->q}%")
                ->orWhere('name', 'LIKE', "%{$request->q}%")
                ->orWhere('created_at', 'LIKE', "%{$request->q}%")
                ->orWhereHas('unit', function($query) use ($request) {
                    $query->where('name', 'LIKE', "%{$request->q}%")->orWhere('short_name', 'LIKE', "%{$request->q}%");
                });
            });
        }

        if($request->sortCol && $request->sortDir) {
            $result = $result->orderByRaw("{$request->sortCol} {$request->sortDir}");
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
        $request->validate([
            'name' => 'required|string',
            'unit_id' => 'required|integer',
        ]);

        $result = BhpItem::create($request->all());

        return response()->json($result, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param BhpItem $object
     * @return \Illuminate\Http\Response
     */
    public function edit(BhpItem $object)
    {
        return response()->json($object, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param BhpItem $object
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, BhpItem $object)
    {
        $request->validate([
            'name' => 'required',
            'unit_id' => 'required|integer|exists:units,id',
        ]);

        $result = $object->update($request->all());

        return response()->json($result, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        BhpItem::find($id)->delete();

        return response()->json(null, 204);
    }

    /**
     * Search in the specified resource
     *
     * @param  string  $string
     * @return \Illuminate\Http\Response
     */
    public function search($string) {
        $string = preg_replace('/\s+/', '%', $string);

        $result = BhpItem::with($this->with)
            ->where('id', $string)
            ->orWhere('name', 'LIKE', "%{$string}%")
            ->get();

        return response()->json($result, 200);
    }
}
