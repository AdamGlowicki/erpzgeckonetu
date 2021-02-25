@extends('layouts.app')

@php ($title = __('bok.title'))

@section('style')
@endsection

@section('content')
<div class="content">
    <div class="row hidden" data-section="lead">
        <div class="col-lg-12 col-md-12">
            <div class="card animated fadeIn">
                <div class="card-header">
                    <h4 class="card-title">
                        <i class="fa fa-list-alt"></i>
                        <span class="ml-2 mr-1">Leady</span>
                        <small>(strona nr: <span class="page-number">1</span>)</small>
                        <span class="pull-right">
                            <input type="text" class="form-control-search" name="search" data-search="lead" placeholder="wyszukaj lead" aria-label="wyszukaj dokument">
                            <button class="action-add mt-0 btn btn-sm btn-secondary" data-element="lead">Dodaj</button>
                        </span>
                    </h4>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-stripped" data-resource="lead">
                            <thead>
                            <tr>
                                <th data-sortable="id">ID</th>
                                <th data-sortable="name">Imię i nazwisko/Nazwa</th>
                                <th data-sortable="city">Miasto</th>
                                <th data-sortable="street">Ulica</th>
                                <th data-sortable="building_num">Nr bud.</th>
                                <th data-sortable="apartment_num">Nr lok.</th>
                                <th data-sortable="phone">Nr telefonu</th>
                                <th data-sortable="offer">Oferta</th>
                                <th data-sortable="contract_end_at">Data zak. um.</th>
                                <th data-sortable="created_at">Data dodania</th>
                                <th>Zarządzanie</th>
                            </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <div class="pull-left" data-type="records"></div>
                        <div class="pull-right">
                            <nav data-type="pagination" data-resource="lead">
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
<script src="{{ mix('assets/js/services/bok.js') }}"></script>
@endsection
