<?php

namespace App\Http\Controllers;

use App\Attachments;
use App\Automobile;
use App\CarInvokes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class AutomobileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $cars = Automobile::with([
            'carPhoto',
        ])->get();

        return response()->json($cars, 200);
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
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $car = $request->all();
        $newCar = Automobile::create($car);

        return response()->json($newCar, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $car = $request->all();
        Automobile::findOrFail($id)->update($car);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Automobile::findOrfail($id)->delete();
    }

    private function saveAttachment($attachment, $newFilename, $filename, $request) {
        if (!File::exists(storage_path('app/carInvokes'))) {
            Storage::disk('local')->makeDirectory('carInvokes/');
        }

        $attachment->save(storage_path('app/carInvokes/'), $newFilename);
        CarInvokes::create(['path' => 'carInvokes/' . $newFilename, 'name' => $filename, 'automobile_id' => $request->automobile_id]);
    }

    public function attachments(Request $request) {
        $attachments = new Attachments();

        $result = $attachments->attachments($request, function($attachment, $newFilename, $filename, $request) {
            $this->saveAttachment($attachment, $newFilename, $filename, $request);
        });

        if ($result === 404) {
            return response()->json('error', 404);
        } else {
            return response(CarInvokes::where('automobile_id', $request->get('automobile_id'))->get(), 200);
        }
    }
}
