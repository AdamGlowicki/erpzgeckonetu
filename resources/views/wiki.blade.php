@extends('layouts.app')

@php ($title = __('wiki.title'))

@section('style')
<link rel="stylesheet" href="assets/js/plugins/sceditor/themes/default.min.css" />
@endsection

@section('content')
<div class="content">
    <div class="row hidden" data-section="wiki">
        <div class="col-lg-12 col-md-12">
            <div class="card animated fadeIn">
                <div class="card-header">
                    <h4 class="card-title">
                        <i class="fa fa-book"></i>
                        <span class="ml-2 mr-1">Artykuły</span>
                        <small>(strona nr: <span class="page-number">1</span>)</small>
                        <span class="pull-right">
                            <input type="text" class="form-control-search" name="search" data-search="wiki" placeholder="wyszukaj artykuł" aria-label="wyszukaj artykuł">
                            <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="wiki"></i>
                        </span>
                    </h4>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-stripped" data-resource="wiki">
                            <thead>
                            <tr>
                                <th data-sortable="id">ID</th>
                                <th data-sortable="title">Tytuł</th>
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
                            <nav data-type="pagination" data-resource="wiki">
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
<script src="assets/js/plugins/sceditor/sceditor.min.js"></script>
<script src="assets/js/plugins/sceditor/formats/xhtml.js"></script>
<script src="{{ Helpers::asset('assets/js/services/wiki.js') }}"></script>
@endsection
