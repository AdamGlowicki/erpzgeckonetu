<?php

namespace App\Http\Controllers;

use App\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    /**
     * LeadController constructor.
     */
    public function __construct() {
        $this->middleware('permission:lead-list');
        $this->middleware('permission:lead-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:lead-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:lead-delete', ['only' => ['delete']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @param null $column
     * @param null $direction
     * @return \Illuminate\Http\JsonResponse
     */
    public function index($column = null, $direction = null)
    {
        $result = Lead::with([
            'user',
            'terytSimc',
            'terytUlic',
        ]);

        if($column && $direction) {
            $result = $result->orderByJoin($column, $direction);
        }

        $result = $result->paginate(15);

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
            'name' => 'string|max:255',
            'city' => 'string|max:255',
            'city_teryt' => 'required|string|exists:teryt_simc,SYM',
            'street' => 'nullable|required_if:no_street,0|string|max:255',
            'street_teryt' => 'nullable|required_if:no_street,0|string|exists:teryt_ulic,SYM_UL',
            'building_num' => 'string|max:255',
            'apartment_num' => 'nullable|string|max:255',
            'phone' => 'required|string|max:255',
            'contract_end_at' => 'nullable|date',
            'offer' => 'string|max:255',
        ]);

        $result = Lead::create([
            'user_id' => auth()->user()->id,
            'name' => $request->name,
            'city' => $request->city,
            'city_teryt' => $request->city_teryt,
            'street' => $request->no_street ? null : $request->street,
            'street_teryt' => $request->no_street ? null : $request->street_teryt,
            'building_num' => $request->building_num,
            'apartment_num' => $request->apartment_num,
            'phone' => $request->phone,
            'contract_end_at' => $request->contract_end_at,
            'offer' => $request->offer,
        ]);

        return response()->json($result, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $result = Lead::with([
                'user',
                'terytSimc',
                'terytUlic',
            ])
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
        $result = Lead::with([
                'user',
                'terytSimc',
                'terytUlic',
            ])
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
        $result = Lead::find($id);

        if(!$result) {
            return response()->json(null, 404);
        }

        $request->validate([
            'name' => 'string|max:255',
            'city' => 'string|max:255',
            'city_teryt' => 'required|string|exists:teryt_simc,SYM',
            'street' => 'nullable|required_if:no_street,0|string|max:255',
            'street_teryt' => 'nullable|required_if:no_street,0|string|exists:teryt_ulic,SYM_UL',
            'building_num' => 'string|max:255',
            'apartment_num' => 'nullable|string|max:255',
            'phone' => 'required|string|max:255',
            'contract_end_at' => 'nullable|date',
            'offer' => 'string|max:255',
        ]);

        $result->update([
            'name' => $request->name,
            'city' => $request->city,
            'city_teryt' => $request->city_teryt,
            'street' => $request->no_street ? null : $request->street,
            'street_teryt' => $request->no_street ? null : $request->street_teryt,
            'building_num' => $request->building_num,
            'apartment_num' => $request->apartment_num,
            'phone' => $request->phone,
            'contract_end_at' => $request->contract_end_at,
            'offer' => $request->offer,
        ]);

        return response()->json($result);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $result = Lead::find($id);

        if(!$result) {
            return response()->json(null, 404);
        }

        $result->delete();

        return response()->json(null, 200);
    }
}
