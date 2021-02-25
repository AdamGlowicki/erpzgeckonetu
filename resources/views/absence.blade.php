@extends('layouts.app')

@php ($title = __('absence.title'))

@section('style')

@endsection

@section('content')
    <div class="content">
        <div class="row" data-section="wiki">
            <div class="col-lg-12 col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">
                            <i class="fa fa-mail-bulk"></i>
                            <span class="ml-2 mr-1">Moje wnioski</span>
                            <span class="pull-right">
                                <a class="btn btn-primary btn-block btn-large dropdown-toggle" href="#">
                                    Złóż wniosek
                                    <span class="ml-1 fa fa-plus d-inline"></span>
                                </a>
                            </span>
                        </h4>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-8">
                                <div class="row m-1">
                                    <div class="col" data-filter-col-on="col-lg-12" data-filter-col-off="col-lg-8" data-filter="on">
                                        <div class="alert alert-dark">
                                            <button type="button" aria-hidden="true" class="close" aria-label="Edycja">
                                                <i class="fa fa-ellipsis-v"></i>
                                            </button>
                                            <span class="user-with-image">
                                                <div class="row">
                                                    <div class="col-lg-3 mt-1 align-self-lg-center">
                                                        23 maja - 29 maja
                                                    </div>
                                                    <div class="col-lg-3 mt-1">
                                                        <div class="col-md-12">
                                                            <a href="/absence/details/13" class="avatar avatar-td-info color-38454e">
                                                                Urlop wypoczynkowy
                                                            </a>
                                                        </div>
                                                        <div class="user-position col-md-12">
                                                            7 dni
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-3  align-self-lg-center">
                                                        <img class="photo mr-1" src="storage/avatars/xcZo4DX1pllOXe6LYsv7iNTMBdP8y1fuKxSwZnFk.jpeg" alt=""> Radosław Sułkowski
                                                    </div>
                                                    <div class="col-lg-3 align-self-lg-center">
                                                        <span class="alert alert-warning p-2">Do rozpatrzenia</span>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row m-1">
                                    <div class="col" data-filter-col-on="col-lg-12" data-filter-col-off="col-lg-8" data-filter="on">
                                        <div class="alert alert-dark">
                                            <button type="button" aria-hidden="true" class="close" aria-label="Edycja">
                                                <i class="fa fa-ellipsis-v"></i>
                                            </button>
                                            <span class="user-with-image">
                                                <div class="row">
                                                    <div class="col-lg-3 mt-1 align-self-lg-center">
                                                        23 maja - 29 maja
                                                    </div>
                                                    <div class="col-lg-3 mt-1">
                                                        <div class="col-md-12">
                                                            <a href="/absence/details/13" class="avatar avatar-td-info color-38454e">
                                                                Urlop wypoczynkowy
                                                            </a>
                                                        </div>
                                                        <div class="user-position col-md-12">
                                                            7 dni
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-3  align-self-lg-center">
                                                        <img class="photo mr-1" src="storage/avatars/xcZo4DX1pllOXe6LYsv7iNTMBdP8y1fuKxSwZnFk.jpeg" alt=""> Radosław Sułkowski
                                                    </div>
                                                    <div class="col-lg-3 align-self-lg-center">
                                                        <span class="alert alert-success p-2">Zaakceptowany</span>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row m-1">
                                    <div class="col" data-filter-col-on="col-lg-12" data-filter-col-off="col-lg-8" data-filter="on">
                                        <div class="alert alert-dark">
                                            <button type="button" aria-hidden="true" class="close" aria-label="Edycja">
                                                <i class="fa fa-ellipsis-v"></i>
                                            </button>
                                            <span class="user-with-image">
                                                <div class="row">
                                                    <div class="col-lg-3 mt-1 align-self-lg-center">
                                                        23 maja - 29 maja
                                                    </div>
                                                    <div class="col-lg-3 mt-1">
                                                        <div class="col-md-12">
                                                            <a href="/absence/details/13" class="avatar avatar-td-info color-38454e">
                                                                Urlop wypoczynkowy
                                                            </a>
                                                        </div>
                                                        <div class="user-position col-md-12">
                                                            7 dni
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-3  align-self-lg-center">
                                                        <img class="photo mr-1" src="storage/avatars/xcZo4DX1pllOXe6LYsv7iNTMBdP8y1fuKxSwZnFk.jpeg" alt=""> Radosław Sułkowski
                                                    </div>
                                                    <div class="col-lg-3 align-self-lg-center">
                                                        <span class="alert alert-danger p-2">Anulowany</span>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-4" data-filter-col-on="col-lg-12" data-filter-col-off="col-lg-4" data-filter="on">
                                <div class="grid simple">
                                    <div class="grid-title grid-title-16" id="usage-vacation">Urlop do wykorzystania</div>
                                    <div class="grid-body" style="min-height: 235px;">
                                        <div class="row m-3">
                                            <div class="col-md-12 mb-2">
                                                <div class="float-left easy-pie-custom easy-pie-1 easyPieChart" data-percent="100.00" style="width: 40px; height: 40px; line-height: 40px;">
                                                    <span class="easy-pie-percent-40 font-size-13">26</span>
                                                    <canvas width="40" height="40"></canvas></div>
                                                <div class="float-left d-table ml-3" style="">
                                                    <div class="cell-middle p-l-20">
                                                        <span class="font-weight-bold">Urlop wypoczynkowy</span>
                                                        <div>
                                                                2021: 26 z 26 dni
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-12 m-b-20">
                                                <div class="float-left easy-pie-custom easy-pie-4 easyPieChart" data-percent="100.00" style="width: 40px; height: 40px; line-height: 40px;">
                                                    <span class="easy-pie-percent-40 font-size-13">2</span>
                                                    <canvas width="40" height="40"></canvas></div>
                                                <div class="float-left d-table ml-3" style="">
                                                    <div class="cell-middle p-l-20">
                                                        <span class="font-weight-bold">Urlop na chorobę rodzinną</span><br>
                                                        <div>
                                                                2021: 2 z 2 dni
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" data-section="wiki">
            <div class="col-lg-12 col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">
                            <i class="fa fa-calendar-alt"></i>
                            <span class="ml-2 mr-1">Kalendarz</span>
                            <span class="pull-right">
                                <!-- <i class="tim-icons icon-simple-add action-add font-weight-bold" data-element="wiki"></i> -->
                            </span>
                        </h4>
                    </div>
                    <div class="card-body">
                        <div class="col-xs-12">
                            <div class="row m-t-20 m-b-40 ml-2">
                                <div class="col-xs-12 text-left">
                                    <div style="display: inline-block">
                                        <a class="btn btn-white absense-calendar-blue m-r-5 tip" data-placement="bottom" title="Poprzedni miesiąc" href="/absence/schedule/2020/12">
                                            <i class="fa fa-chevron-left"></i> <span class="last-month d-inline"></span>
                                        </a>
                                        <a href="/absence/schedule/2021/02" class="btn btn-white absense-calendar-blue tip" data-placement="bottom" title="Następny miesiąc">
                                            <span class="next-month d-inline"></span>  <i class="fa fa-chevron-right"></i>
                                        </a>
                                    </div>
                                    <div style="display: inline-block" class="ml-3">
                                        <a href="/absence/schedule" class="btn btn-primary">
                                            Dziś
                                        </a>
                                    </div>
                                    <div style="display: inline-block;" class="m-l-30 ml-3">
                                        <h2 style="display: inline-block; margin: 0px!important; padding: 0px!important; vertical-align: middle;" class="bold">Styczeń 2021</h2>
                                    </div>
                                </div>
                            </div>
                            <div class="row m-b-20 ml-5 mt-4">
                                <div class="col-xs-12">
                                    <div class="row legend">
                                        <div class="col-xs-12">
                                            <div class="h4">
                                                Legenda
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row" style="font-size: 13px; height: auto; overflow: hidden;" id="legend-container">
                                        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-6 m-t-5">
                                            <span class="legend-item" style="background-color: #8e49a3;"></span>
                                            <span>Urlop wypoczynkowy</span>
                                        </div>
                                        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-6 m-t-5">
                                            <span class="legend-item" style="background-color: #638a50;"></span>
                                            <span>Urlop wypoczynkowy dodatkowy</span>
                                        </div>
                                        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-6 m-t-5">
                                            <span class="legend-item" style="background-color: #a66868;"></span>
                                            <span>Urlop na wolontariat</span>
                                        </div>
                                        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-6 m-t-5">
                                            <span class="legend-item" style="background-color: #3da6a1;"></span>
                                            <span>Urlop na chorobę rodzinną</span>
                                        </div>
                                        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-6 m-t-5">
                                            <span class="legend-item" style="background-color: #5ba3c2;"></span>
                                            <span>Opieka na opiekę rodzinną</span>
                                        </div>
                                        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-6 m-t-5">
                                            <span class="legend-item" style="background-color: #e8e6ad;"></span>
                                            <span>Urlop macierzyński</span>
                                        </div>
                                        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-6 m-t-5">
                                            <span class="legend-item" style="background-color: #e8e6ad;"></span>
                                            <span>Urlop tacierzyński</span>
                                        </div>
                                        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-6 m-t-5">
                                            <span class="legend-item" style="background-color: #7a7567;"></span>
                                            <span>Urlop na żądanie</span>
                                        </div>
                                        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-6 m-t-5">
                                            <span class="legend-item" style="background-color: #a99ae3;"></span>
                                            <span>Zwolnienie chorobowe</span>
                                        </div>
                                        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-6 m-t-5">
                                            <span class="legend-item" style="background-color: #ffe178;"></span>
                                            <span>Czas wolny za nadgodziny</span>
                                        </div>
                                        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-6 m-t-5">
                                            <span class="legend-item" style="background-color: #ccc0c0;"></span>
                                            <span>Inne</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="table-scroll ps mt-4" style="position: relative;">
                                <table class="table m-t-10 table-calendar">
                                    <thead>
                                    <tr>
                                        <th class=""></th>
                                    </tr></thead>
                                    <tbody>
                                    </tbody>
                                </table>
                                <div class="ps__rail-x" style="left: 0px; bottom: 0px;"><div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps__rail-y" style="top: 0px; right: 0px;"><div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 0px;"></div></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('script')
    <script src="assets/js/plugins/jquery.easypiechart.min.js"></script>
    <script src="assets/js/plugins/moment-with-locales.min.js"></script>
    <script src="assets/js/plugins/moment-timezone-with-data.min.js"></script>
    <script src="{{ mix('assets/js/services/absence.js') }}"></script>
@endsection
