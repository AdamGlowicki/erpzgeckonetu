@extends('layouts.app')

@php ($title = __('bhp.title'))

@section('style')
@endsection

@section('content')
<div class="content">
    <div class="row hidden" data-section="bhpItem">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
              <h4 class="card-title"><i class="fa fa-shield-alt"></i><span class="ml-2 mr-1">Materiały BHP</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                <input type="text" class="form-control-search" name="search" data-search="bhpItem" placeholder="wyszukaj produkt" aria-label="wyszukaj produkt">
                <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="bhpItem"></i>
            </span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="bhpItem">
                  <thead>
                    <th data-sortable="id">ID</th>
                    <th data-sortable="name">Nazwa produktu</th>
                    <th data-sortable="units.short_name">J.m.</th>
                    <th data-sortable="created_at">Data utworzenia</th>
                    <th>Zarządzanie</th>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
             <div class="pull-left" data-type="records"></div>
             <div class="pull-right">
                <nav data-type="pagination" data-resource="bhpItem">
                    <ul class="pagination">
                    </ul>
                </nav>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row hidden" data-section="bhpOut">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
              <h4 class="card-title"><i class="fa fa-user-plus"></i><span class="ml-2 mr-1">Wydania materiałów BHP</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                <input type="text" class="form-control-search" name="search" data-search="bhpOut" placeholder="wyszukaj RW/B" aria-label="wyszukaj RW/B">
                <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="bhpOut"></i>
            </span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="bhpOut">
                  <thead>
                    <th data-sortable="id">ID</th>
                    <th data-sortable="document_name">Nazwa dokumentu</th>
                    <th data-sortable="users.name">Wydał</th>
                    <th data-sortable="users.name{user_out}">Przyjął</th>
                    <th data-sortable="created_at">Data operacji</th>
                    <th>Zarządzanie</th>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
             <div class="pull-left" data-type="records"></div>
             <div class="pull-right">
                <nav data-type="pagination" data-resource="bhpOut">
                    <ul class="pagination">
                    </ul>
                </nav>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row hidden" data-section="bhpUsersStocksItem">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
              <h4 class="card-title"><i class="fa fa-user-shield"></i><span class="ml-2 mr-1">Stany użytkowników</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                <input type="text" class="form-control-search" name="search" data-search="bhpUsersStocksItem" placeholder="wyszukaj" aria-label="wyszukaj">
                <!--<i class="tim-icons icon-simple-add action-add hidden btn btn-link btn-icon btn-sm" data-element="client"></i>-->
            </span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="bhpUsersStocksItem">
                  <thead>
                    <th data-sortable="id">ID</th>
                    <th data-sortable="name">Użytkownik</th>
                    <th>Zarządzanie</th>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
             <div class="pull-left" data-type="records"></div>
             <div class="pull-right">
                <nav data-type="pagination" data-resource="bhpUsersStocksItem">
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
@endsection

@section('script')
<script src="{{ Helpers::asset('assets/js/services/bhp.js') }}"></script>
@endsection
