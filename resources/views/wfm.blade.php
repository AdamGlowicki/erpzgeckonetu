@extends('layouts.app')

@php ($title = __('wfm.title'))

@section('style')
<link rel="stylesheet" href="assets/css/ion.rangeSlider.min.css" />
@endsection

@section('content')
<div class="content">
    <div class="row" data-section="wiki">
        <div class="col">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title">
                        <i class="fa fa-calendar-check"></i>
                        <span class="ml-2 mr-1">Twoja dyspozycyjność dyżurów</span>
                        <span class="pull-right">
                            <!-- <i class="tim-icons icon-simple-add action-add font-weight-bold" data-element="wiki"></i> -->
                        </span>
                    </h4>
                </div>
                <div class="card-body">
                    <div class="row" data-resource="wfm">
                        <div class="col">
                            <span class="ml-3 d-block">
                                <h3 class="mb-0" id="monthAndYear" class="bold"></h3>
                            </span>
                            <span class="d-block ml-4 mb-2 mt-1 mb-3">
                                Aby dyspozycyjność została przyjęta należy wybrać:<br/>
                                - min. 2 dni robocze w każdym tygodniu<br/>
                                - min. 3 dni wolne/święta w miesiącu
                            </span>
                            <table class="table table-bordered table-responsive-sm" id="calendar">
                                <thead>
                                <tr>
                                    <th>Pon</th>
                                    <th>Wt</th>
                                    <th>Śr</th>
                                    <th>Czw</th>
                                    <th>Pt</th>
                                    <th>Sob</th>
                                    <th>Nd</th>
                                </tr>
                                </thead>
                                <tbody class="calendar-body">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="pull-right">
                        <button class="btn btn-primary" type="submit" data-type="add">Zapisz</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('script')
<script src="assets/js/plugins/moment-with-locales.min.js"></script>
<script src="assets/js/plugins/moment-timezone-with-data.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment-range/4.0.2/moment-range.js" integrity="sha512-XKgbGNDruQ4Mgxt7026+YZFOqHY6RsLRrnUJ5SVcbWMibG46pPAC97TJBlgs83N/fqPTR0M89SWYOku6fQPgyw==" crossorigin="anonymous"></script>
<script src="assets/js/plugins/ion.rangeSlider.min.js"></script>
<script src="{{ mix('assets/js/services/wfm.js') }}"></script>
@endsection
