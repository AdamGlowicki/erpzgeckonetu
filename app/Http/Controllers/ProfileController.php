<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Hash;
use Illuminate\Support\Carbon;

class ProfileController extends Controller
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
    public function show()
    {
        $user = auth()->user();

        $profile = [
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'address' => $user->address,
                'postcode' => $user->postcode,
                'city' => $user->city,
                'country_id' => $user->country_id,
                'desc' => $user->desc,
                'role' => $user->getRoleNames(),
            ],
        ];

        return response()->json($profile, 200);
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'phone' => 'nullable|min:12|max:12',
            'postcode' => 'nullable|min:6|max:6',
            'desc' => 'nullable|max:255',
            'address' => 'nullable|max:255',
            'city' => 'nullable|max:255',
            'country_id' => 'nullable|integer',
        ]);

        $user = User::findOrFail(auth()->user()->id);
        $user->fill($data);
        $user->save();

        return response()->json(['data' => $user], 200);
    }

    public function avatar(Request $request) {
        $request->validate([
            'avatar' => 'image|required|max:2048',
        ]);

        $path = $request->file('avatar')->store('avatars');

        $user = User::findOrFail(auth()->user()->id);
        $user->avatar = $path;
        $user->save();

        return response()->json(['data' => $user], 200);
    }

    public function getAvatar(Request $request) {
        $user = User::findOrFail(auth()->user()->id)->avatar;

        return response()->json(['data' => $user], 200);
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

    public function permissions() {
        $permissions = auth()->user()->getPermissionsViaRoles()->pluck('name');

        return response()->json($permissions, 200);
    }

    public function role() {
        $user = auth()->user();

        if(!auth()->user()->roles) {
            return response()->json(null, 422);
        }

        $role = $user->roles->first()->id;

        return response()->json($role, 200);
    }

    public function password(Request $request) {
        $rules = [
            'password' => ['required', 'string'],
            'password_new' => ['min:8', 'required_with:password_new_repeat', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};\':\"\\|,.<>\/])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/]{8,}$/'],
            'password_new_repeat' => ['min:8', 'same:password_new'],
        ];

        $request->validate($rules);

        $user = auth()->user();

        if(!Hash::check($request->password, $user->password)) {
            return response()->json(null, 400);
        }

        if(!hash_equals($request->password_new, $request->password_new_repeat)) {
            return response()->json(null, 400);
        }

        if(Hash::check($request->password_new, $user->password)) {
            return response()->json(null, 400);
        }

        $history = $user->passwordHistory()->where('created_at', '>=', Carbon::now()->addDays(-180))->get();

        foreach($history as $item) {
            if(Hash::check($request->password_new, $item->hash)) {
                return response()->json(null, 400);
            }
        }

        $user->password = Hash::make($request->password_new);
        $user->passwordHistory()->create([
            'hash' => Hash::make($request->password_new),
        ]);

        $user->api_token = null;
        $user->app_token = null;
        $user->password_changed_at = now()->format('Y-m-d H:i:s');
        $user->save();

        return response()->json(null, 200);
    }
}
