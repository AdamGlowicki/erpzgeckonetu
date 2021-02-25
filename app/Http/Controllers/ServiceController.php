<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Service;

class ServiceController extends Controller
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($cityId, $streetId, $buildingNumber)
    {
        $service = new \App\Service();
        $result = $service->info($cityId, $streetId, $buildingNumber);

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

    public function search($city) {
        $service = new \App\Service();
        $result = $service->search($city);

        return response()->json($result, 200);
    }

    public function searchByStreet($city, $street) {
        $service = new \App\Service();
        $result = $service->searchByStreet($city, $street);

        return response()->json($result, 200);
    }

    public function searchByStreetLocal($cityId, $street) {
        $service = new \App\Service();
        $result = $service->searchByStreetLocal($cityId, $street);

        return response()->json($result, 200);
    }
}
