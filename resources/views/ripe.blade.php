@extends('layouts.app')

@php ($title = __('ripe.title'))

@section('style')
@endsection

@section('content')
<div class="content">
    <div class="row hidden" data-section="ripe">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title">Lista RIPE <small>(strona nr: <span class="page-number">1</span>)</small></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="ripe">
                  <thead>
                    <th data-sortable="id">ID</th>
                    <th data-sortable="org_name">Organizacja</th>
                    <th data-sortable="address">Adres</th>
                    <th data-sortable="email">E-mail</th>
                    <th data-sortable="notify">E-mail notify</th>
                    <th>Zarządzanie</th>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="ripe">
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
<script src="assets/js/services/ripe.js"></script>
@endsection