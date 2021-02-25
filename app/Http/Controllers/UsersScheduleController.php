<?php

namespace App\Http\Controllers;

use App\UsersSchedulesRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class UsersScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $dt = Carbon::createFromDate(now()->year, now()->month);
        $dt->addMonths(1);

        $d = $dt->firstOfMonth();

        if($d->weekday() === 0) {
            $days = $d->daysUntil($d->copy()->lastOfMonth());
        } else {
            $d->modify('-1 week first Monday');
            $days = $d->daysUntil($d->copy()->addMonths(1)->modify('last Sunday'));
        }

        $result = UsersSchedulesRequest::where('user_id', auth()->user()->id)
            ->where('date', '>=', $days->first()->format('Y-m-d'))
            ->where('date', '<=', $days->last()->format('Y-m-d'))
            ->get();

        $count = UsersSchedulesRequest::select('date', DB::raw('count(date) quantity'))
            ->where('date', '>=', $days->first()->format('Y-m-d'))
            ->where('date', '<=', $days->last()->format('Y-m-d'))
            ->groupBy('date')
            ->get();

        return response()->json(['dates' => $result, 'limits' => $count], 200);
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
            'dates' => 'required',
            'dates.*' => 'date',
        ]);

        $dt = Carbon::createFromDate(now()->year, now()->month);
        $dt->addMonths(1);

        $d = $dt->firstOfMonth();

        if($d->weekday() === 0) {
            $days = $d->daysUntil($d->copy()->lastOfMonth());
        } else {
            $d->modify('-1 week first Monday');
            $days = $d->daysUntil($d->copy()->addMonths(1)->modify('last Sunday'));
        }

        $counterWeeks = 0;

        $calendar = [];

        foreach($days as $day) {
            $calendar[$counterWeeks][] = $day;

            if($day->weekday() === 6) {
                $counterWeeks++;
            }
        }

        $passedWeekdays = true;

        foreach($calendar as $week) {
            $daysCounter = 0;

            foreach($week as $day) {
                if(in_array($day->format('Y-m-d'), $request->dates) && $day->weekday() < 5) {
                    $daysCounter++;
                }

                if($daysCounter < 2 && $day->weekday() === 6) {
                    $passedWeekdays = false;

                    break 2;
                }
            }
        }

        $passedWeekends = true;

        $daysCounter = 0;

        foreach($days as $day) {
            if(in_array($day->format('Y-m-d'), $request->dates) && $day->weekday() >= 5) {
                $daysCounter++;
            }
        }

        if($daysCounter < 3) {
            $passedWeekends = false;
        }

        if(!$passedWeekdays || !$passedWeekends) {
            return response()->json(null, 422);
        }

        $result = UsersSchedulesRequest::where('user_id', auth()->user()->id)
            ->where('date', '>=', $days->first()->format('Y-m-d'))
            ->where('date', '<=', $days->last()->format('Y-m-d'))
            ->get();

        if($result->count() > 0) {
            $result->each(function($item) {
                $item->delete();
            });
        }

        foreach($request->dates as $date) {
            UsersSchedulesRequest::create([
                'user_id' => auth()->user()->id,
                'date' => $date,
            ]);
        }

        return response()->json(null, 200);
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
        //
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
