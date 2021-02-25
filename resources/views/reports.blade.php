@extends('layouts.app')

@php ($title = __('reports.title'))

@section('style')
@endsection

@section('content')
<div class="content">
    <div class="loading">
        <div class="spinner">
            <div class="fa-3x">
                <i class="fas fa-circle-notch fa-spin"></i>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="card-header">
            <h4 class="card-title">
                <i class="fa fa-file-archive"></i>
                <span class="ml-2 mr-1">Raport pracy</span>
                <span class="pull-right">
                    <div class="row form-group">
                        @if (app('App\User')->api()->can('root'))
                        <div class="col">
                            <select class="form-control" name="user_id">
                            </select>
                        </div>
                        @endif
                        <div class="col">
                            <input class="form-control" type="month" name="month">
                        </div>
                    </div>
                </span>
            </h4>
        </div>
        <div class="card-body">
            <table class="table" data-element="report">
                <thead>
                    <tr>
                        <th style="width: 8.5%;"></th>
                        <th style="width: 86%">Opis prac</th>
                        <th style="width: 5.5%;">Nadgodz.</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection

@section('script')
<script src="assets/js/plugins/moment-with-locales.min.js"></script>
<script src="{{ Helpers::asset('assets/js/services/reports.js') }}"></script>
@endsection
