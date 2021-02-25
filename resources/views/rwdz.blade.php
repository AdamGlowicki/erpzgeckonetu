@extends('layouts.app')

@php ($title = __('rwdz.title'))

@section('style')
@endsection

@section('content')
<div class="content">
    <div class="row hidden" data-section="rwdz">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title">Rejestr Wniosków, Decyzji i Zgłoszeń <small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                <input type="text" class="form-control-search" name="search" data-search="rwdz" placeholder="wyszukaj">
            </span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="rwdz">
                  <thead>
                    <th data-sortable="id">ID</th>
                    <th data-sortable="data_wplywu_wniosku" nowrap>Data wpływu</th>
                    <th data-sortable="data_wydania_decyzji" nowrap>Data decyzji</th>
                    <th data-sortable="miasto">Miasto</th>
                    <th data-sortable="ulica">Ulica</th>
                    <th data-sortable="nazwa_zam_budowlanego">Nazwa zam. bud.</th>
                    <th data-sortable="nazwa_zamierzenia_bud">Nazwa zam. bud.</th>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="rwdz">
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
<script src="{{ Helpers::asset('assets/js/services/rwdz.js') }}"></script>
@endsection