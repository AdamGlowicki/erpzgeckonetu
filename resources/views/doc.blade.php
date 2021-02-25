@extends('layouts.app')

@php ($title = __('doc.title'))

@section('style')
    <link href="assets/css/jasny-bootstrap.min.css" rel="stylesheet">
@endsection

@section('content')
<div class="content">
    <div class="row hidden" data-section="doc">
        <div class="col-lg-12 col-md-12">
            <div class="card animated fadeIn">
                <div class="card-header">
                    <h4 class="card-title">
                        <i class="fa fa-file"></i>
                        <span class="ml-2 mr-1">Dokumenty</span>
                        <small>(strona nr: <span class="page-number">1</span>)</small>
                        <span class="pull-right">
                            <input type="text" class="form-control-search" name="search" data-search="doc" placeholder="wyszukaj dokument" aria-label="wyszukaj dokument">
                            <button class="action-add mt-0 btn btn-sm btn-secondary" data-element="doc">Dodaj</button>
                        </span>
                    </h4>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-stripped" data-resource="doc">
                            <thead>
                            <tr>
                                <th data-sortable="id">ID</th>
                                <th data-sortable="title">Nazwa</th>
                                <th data-sortable="users.name">Dodał</th>
                                <th data-sortable="created_at">Data dodania</th>
                                <th data-sortable="updated_at">Data edycji</th>
                                <th>Zarządzanie</th>
                            </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <div class="pull-left" data-type="records"></div>
                        <div class="pull-right">
                            <nav data-type="pagination" data-resource="doc">
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
    <script src="assets/js/plugins/jasny-bootstrap.min.js"></script>
    <script src="{{ mix('assets/js/services/doc.js') }}"></script>
@endsection
