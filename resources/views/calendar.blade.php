@extends('layouts.app')

@php ($title = __('calendar.title'))

@section('style')
<link href="assets/js/plugins/fullcalendar/core/main.min.css" rel="stylesheet">
<link href="assets/js/plugins/fullcalendar/daygrid/main.min.css" rel="stylesheet">
<link href="assets/js/plugins/fullcalendar/timegrid/main.min.css" rel="stylesheet">
<link href="assets/js/plugins/fullcalendar/list/main.min.css" rel="stylesheet">
<link href="assets/css/ekko-lightbox.css" rel="stylesheet">
@endsection

@section('content')
<div class="row" data-object="event" style="margin-bottom: -55px;">
    <div class="col">
        <div class="card animated fadeIn">
            <div class="card-header">
                <h4 class="card-title">
                    <i class="fa fa-calendar-check"></i>
                    <span class="ml-2 mr-1">Kalendarz prac</span>
                    <span class="pull-right">
                        <form class="list-inline-item form-inline" autocomplete="off">
                            @if (app('App\User')->api()->can('event-list-all'))
                            <select class="selectpicker mt-1" name="uid" title="Wszyscy użytkownicy" data-live-search="true" multiple>
                            </select>
                            @endif
                            <input type="text" class="form-control-search ml-3" name="search" data-search="event" placeholder="wyszukaj zadanie" aria-label="wyszukaj zadanie">
                        </form>
                        <!-- <i class="tim-icons icon-simple-add action-add font-weight-bold" data-element="event"></i> -->
                    </span>
                </h4>
            </div>
            <div class="card-body">
                <div class="col animated fadeIn" data-object="calendar">
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('script')
<script src="assets/js/plugins/moment-duration-format.js"></script>
<script src="assets/js/plugins/moment-timezone-with-data.min.js"></script>
<script src="assets/js/plugins/fullcalendar/core/main.min.js"></script>
<script src="assets/js/plugins/fullcalendar/daygrid/main.min.js"></script>
<script src="assets/js/plugins/fullcalendar/timegrid/main.min.js"></script>
<script src="assets/js/plugins/fullcalendar/interaction/main.min.js"></script>
<script src="assets/js/plugins/fullcalendar/list/main.min.js"></script>
<script src="assets/js/plugins/fullcalendar/interaction/main.min.js"></script>
<script src="assets/js/plugins/wow.min.js"></script>
<script src="assets/js/plugins/ekko-lightbox.min.js"></script>
<script src="{{ Helpers::asset('assets/js/services/calendar.js') }}"></script>
@endsection
