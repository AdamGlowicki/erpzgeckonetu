<?php

namespace App\Http\Controllers;

use App\CarsItem;
use App\InvestmentsItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Investment;
use App\File;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Validation\Rule;
use DB;
use Zip;

class InvestmentController extends Controller
{
    protected $pagination = 10;
    protected $directions = ['asc', 'desc'];
    protected $columns = [
        'id',
        'investment_name',
        'name',
        'users.name',
        'created_at',
        'date_start',
        'date_end',
    ];

    protected $joins = [
        'users.name' => 'user_id',
    ];

    protected $with = [
        'user',
    ];

    protected $errors = 0;

    public function __construct() {
        $this->middleware('permission:investment-list');
        $this->middleware('permission:investment-list', ['only' => ['file']]);
        $this->middleware('permission:investment-approve', ['only' => ['approve']]);
        $this->middleware('permission:investment-create', ['only' => ['create', 'store']]);
        $this->middleware('permission:investment-edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:investment-delete', ['only' => ['delete']]);
    }

    public function sort(Request $request, $direction, $column) {
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

        if(isset($table)) {
            if($request->q) {
                $items = Investment::with($this->with)
                    ->select('investments.*')
                    ->leftJoin($table, "{$table}.id", "=", "investments.{$this->joins[$column]}")
                    ->where('items.name', 'LIKE', "%{$request->q}%")
                    ->orWhere('investment_name', 'LIKE', "%{$request->q}%")
                    ->orWhere('id', $request->q)
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            } else {
                $items = Investment::with($this->with)
                    ->select('investments.*')
                    ->leftJoin($table, "{$table}.id", "=", "investments.{$this->joins[$column]}")
                    ->parentsOnly()
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            }
        } else {
            if($request->q) {
                $items = Investment::with($this->with)
                    ->where('name', 'LIKE', "%{$request->q}%")
                    ->orWhere('investment_name', 'LIKE', "%{$request->q}%")
                    ->orWhere('id', $request->q)
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            } else {
                $items = Investment::with($this->with)
                    ->parentsOnly()
                    ->orderByRaw("{$column} {$direction}")
                    ->paginate($this->pagination);
            }
        }

        return response()->json($items, 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $result = Investment::with($this->with)->parentsOnly()->paginate(25);

        return response()->json($result, 200);
    }

    public function all() {
        return response()->json(Investment::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->merge(['items' => json_decode($request->items, true)]);

        $request->validate([
            'name' => 'required',
            'num_city' => 'required|min:3|max:3',
            'num_type' => 'required|min:1|max:1',
            'car_id' => 'required|exists:cars,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'investment_id' => 'nullable|exists:investments,id',
            'date_start' => 'required|date',
            'date_end' => 'required|date',
            'file.*' => 'mimes:dwg,dxf,pdf,jpg,jpeg,bmp,png,doc,docx,txt',
            'items.*.item_id' => 'required|integer|exists:items,id',
            'items.*.quantity' => 'required|integer',
        ]);

        $check = Investment::where('document_id', 1)->whereYear('created_at', Carbon::now()->year)->first();

        if($check) {
            $id = Investment::whereYear('created_at', Carbon::now()->year)->max('document_id') + 1;
        } else {
            $id = 1;
        }

        $year = Carbon::now()->year;
        $city = strtoupper($request->num_city);
        $type = strtoupper($request->num_type);

        $year_id = app('App\Investment')->getYearId($year);
        $city_id = app('App\Investment')->getCityId($city, $year);

        $investment = Investment::create([
            'parent_id' => $request->investment_id,
            'document_id' => $id,
            'name' => $request->name,
            'num_year' => $year,
            'num_year_id' => $year_id,
            'num_city' => $city,
            'num_city_id' => $city_id,
            'num_type' => $type,
            'investment_name' => implode('/', [$year, sprintf('%04d', $year_id), $city, sprintf('%04d', $city_id), $type]),
            'date_start' => $request->date_start,
            'date_end' => $request->date_end,
            'user_id' => auth()->user()->id,
            'car_id' => $request->car_id,
            'warehouse_id' => $request->warehouse_id,
            'descr' => $request->descr,
        ]);

        if(count($request->items) > 0 && $request->request_create) {
            $check = \App\Request::where('document_id', 1)->whereYear('created_at', Carbon::now()->year)->first();

            if($check) {
                $id = \App\Request::whereYear('created_at', Carbon::now()->year)->max('document_id') + 1;
            } else {
                $id = 1;
            }

            $r = $investment->request()->create([
                'document_id' => $id,
                'warehouse_id' => $investment->warehouse_id,
                'car_id' => $investment->car_id,
                'user_id' => auth()->user()->id,
                'document_name' => 'ZAP/'. Carbon::now()->year .'/'. $id,
                'date' => $request->date_start,
                'notes' => $request->descr,
                'approved' => 0,
            ]);

            $investment->request_id = $r->id;
            $investment->save();
        }

        if($request->file('file')) {
            foreach($request->file('file') as $file) {
                $name = $file->getClientOriginalName();
                $path = $file->store('files', 'local');

                $investment->file()->create([
                    'name' => $name,
                    'path' => $path,
                ]);
            }
        }

        foreach($request->items as $item) {
            $item = (object) $item;

            $investment->investmentsQueueItem()->create([
                'investment_id' => $investment->id,
                'item_id' => $item->item_id,
                'quantity' => $item->quantity,
                'quantity_used' => 0,
                'comment' => null
            ]);

            if($request->request_create && $item->add_to_request) {
                $investment->request->requestsItem()->create([
                    'item_id' => $item->item_id,
                    'quantity' => $item->quantity,
                ]);
            }
        }

        return response()->json($investment, 201);
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $result = Investment::with([
            'user',
            'investmentsItem',
            'investmentsItem.item',
            'investmentsItem.item.itemsManufacturer',
            'investmentsItem.element',
            'investmentsItem.item.unit',
            'investmentsItem.item.avgPrice',
            'investmentsQueueItem',
            'investmentsQueueItem.item',
            'investmentsQueueItem.item.itemsManufacturer',
            'investmentsQueueItem.item.unit',
            'investmentsQueueItem.item.avgPrice',
            'file'
        ])
        ->find($id);

        return response()->json($result, 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Investment $investment
     * @return \Illuminate\Http\JsonResponse
     */
    public function edit($id)
    {
        $result = Investment::with([
            'user',
            'parent',
            'investmentsItem',
            'investmentsItem.item',
            'investmentsItem.item.itemsManufacturer',
            'investmentsItem.element',
            'investmentsItem.item.unit',
            'investmentsItem.item.avgPrice',
            'investmentsQueueItem',
            'investmentsQueueItem.item',
            'investmentsQueueItem.item.itemsManufacturer',
            'investmentsQueueItem.item.unit',
            'investmentsQueueItem.item.avgPrice',
            'file',
        ])
        ->find($id);

        return response()->json($result, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Investment $investment
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Investment $investment)
    {
        $request->validate([
            'name' => 'required',
            'car_id' => 'required|exists:cars,id',
            'investment_id' => 'nullable|exists:investments,id',
            'file.*' => 'mimes:dwg,dxf,pdf,jpg,jpeg,bmp,png,doc,docx,txt',
            'items.*.item_id' => 'required|integer|exists:items,id',
            'items.*.quantity' => 'required|integer',
            'items.*.quantity_used' => 'integer',
            'items.*.comment' => 'string|max:255|nullable',
        ]);

        if(auth()->user()->can('investment-approve')) {
            $investment->update([
                'name' => $request->name,
                'descr' => $request->descr,
                'date_start' => $request->date_start,
                'date_end' => $request->date_end,
                'car_id' => $request->car_id,
                'parent_id' => $request->investment_id,
            ]);

            if(!$investment->request()->exists() && count(json_decode($request->items))) {
                $check = \App\Request::where('document_id', 1)->whereYear('created_at', Carbon::now()->year)->first();

                if($check) {
                    $id = \App\Request::whereYear('created_at', Carbon::now()->year)->max('document_id') + 1;
                } else {
                    $id = 1;
                }

                $r = $investment->request()->create([
                    'document_id' => $id,
                    'warehouse_id' => $investment->warehouse_id,
                    'car_id' => $investment->car_id,
                    'user_id' => auth()->user()->id,
                    'document_name' => 'ZAP/'. Carbon::now()->year .'/'. $id,
                    'date' => $investment->date_start,
                    'notes' => $investment->descr,
                    'approved' => 0,
                ]);

                $investment->request_id = $r->id;
                $investment->save();
            }
        }

        if($request->file('file')) {
            foreach($request->file('file') as $file) {
                $name = $file->getClientOriginalName();
                $path = $file->store('files', 'local');

                $investment->file()->create([
                    'name' => $name,
                    'path' => $path,
                ]);
            }
        }

        foreach(json_decode($request->items) as $item) {
            $item = (object) $item;

            $search = $investment->investmentsQueueItem()->where('item_id', $item->item_id)->first();

            if($search) {
                if(auth()->user()->can('investment-approve')) {
                    $search->update([
                        'quantity' => $item->quantity,
                    ]);
                } else {
                    $search->update([
                        'quantity_used' => $item->quantity_used,
                        'comment' => $item->comment,
                    ]);
                }
            } else {
                $investment->investmentsQueueItem()->create([
                    'investment_id' => $investment->id,
                    'item_id' => $item->item_id,
                    'quantity' => $item->quantity,
                    'quantity_used' => $item->quantity_used,
                    'comment' => $item->comment,
                ]);
            }

            if(auth()->user()->can('investment-approve')) {
                if($investment->request->approved) {
                    continue;
                }

                $requestItem = $investment->request->requestsItem()->where('item_id', $item->item_id)->first();

                if($requestItem) {
                    $requestItem->update([
                        'quantity' => $item->quantity,
                    ]);
                } else {
                    if($item->add_to_request) {
                        $investment->request->requestsItem()->create([
                            'item_id' => $item->item_id,
                            'quantity' => $item->quantity,
                        ]);
                    }
                }

                $investment->request->update([
                    'notes' => $investment->descr,
                ]);
            }
        }

        return response()->json($investment, 200);
    }

    /**
     * Move queued items to investment from specified car
     *
     * @param Request $request
     * @param Investment $investment
     * @return \Illuminate\Http\JsonResponse
     */
    public function approve(Request $request, Investment $investment) {
        $investment->load([
            'investmentsQueueItem',
            'investmentsQueueItem.item',
            'investmentsQueueItem.item.itemsManufacturer',
            'investmentsQueueItem.item.unit',
            'investmentsQueueItem.item.avgPrice',
        ]);

        $items = $investment->investmentsQueueItem()->get();

        foreach($items as $item) {
            $result = CarsItem::where('car_id', $investment->car_id)->where('item_id', $item->item_id)->where('quantity', '>=', $item->quantity_used)->first();

            if(!$result) {
                $this->errors++;
                break;
            }
        }

        if($this->errors) {
            return response()->json(null, 400);
        }

        foreach($items as $item) {
            $result = CarsItem::where('car_id', $investment->car_id)->where('item_id', $item->item_id)->first();

            if($result) {
                $result->decrement('quantity', $item->quantity_used);

                $found = InvestmentsItem::where('investment_id', $investment->id)->where('item_id', $item->item_id)->first();

                if($found) {
                    $found->increment('quantity', $item->quantity_used);
                } else {
                    InvestmentsItem::create([
                        'investment_id' => $investment->id,
                        'item_id' => $item->item_id,
                        'quantity' => $item->quantity_used,
                    ]);
                }
            }
        }

        return response()->json($investment, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Investment $investment
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(Investment $investment)
    {
        if(!$investment) {
            return response()->json(null, 410);
        }

        try {
            $investment->delete();
        } catch(\Exception $e) {
            return response()->json(null, 409);
        }

        return response()->json(null, 204);
    }

    /**
     * Search in the specified resource
     *
     * @param  string  $string
     * @return \Illuminate\Http\JsonResponse
     */
    public function search($string) {
        $result = Investment::where('id', $string)
            ->orWhere('name', 'LIKE', "%{$string}%")
            ->orWhere('investment_name', 'LIKE', "%{$string}%")->get();

        return response()->json($result, 200);
    }

    /**
     * File download for current controller
     *
     * @param $investment
     * @param $file
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function file($investment, $file) {
        $object = Investment::where('id', $investment)->first()->file()->where('id', $file)->first();

        $path = storage_path('app') .'/'. $object->path;
        $name = $object->name;

        return response()->download($path, $name);
    }

    /**
     * All files download for current controller
     *
     * @param $investment
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function allFiles($investment)
    {
        $object = Investment::where('id', $investment)->first()->file()->get();

        $filename = microtime() . '.zip';
        $package = storage_path($filename);

        $zip = new \ZipArchive();
        $zip->open($package, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);

        foreach ($object as $file) {
            $path = storage_path('app') . '/' . $file->path;
            $name = $file->name;

            $zip->addFile($path, $name);
        }

        $zip->close();

        return response()->download($package, $filename)->deleteFileAfterSend();
    }
}
