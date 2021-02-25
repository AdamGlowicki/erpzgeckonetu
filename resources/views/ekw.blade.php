@extends('layouts.app')

@php ($title = __('ekw.title'))

@section('style')
<link href="{{ Helpers::asset('assets/css/kw.css') }}" rel="stylesheet">
@endsection

@section('content')
<div class="content">
    <div class="row hidden" data-section="ekw">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title">Lista Ksiąg Wieczystych <small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                <input type="text" class="form-control-search" name="search" data-search="ekw" placeholder="wyszukaj księgę">
            </span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="ekw">
                  <thead>
                    <th data-sortable="id">ID</th>
                    <th data-sortable="sad">Wydział</th>
                    <th data-sortable="numer">Numer KW</th>
                    <th data-sortable="ck">Cyfra kontrolna</th>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="ekw">
                        <ul class="pagination">
                        </ul>
                    </nav>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="ekw-clickable">
        <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
            <div class="modal-content">
                <div class="modal-header hidden-sm">
                    <h5 class="modal-title"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                </div>
                <div class="modal-footer hidden-sm">
                    <div class="pull-left">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('script')
<script src="{{ Helpers::asset('assets/js/services/ekw.js') }}"></script>
@endsection
