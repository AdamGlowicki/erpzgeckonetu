<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * User constructor.
     */
    public function __construct() {
        $this->middleware('permission:admin/user-list');
        $this->middleware('permission:admin/user-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:admin/user-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:admin/user-delete', ['only' => ['delete']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @param null $sortBy
     * @param null $sortDirection
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request, $column = null, $direction = null)
    {
        $result = \App\Admin\User::with([
            'country',
            'roles',
        ]);

        if($column && $direction) {
            $result = $result->orderByJoin($column, $direction);
        }

        $result = $result->paginate(10);

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
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:32|unique:users|regex:/^[0-9A-Za-z.\-\@_]+$/',
            'password' => 'required|string|min:8',
            'email' => 'required|email:rfc|unique:users|max:255',
            'phone' => 'nullable|string|max:255',
            'active' => 'required|in:0,1',
            'role_id' => 'required|integer|exists:roles,id',
        ]);

        $result = \App\Admin\User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'email' => $request->email,
            'phone' => $request->phone,
            'active' => $request->active,
        ]);

        $result->assignRole($request->role_id);

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
        $result = \App\Admin\User::with([
            'country',
            'roles',
        ])->find($id);

        if(!$result) {
            return response()->json(null, 404);
        }

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
        $result = \App\Admin\User::with([
            'country',
            'roles',
        ])->find($id);

        if(!$result) {
            return response()->json(null, 404);
        }

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
        $user = \App\Admin\User::find($id);

        if(!$user) {
            return response()->json(null, 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:32|unique:users,username,'. $user->id .'|regex:/^[0-9A-Za-z.\-\@_]+$/',
            'password' => 'nullable|string|min:8',
            'email' => 'required|email:rfc|unique:users,email,'. $user->id .'|max:255',
            'phone' => 'nullable|string|max:255',
            'active' => 'required|in:0,1',
            'role_id' => 'required|integer|exists:roles,id',
        ]);

        $result = $user->update([
            'name' => $request->name,
            'username' => $request->username,
            'password' => $request->filled('password') ? Hash::make($request->password) : $user->password,
            'email' => $request->email,
            'phone' => $request->filled('phone') ? $request->phone : $user->phone,
            'active' => $request->active,
        ]);

        $user->syncRoles($request->role_id);

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
        //
    }
}
