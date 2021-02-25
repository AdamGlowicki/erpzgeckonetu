<?php

namespace App\Http\Controllers;

use App\Task;
use Illuminate\Http\Request;

class TasksController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct() {
        $this->middleware('permission:task-list');
        $this->middleware('permission:task-store', ['only' => ['store',]]);
        $this->middleware('permission:task-get', ['only' => ['create', 'show', 'index']]);
        $this->middleware('permission:task-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:task-delete', ['only' => ['delete']]);
    }
    public function index()
    {

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {

    }

    public function increasePosition($position, $invest_id) {
        Task::where('invest_id', $invest_id)
        ->where('position', '>', $position)->each(function($item) {
            $item->update(['position' => $item->position + 1]);
        });
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $id)
    {
        $data = $request->all();
        $post = Task::create($data);
        return response()->json(Task::where('invest_id', $id)->get());
    }

    public function storeAll(Request $request, $id) {
        $tasks = $request->all();
        foreach ($tasks as $task) {
            Task::create($task);
        }
        return response()->json(Task::where('invest_id', $id)->get());
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
        $taskAll = $request->all();
        $task = Task::findOrFail($id);
        $task->update($taskAll);
    }

    public function updateOrder(Request $request) {
        $tasksList = $request->all();
        foreach ($tasksList as $taskItem) {
            $task = Task::findOrFail($taskItem['id']);
            $task->update($taskItem);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
       $task->removeTask($id);
    }
}
