@extends('layouts.app')

@php ($title = __('nodes.title'))

@section('style')
    <style>
        #map {
            height: 700px;
            width: 100%;
        }
    </style>
@endsection

@section('content')
    <div class="row">
        <div class="col">
            <div class="card mb-0">
                <div class="card-body">
                    <div id="map">
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('script')
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBC1EAoKhRVHYP-vf_7Jpi6R2yysHmeSHY"></script>
    <script src="{{ mix('assets/js/services/nodes.js') }}"></script>
@endsection
