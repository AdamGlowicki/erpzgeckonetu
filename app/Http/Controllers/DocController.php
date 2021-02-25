<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Doc;

class DocController extends Controller
{
    /**
     * DocController constructor.
     */
    public function __construct() {
        $this->middleware('permission:doc-list');
        $this->middleware('permission:doc-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:doc-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:doc-delete', ['only' => ['delete']]);
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
        $result = Doc::with([
            'user',
        ]);

        if($column && $direction) {
            $result = $result->orderByJoin($column, $direction);
        }

        $result = $result->paginate(20);

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
            'title' => 'required|string|max:255',
            'file' => 'mimes:pdf,jpg,jpeg,bmp,png,doc,docx,txt,xlsx,odt',
        ]);

        $result = Doc::create([
            'title' => $request->title,
            'user_id' => auth()->user()->id,
        ]);

        if($request->file('file')) {
            $name = $request->file('file')->getClientOriginalName();
            $path = $request->file('file')->store('files', 'local');

            $result->file()->create([
                'name' => $name,
                'path' => $path,
            ]);
        }

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
        $result = Doc::with(['user', 'file'])
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
        $result = Doc::with(['user', 'file'])
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
        $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'nullable|mimes:pdf,jpg,jpeg,bmp,png,doc,docx,txt,xlsx,odt',
        ]);

        $result = Doc::with(['user', 'file'])
            ->where('id', $id)
            ->first();

        $result->update([
            'title' => $request->title,
        ]);

        if($request->file('file')) {
            $name = $request->file('file')->getClientOriginalName();
            $path = $request->file('file')->store('files', 'local');

            $result->file()->delete();

            $result->file()->create([
                'name' => $name,
                'path' => $path,
            ]);
        }

        return response()->json($result, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $result = Doc::with(['user', 'file'])
            ->where('id', $id)
            ->first();

        if(!$result) {
            return response()->json(null, 404);
        }

        $result->file()->delete();
        $result->delete();

        return response()->json(null, 200);
    }

    /**
     * File download for current controller
     *
     * @param $investment
     * @param $file
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function file($id, $file) {
        $object = Doc::where('id', $id)->first()->file()->where('id', $file)->first();

        $path = storage_path('app') .'/'. $object->path;
        $name = $object->name;

        return response()->download($path, $name);
    }
}
