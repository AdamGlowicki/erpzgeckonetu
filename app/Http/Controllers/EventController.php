<?php

namespace App\Http\Controllers;

use App\Client;
use App\Event;
use App\EventsNote;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Spatie\Activitylog\Models\Activity;
use Storage;

class EventController extends Controller
{
    protected $relations = [
        'eventsReminder',
        'eventsNote',
        'eventsNote.user',
        'eventsNote.file',
        'userCreated',
        'user',
        'client',
        'investment',
        'history',
        'history.causer',
    ];

    public function __construct() {
        $this->middleware('permission:event-list', ['only' => ['index']]);
        $this->middleware('permission:event-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:event-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:event-delete', ['only' => ['delete']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @param $start
     * @param $end
     * @param null $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request, $start, $end, $user = null)
    {
        $request->validate([
            'user' => 'nullable|json',
        ]);

        $result = Event::with($this->relations)
            ->where('start', '>=', $start)
            ->where('end', '<=', $end)
            ->where(function($query) use ($user) {
                if(!auth()->user()->can('event-list-all') && !auth()->user()->can('event-list-all-geo')) {
                    $user = json_encode([auth()->user()->id]);
                }

                if($user !== null) {
                    $query->whereIn('user_id', json_decode($user));
                }
            })
            ->where(function($query) use ($request) {
                if($request->search) {
                    $query->where('title', 'LIKE', "%{$request->search}%")
                        ->orWhere('description', 'LIKE', "%{$request->search}%")
                        ->orWhere('phone', 'LIKE', "%{$request->search}%")
                        ->orWhere('address', 'LIKE', "%{$request->search}%")
                        ->orWhereHas('client', function($query) use ($request) {
                            $query->where('name', 'LIKE', "%{$request->search}%")
                                ->orWhere('client_id', 'LIKE', "%{$request->search}%");
                        })
                        ->orWhereHas('investment', function($query) use ($request) {
                            $query->where('name', 'LIKE', "%{$request->search}%");
                        });
                }
            })
            ->where(function($query) use ($request) {
                if(auth()->user()->can('event-list-all-geo')) {
                    $users = [auth()->user()->id];

                    foreach(\App\User::all() as $user) {
                        if($user->can('project-creator')) {
                            $users[] = $user->id;
                        }
                    }

                    $query->whereIn('user_created_id', $users);
                }
            })
            ->orderBy('start', 'asc')
            ->get();

        return response()->json([
            'data' => $result
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {

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
            'start' => 'required|date',
            'end' => 'required|date',
            'title' => 'required',
            'priority' => 'required|integer',
            'all_day' => 'required|boolean',
            'user_id' => 'nullable|exists:users,id',
            'type' => 'required|integer',
        ]);

        if($request->client_id) {
            $client = Client::where('client_id', $request->client_id)->first();

            if(!$client) {
                $input = app('App\Client')->search($request->client_id);

                $result = app('App\Client')->add($input);

                $request->client_id = $result->id;
            } else {
                $request->client_id = $client->id;
            }
        }

        $result = Event::create([
            'user_created_id' => auth()->user()->id,
            'user_id' => $request->user_id,
            'client_id' => $request->client_id,
            'investment_id' => $request->investment_id,
            'start' => $request->start,
            'end' => $request->end,
            'title' => $request->title,
            'description' => $request->description,
            'status' => 0,
            'priority' => $request->priority,
            'address' => $request->address,
            'phone' => $request->phone,
            'all_day' => $request->all_day,
            'type' => $request->type,
        ]);

        $result->load($this->relations);

        if($result->user !== null) {
            try {
                $result->user->notify(new \App\Notifications\NewEventNotification($result));
            } catch(\Illuminate\Broadcasting\BroadcastException $e) {
                report($e);
            }
        }

        Event::notifyRefresh();

        return response()->json([
            'data' => $result
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeFile($id, Request $request) {
        $request->validate([
            'file' => 'mimes:jpeg,jpg,png,mp4',
        ]);

        $event = Event::find($id);

        if($request->file('file')) {
            $name = $request->file('file')->getClientOriginalName();
            $path = $request->file('file')->store('files', 'local');

            $file = $event->file()->create([
                'name' => $name,
                'path' => $path,
            ]);

            $event->eventsNote()->create([
                'user_id' => auth()->user()->id,
                'file_id' => $file->id,
                'note' => 'Dodano zdjęcie lub film',
            ]);
        }

        return response()->json([
            'data' => $event
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeNote($id, Request $request) {
        $request->validate([
            'note' => 'required|string',
        ]);

        $event = Event::find($id);

        if(!$event) {
            return response()->json(['data' => null], 400);
        }

        $result = $event->eventsNote()->create([
            'event_id' => $id,
            'user_id' => auth()->user()->id,
            'file_id' => null,
            'note' => $request->note,
        ]);

        return response()->json([
            'data' => $result
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $object = Event::find($id);

        $object->load($this->relations);
        $object->load([
            'client.node',
            'client.node.address',
        ]);

        return response()->json([
            'data' => $object
        ], 200);
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
    public function update(Request $request, $id)
    {
        $request->validate([
            'start' => 'required|date',
            'end' => 'required|date',
            'title' => 'sometimes|required',
            'priority' => 'sometimes|required|integer',
            'user_id' => 'sometimes|nullable|exists:users,id',
            'all_day' => 'sometimes|boolean',
            'type' => 'integer|required_with:title',
        ]);

        $object = Event::where('id', $id)->first();

        if(!$object) {
            return response()->json(null, 422);
        }

        if($request->client_id) {
            $client = Client::where('client_id', $request->client_id)->first();

            if(!$client) {
                $input = app('App\Client')->search($request->client_id);

                $result = app('App\Client')->add($input);

                $request->client_id = $result->id;
            } else {
                $request->client_id = $client->id;
            }
        }

        $object->update([
            'start' => $request->start,
            'end' => $request->end,
            'user_id' => $request->user_id ? $request->user_id : $object->user_id,
            'client_id' => $request->client_id ? $request->client_id : $object->client_id,
            'investment_id' => $request->investment_id ? $request->investment_id : $object->investment_id,
            'title' => $request->title ? $request->title : $object->title,
            'description' => $request->description ? $request->description : $object->description,
            'priority' => is_numeric($request->priority) ? $request->priority : $object->priority,
            'address' => $request->address ? $request->address : $object->address,
            'phone' => $request->phone ? $request->phone : $object->phone,
            'all_day' => isset($request->all_day) ? $request->all_day : $object->all_day,
            'type' => isset($request->type) ? $request->type : $object->type,
        ]);

        Event::notifyRefresh();

        return response()->json($object, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        Event::where('id', $id)->first()->delete();

        Event::notifyRefresh();

        return response()->json(null, 204);
    }

    public function status($event, Request $request) {
        $request->validate([
            'status' => 'required|between:1,2',
        ]);

        $object = Event::with(['client'])
            ->where('id', $event)
            ->first();

        if(auth()->user()->id !== $object->user_id || !$object) {
            return response()->json(['data' => null], 400);
        }

        switch($request->status) {
            case 1:
                if($object->status != 0) {
                    return response()->json(['data' => null], 400);
                }

                break;
            case 2:
                if($object->status != 1) {
                    return response()->json(['data' => null], 400);
                }

                if($object->client && Arr::has([0, 1, 2, 3, 4], $object->type)) {
                    $in = \App\CarsIn::where('client_id', $object->client->id)
                        ->whereDate('created_at', now()->format('Y-m-d'))
                        ->exists();

                    $out = \App\CarsOut::where('client_id', $object->client->id)
                        ->whereDate('created_at', now()->format('Y-m-d'))
                        ->exists();

                    if(!$in && !$out) {
                        return response()->json(['data' => null], 400);
                    }
                }

                break;
            default:
                return response()->json(['data' => null], 400);
        }

        $object->update(['status' => $request->status]);

        Event::notifyRefresh();

        return response()->json(['data' => null], 200);
    }

    public function active() {
        $object = Event::where('user_id', auth()->user()->id)
            ->where('status', 1)
            ->exists();

        if(!$object) {
            return response()->json(['active' => false], 200);
        }

        return response()->json(['active' => true], 200);
    }

    public function note($event) {
        $object = EventsNote::where('event_id', $event)
            ->whereNotNull('file_id');

        $object_note = EventsNote::where('event_id', $event)
            ->whereNull('file_id');

        if($object->count() >= 3 && $object_note->count() >= 1) {
            return response()->json(['note' => true], 200);
        }

        return response()->json(['note' => false], 200);
    }
}
