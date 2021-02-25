<?php

namespace App\Http\Controllers;

use App\InvestmentMailProperty;
use App\Mail\InvestmentNotification;
use App\User;
use Illuminate\Http\Request;

use App\Invest;
use Illuminate\Support\Facades\Mail;

class InvestController extends Controller
{
    public function __construct() {
        $this->middleware('permission:invest-list');
        $this->middleware('permission:invest-store', ['only' => ['store',]]);
        $this->middleware('permission:invest-get', ['only' => ['create', 'show', 'index']]);
        $this->middleware('permission:invest-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:invest-delete', ['only' => ['delete']]);
    }

    public function index() {
        $result = Invest::with([
            'investFiles',
            'tasks.folders',
            'tasks.folders.folderFiles',
            'tasks.tables.heads',
            'tasks.tables.bodies',
            'tasks.tables.bodies.prevFiles',
            'tasks.tables.bodies.postFiles',
            'tasks.tables.bodies.secondFiles',
            'tasks.tables.bodies.secondPostFiles',
            'drawers',
        ])->get();
        return response()->json($result, 200);
    }

    public function store(Request $request) {
        $validateData = $request->validate([
            'parent_id' => 'nullable',
            'level' => 'nullable',
            'client' => 'nullable',
            'stage_name' => 'nullable',
            'main' => 'nullable',
            'country' => 'nullable',
            'adder' => 'nullable',
            'add_date' => 'nullable',
            'deadline' => 'nullable',
            'tech' => 'nullable',
            'description' => 'nullable',
            'condition' => 'nullable',
            'condition_term' => 'nullable',
            'arrangements' => 'nullable',
            'group' => 'nullable',
        ]);
        $post = Invest::create($validateData);

        return response()->json($post);
    }

    public function destroy(Request $request) {
        $investIds = $request->ids;
        foreach ($investIds as $id) {
            $invest = Invest::findOrFail($id);
            $invest->removeInvest($id);
        }
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
        $data = $request->all();
        $invest = Invest::findOrFail($id);
        if ($request->drawer_id) {
            $invest->drawer_id = $request->drawer_id;
            $invest->save();
        }

        $invest->update($data);
        return response()->json($invest);
    }

    public function sendNotificationMail(Request $request) {
        $notification = new InvestmentMailProperty();

        $email = User::findOrFail($request->id)->email;

        $notification->setMail($request->mail);


        Mail::to($email)->send(new InvestmentNotification($notification));
    }

}
