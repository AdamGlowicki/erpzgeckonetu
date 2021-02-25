<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Mail;

class UserController extends Controller
{
    protected $pagination = 25;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'name',
        'username',
        'email',
        'phone',
        'address',
        'postcode',
        'city',
        'countries.code',
        'created_at',
    ];

    protected $joins = [
        'countries.code' => 'country_id',
    ];

    protected $with = [
        'country',
    ];

    public function notifications() {
        $result = auth()->user()->unreadNotifications()->take(10)->get();

        return response()->json($result, 200);
    }

    public function search($str) {
        return response()->json(['data' => Item::with(['itemsManufacturer', 'unit'])->where('model_name', 'LIKE', "%{$str}%")->orWhereHas('itemsManufacturer', function($query) use ($str) {
            $query->where('name', 'LIKE', "%{$str}%");
        })->get()], 200);
    }

    public function all($hideDisabled = false) {
        $users = User::with(['country', 'roles'])
            ->where(function($query) use ($hideDisabled) {
                if($hideDisabled) {
                    $query->hideDisabled();
                }
            })
            ->orderByRaw("SUBSTRING_INDEX(name, ' ', -1)")
            ->get();

        $users->makeHidden('api_token');
        $users->makeHidden('app_token');

        return response()->json($users, 200);
    }

    public function allActive() {
        return $this->all(true);
    }

    public function allCars() {
        $users = User::whereNotIn('id', function($query) {
            $query->select('user_id')->from('cars_users');
        })->get();

        return response()->json($users, 200);
    }

    public function sort($direction, $column) {
        $validation = Validator::make(['column' => $column, 'direction' => $direction], [
            'column' => ['required', Rule::in($this->columns)],
            'direction' => ['required', Rule::in($this->directions)]
        ]);

        if($validation->fails()) {
            return response()->json(null, 400);
        }

        if(count(explode('.', $column)) > 1) {
            $table = explode('.', $column)[0];
        }

        switch($direction) {
            case 'asc':
                if(isset($table)) {
                    $items = Item::with($this->with)->select('items.*')->leftJoin($table, "{$table}.id", "=", "items.{$this->joins[$column]}")->orderByRaw("{$column} ASC")->paginate($this->pagination);
                } else {
                    $items = Item::with($this->with)->orderByRaw(isset($this->extra[$column]) ? $this->extra[$column] : $column .' ASC')->paginate($this->pagination);
                }

                break;
            case 'desc':
                if(isset($table)) {
                    $items = Item::with($this->with)->select('items.*')->leftJoin($table, "{$table}.id", "=", "items.{$this->joins[$column]}")->orderByRaw("{$column} DESC")->paginate($this->pagination);
                } else {
                    $items = Item::with($this->with)->orderByRaw(isset($this->extra[$column]) ? $this->extra[$column] : $column .' DESC')->paginate($this->pagination);
                }

                break;
        }

        return response()->json($items, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $user = User::create($request->all());

        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return User
     */
    public function show(User $user)
    {
        return $user;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, User $user)
    {
        $user->update($request->all());

        return response()->json($user, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function delete(User $user)
    {
        $user->delete();

        return response()->json(null, 204);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function settings(Request $request)
    {
        $result = Setting::all();

        return response()->json($result, 200);
    }


    public function mailOpened($id, $token, $type) {
        $file = storage_path('app/public/assets/img/1x1.png');

        $typ = '';
        $kontakt = '';

        switch($type) {
            case 'w':
                $row = \DB::table('gminy')->where('id', $id)->where('wlodarz_seen', 0)->first();

                if($row) {
                    $kontakt = $row->wlodarz ."\r\n". $row->wlodarz_tel;
                }

                \DB::table('gminy')->where('wlodarz_token', $token)->update(['wlodarz_seen' => 1]);

                $typ = 'Włodarz';

                break;
            case 's':
                $row = \DB::table('gminy')->where('id', $id)->where('sekretarz_seen', 0)->first();

                if($row) {
                    $kontakt = $row->sekretarz ."\r\n". $row->sekretarz_tel;
                }

                \DB::table('gminy')->where('sekretarz_token', $token)->update(['sekretarz_seen' => 1]);

                $typ = 'Sekretarz';

                break;
            case 'i':
                $row = \DB::table('gminy')->where('id', $id)->where('informatyk_seen', 0)->first();

                if($row) {
                    $kontakt = $row->informatyk ."\r\n". $row->informatyk_tel;
                }

                \DB::table('gminy')->where('informatyk_token', $token)->update(['informatyk_seen' => 1]);

                $typ = 'Informatyk';

                break;
        }

        if($row) {
            $data = [
                'gmina' => $row->gmina,
                'osoba' => $typ ."\r\n". $kontakt,
            ];

            Mail::send('emails.confirm', $data, function($message) use ($row) {
                $message->from('zdalnaszkola@geckonet.pl', 'Zdalna Szkoła');
                $message->sender('zdalnaszkola@geckonet.pl', 'Zdalna Szkoła');
                $message->to('zdalnaszkola@geckonet.pl', $name = null);
                // $message->cc($address, $name = null);
                // $message->bcc($address, $name = null);
                $message->replyTo('zdalnaszkola@geckonet.pl', 'Zdalna Szkoła');
                $message->subject('Program Zdalna Szkoła: wyświetlenie wiadomości');
                // $message->priority($level);
            });
        }

        return response()->file($file);
    }

    public function mailOpened2($id, $token, $type) {
        $file = storage_path('app/public/assets/img/1x1.png');

        $typ = '';
        $kontakt = '';

        switch($type) {
            case 'w':
                $row = \DB::table('gminy2')->where('id', $id)->where('wlodarz_seen', 0)->first();

                if($row) {
                    $kontakt = $row->wlodarz ."\r\n". $row->wlodarz_tel;
                }

                \DB::table('gminy2')->where('wlodarz_token', $token)->update(['wlodarz_seen' => 1]);

                $typ = 'Włodarz';

                break;
            case 's':
                $row = \DB::table('gminy2')->where('id', $id)->where('sekretarz_seen', 0)->first();

                if($row) {
                    $kontakt = $row->sekretarz ."\r\n". $row->sekretarz_tel;
                }

                \DB::table('gminy2')->where('sekretarz_token', $token)->update(['sekretarz_seen' => 1]);

                $typ = 'Sekretarz';

                break;
            case 'i':
                $row = \DB::table('gminy2')->where('id', $id)->where('informatyk_seen', 0)->first();

                if($row) {
                    $kontakt = $row->informatyk ."\r\n". $row->informatyk_tel;
                }

                \DB::table('gminy2')->where('informatyk_token', $token)->update(['informatyk_seen' => 1]);

                $typ = 'Informatyk';

                break;
        }

        if($row) {
            $data = [
                'gmina' => $row->gmina,
                'osoba' => $typ ."\r\n". $kontakt,
            ];

            Mail::send('emails.confirm2', $data, function($message) use ($row) {
                $message->from('zdalnaszkola@geckonet.pl', 'Zdalna Szkoła');
                $message->sender('zdalnaszkola@geckonet.pl', 'Zdalna Szkoła');
                $message->to('zdalnaszkola@geckonet.pl', $name = null);
                // $message->cc($address, $name = null);
                // $message->bcc($address, $name = null);
                $message->replyTo('zdalnaszkola@geckonet.pl', 'Zdalna Szkoła');
                $message->subject('Program Zdalna Szkoła: wyświetlenie wiadomości');
                // $message->priority($level);
            });
        }

        return response()->file($file);
    }

    public function work(Request $request) {
        $request->validate([
            'status' => 'required|boolean',
            'versionCode' => 'sometimes|integer'
        ]);

        if($request->status) {
            activity()
                ->withProperties(['status' => true, 'versionCode' => $request->versionCode ?? null])
                ->log('Rozpoczęcie pracy');
        } else {
            activity()
                ->withProperties(['status' => false, 'versionCode' => $request->versionCode ?? null])
                ->log('Zakończenie pracy');
        }

        return response()->json(['data' => null], 200);
    }

    public function getLoggedUser($id) {
        $user = User::findOrFail($id);
        $name = $user->name;
        return response()->json($name);
    }
}
