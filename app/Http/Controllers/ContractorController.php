<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Contractor;
use Validator;
use Illuminate\Validation\Rule;

class ContractorController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'name',
        'nip',
        'postcode',
        'street',
        'city',
        'countries.code',
    ];

    protected $joins = [
        'countries.code' => 'country_id',
    ];

    protected $with = [
        'country'
    ];

    public function __construct() {
        $this->middleware('permission:contractor-list');
        $this->middleware('permission:contractor-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:contractor-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:contractor-delete', ['only' => ['delete']]);
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
                $items = Contractor::with($this->with)
                            ->select('contractors.*')
                            ->leftJoin($table, "{$table}.id", "=", "contractors.{$this->joins[$column]}")
                            ->where('name', 'LIKE', "%{$request->q}%")
                            ->orWhere('nip', 'LIKE', "%{$request->q}%")
                            ->orWhere('postcode', 'LIKE', "%{$request->q}%")
                            ->orWhere('city', 'LIKE', "%{$request->q}%")
                            ->orWhere('street', 'LIKE', "%{$request->q}%")
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            } else {
                $items = Contractor::with($this->with)
                            ->select('contractors.*')
                            ->leftJoin($table, "{$table}.id", "=", "contractors.{$this->joins[$column]}")
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            }
        } else {
            if($request->q) {
                $items = Contractor::with($this->with)
                            ->where('name', 'LIKE', "%{$request->q}%")
                            ->orWhere('nip', 'LIKE', "%{$request->q}%")
                            ->orWhere('postcode', 'LIKE', "%{$request->q}%")
                            ->orWhere('city', 'LIKE', "%{$request->q}%")
                            ->orWhere('street', 'LIKE', "%{$request->q}%")
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            } else {
                $items = Contractor::with($this->with)
                            ->orderByRaw("{$column} {$direction}")
                            ->paginate($this->pagination);
            }
        }

        return response()->json($items, 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $result = Contractor::with($this->with)
                    ->where('name', 'LIKE', "%{$request->q}%")
                    ->orWhere('nip', 'LIKE', "%{$request->q}%")
                    ->orWhere('postcode', 'LIKE', "%{$request->q}%")
                    ->orWhere('city', 'LIKE', "%{$request->q}%")
                    ->orWhere('street', 'LIKE', "%{$request->q}%")
                    ->paginate($this->pagination);

        return response()->json($result, 200);
    }

    public function all() {
        return response()->json(Contractor::with($this->with)->get(), 200);
    }

    public function show(Contractor $contractor) {
        return $contractor;
    }

    public function store(Request $request) {
        $request->validate([
            'type' => 'required|integer',
            'name' => 'required',
            'nip' => 'nullable',
            'street' => 'required',
            'postcode' => 'required',
            'city' => 'required',
            'country_id' => 'required|integer',
            'bacc_iban' => 'nullable',
            'bacc_swift' => 'nullable',
        ]);

        $contractor = Contractor::create($request->all());

        return response()->json($contractor, 201);
    }

    public function edit($id)
    {
        $result = Contractor::all()->find($id);

        return response()->json($result, 200);
    }

    public function update(Request $request, Contractor $contractor) {
        $contractor->update($request->all());

        return response()->json($contractor, 200);
    }

    public function delete(Contractor $contractor) {
        $contractor->delete();

        return response()->json(null, 204);
    }
}
