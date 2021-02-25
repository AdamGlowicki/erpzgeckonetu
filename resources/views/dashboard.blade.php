@extends('layouts.app')

@php ($title = __('dashboard.title'))

@section('style')
@endsection

@section('content')
<!-- <div class="row">
  <div class="col-12">
   <div class="card card-chart">
      <div class="card-header ">
        <div class="row">
          <div class="col-sm-6 text-left">
            <h5 class="card-category">Total Shipments</h5>
            <h2 class="card-title">Performance</h2>
          </div>
          <div class="col-sm-6">
            <div class="btn-group btn-group-toggle float-right" data-toggle="buttons">
              <label class="btn btn-sm btn-primary btn-simple active" id="0">
                <input type="radio" name="options" checked>
                <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">Accounts</span>
                <span class="d-block d-sm-none">
                  <i class="tim-icons icon-single-02"></i>
                </span>
              </label>
              <label class="btn btn-sm btn-primary btn-simple" id="1">
                <input type="radio" class="d-none d-sm-none" name="options">
                <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">Purchases</span>
                <span class="d-block d-sm-none">
                  <i class="tim-icons icon-gift-2"></i>
                </span>
              </label>
              <label class="btn btn-sm btn-primary btn-simple" id="2">
                <input type="radio" class="d-none" name="options">
                <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">Sessions</span>
                <span class="d-block d-sm-none">
                  <i class="tim-icons icon-tap-02"></i>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="chart-area">
          <canvas id="chartBig1"></canvas>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-lg-4">
    <div class="card card-chart">
      <div class="card-header">
        <h5 class="card-category">Total Shipments</h5>
        <h3 class="card-title"><i class="tim-icons icon-bell-55 text-primary"></i> 763,215</h3>
      </div>
      <div class="card-body">
        <div class="chart-area">
          <canvas id="chartLinePurple"></canvas>
        </div>
      </div>
    </div>
  </div>
  <div class="col-lg-4">
    <div class="card card-chart">
      <div class="card-header">
        <h5 class="card-category">Daily Sales</h5>
        <h3 class="card-title"><i class="tim-icons icon-delivery-fast text-info"></i> 3,500€</h3>
      </div>
      <div class="card-body">
        <div class="chart-area">
          <canvas id="CountryChart"></canvas>
        </div>
      </div>
    </div>
  </div>
  <div class="col-lg-4">
    <div class="card card-chart">
      <div class="card-header">
        <h5 class="card-category">Completed Tasks</h5>
        <h3 class="card-title"><i class="tim-icons icon-send text-success"></i> 12,100K</h3>
      </div>
      <div class="card-body">
        <div class="chart-area">
          <canvas id="chartLineGreen"></canvas>
        </div>
      </div>
    </div>
  </div>
</div> -->
<div class="row">
    <div class="col animated fadeInDown">
        <h3 class="text-center">Witaj w GeckoERP</h3>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="row hidden" data-section="unms">
            <div class="col-lg-12 col-md-12">
                <div class="card animated fadeIn">
                    <div class="card-header">
                        <h4 class="card-title"><i class="fa fa-wifi"></i><span class="ml-2 mr-1">UNMS</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                <input type="text" class="form-control-search" name="search" data-search="unms" placeholder="IP/MAC/id" aria-label="wyszukaj w UNMS">
            </span></h4>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-stripped" data-resource="unms">
                                <thead>
                                <tr>
                                    <th>MAC</th>
                                    <th>Nazwa</th>
                                    <th>Hostname</th>
                                    <th>Model</th>
                                    <th>IP</th>
                                    <th>Data wprowadzenia</th>
                                </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                            <div class="pull-left" data-type="records"></div>
                            <div class="pull-right">
                                <nav data-type="pagination" data-resource="unms">
                                    <ul class="pagination">
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="row hidden" data-section="items_low">
            <div class="col-lg-12 col-md-12">
                <div class="card animated fadeIn">
                    <div class="card-header">
                        <h4 class="card-title"><i class="fa fa-cart-arrow-down"></i><span class="ml-2 mr-1">Niskie stany</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
              </span></h4>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-stripped" data-resource="items_low">
                                <thead>
                                <th data-sortable="id">Indeks</th>
                                <th data-sortable="model_name">Model</th>
                                <th data-sortable="items_manufacturers.name">Producent</th>
                                <th data-sortable="items_categories.name">Kategoria</th>
                                <th>Stan</th>
                                <th data-sortable="low_quant">Stan min.</th>
                                <th data-sortable="units.short_name">J.m.</th>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                            <div class="pull-left" data-type="records"></div>
                            <div class="pull-right">
                                <nav data-type="pagination" data-resource="items_low">
                                    <ul class="pagination">
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="row hidden" data-section="items_usage">
            <div class="col-lg-12 col-md-12">
                <div class="card animated fadeIn">
                    <div class="card-header">
                        <h4 class="card-title"><i class="fa fa-chart-line"></i><span class="ml-2 mr-1">Zużycie sprzętu (w tym miesiącu)</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                    </span></h4>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-stripped" data-resource="items_usage">
                                <thead>
                                <th data-sortable="id">Indeks</th>
                                <th data-sortable="model_name">Model</th>
                                <th data-sortable="items_manufacturers.name">Producent</th>
                                <th data-sortable="q">Ilość</th>
                                <th>J.m.</th>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                            <div class="pull-left" data-type="records"></div>
                            <div class="pull-right">
                                <nav data-type="pagination" data-resource="items_usage">
                                    <ul class="pagination">
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="row hidden" data-section="users_items_usage">
            <div class="col-lg-12 col-md-12">
                <div class="card animated fadeIn">
                    <div class="card-header">
                        <h4 class="card-title"><i class="fa fa-chart-line"></i><span class="ml-2 mr-1">Zużycie sprzętu / pracownik</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                            <div class="form-inline">
                                <input type="month" name="date" class="form-control">&nbsp;
                                <select class="form-control" name="user_id">
                                </select>
                            </div>
                        </span></h4>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-stripped" data-resource="users_items_usage">
                                <thead>
                                <th data-sortable="id">Indeks</th>
                                <th data-sortable="model_name">Model</th>
                                <th data-sortable="items_manufacturers.name">Producent</th>
                                <th data-sortable="q">Ilość</th>
                                <th>J.m.</th>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                            <div class="pull-left" data-type="records"></div>
                            <div class="pull-right">
                                <nav data-type="pagination" data-resource="users_items_usage">
                                    <ul class="pagination">
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="row hidden" data-section="cars_items_usage">
            <div class="col-lg-12 col-md-12">
                <div class="card animated fadeIn">
                    <div class="card-header">
                        <h4 class="card-title"><i class="fa fa-chart-line"></i><span class="ml-2 mr-1">Zużycie sprzętu / pojazd</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                        <div class="form-inline">
                            <input type="month" name="date" class="form-control">&nbsp;
                            <select class="form-control" name="car_id">
                            </select>
                        </div>
                    </span></h4>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-stripped" data-resource="cars_items_usage">
                                <thead>
                                <th data-sortable="id">Indeks</th>
                                <th data-sortable="model_name">Model</th>
                                <th data-sortable="items_manufacturers.name">Producent</th>
                                <th data-sortable="q">Ilość</th>
                                <th>J.m.</th>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                            <div class="pull-left" data-type="records"></div>
                            <div class="pull-right">
                                <nav data-type="pagination" data-resource="cars_items_usage">
                                    <ul class="pagination">
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('script')
<script src="assets/demo/demo.js"></script>
<script src="{{ Helpers::asset('assets/js/services/dashboard.js') }}"></script>
@endsection
