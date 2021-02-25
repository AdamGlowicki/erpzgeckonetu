<?php

namespace App\Http\Controllers;

use App\Wiki;
use Illuminate\Http\Request;

class WikiController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $result = Wiki::with(['user'])
            ->paginate(25);

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
            'title' => 'required|min:1|max:255',
            'body' => 'required'
        ]);

        $result = Wiki::create([
            'user_id' => auth()->user()->id,
            'title' => $request->title,
            'content' => $request->body,
            'approved' => false,
        ]);

        return response()->json($result, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $result = Wiki::find($id);

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
        $result = Wiki::find($id);

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
        $request->validate([
            'title' => 'required|min:1|max:255',
            'body' => 'required'
        ]);

        $result = Wiki::find($id);

        if(!$result->exists()) {
            return response()->json($result, 404);
        }

        $result->update([
            'title' => $request->title,
            'content' => $request->body,
            'approved' => false,
        ]);

        return response()->json($result, 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $result = Wiki::findOrFail($id);

        if(!$result) {
            return response()->json(null, 404);
        }

        $result->delete();

        return response()->json(null, 204);
    }
}
