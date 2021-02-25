<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\InvestmentsItem;

class InvestmentsItemController extends Controller
{
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
        //
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
    
    public function search($item, $investment) {
        $stock = InvestmentsItem::with(['item', 'item.itemsManufacturer', 'item.unit', 'element'])
                    ->where('quantity', '>', 0)
                    ->where(function($q) use ($item, $investment) {
                        $q->where(function($query) use ($item, $investment) {
                            $query->where(['item_id' => $item, 'investment_id' => $investment]);
                        })
                        ->orWhere(function($query) use ($item, $investment) {
                            $query->where(['investment_id' => $investment])->whereHas('item', function($query) use ($item) {
                                $query->where('model_name', 'LIKE', "%{$item}%");
                            });
                        })
                        ->orWhere(function($query) use ($item, $investment) {
                            $query->where(['investment_id' => $investment])->whereHas('item.itemsManufacturer', function($query) use ($item) {
                                $query->where('name', 'LIKE', "%{$item}%");
                            });
                        });
                    })
                    ->get();
        
        return response()->json(['data' => $stock], 200);
    }
}
