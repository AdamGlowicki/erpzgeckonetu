@extends('layouts.app')

@php ($title = __('manage.title'))

@section('style')
@endsection

@section('content')
<div class="row hidden" data-section="admin/user">
    <div class="col">
        <div class="card animated fadeIn">
            <div class="card-header">
                <h4 class="card-title">
                    <i class="fa fa-user"></i>
                    <span class="ml-2 mr-1">Użytkownicy</span>
                    <span class="pull-right mr-2">
                        <button class="action-add mt-0 btn btn-sm btn-secondary" data-element="admin/user">Dodaj</button>
                    </span>
                </h4>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-stripped" data-resource="admin/user">
                        <thead>
                        <tr>
                            <th data-sortable="id">ID</th>
                            <th data-sortable="name">Imię nazwisko/Nazwa</th>
                            <th data-sortable="role">Rola</th>
                            <th data-sortable="username">Nazwa użytkownika</th>
                            <th data-sortable="email">E-mail</th>
                            <th data-sortable="phone">Nr telefonu</th>
                            <th data-sortable="active">Aktywny</th>
                            <th data-sortable="updated_at">Ost. logowanie</th>
                            <th data-sortable="password_changed_at">Ost. zmiana hasła</th>
                            <th>Zarządzanie</th>
                        </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                    <div class="pull-left" data-type="records"></div>
                    <div class="pull-right">
                        <nav data-type="pagination" data-resource="admin/user">
                            <ul class="pagination">
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row hidden" data-section="admin/role">
    <div class="col">
        <div class="card animated fadeIn">
            <div class="card-header">
                <h4 class="card-title">
                    <i class="fa fa-user"></i>
                    <span class="ml-2 mr-1">Role</span>
                    <span class="pull-right mr-2">
                        <button class="action-add mt-0 btn btn-sm btn-secondary" data-element="admin/role">Dodaj</button>
                    </span>
                </h4>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-stripped" data-resource="admin/role">
                        <thead>
                        <tr>
                            <th data-sortable="id">ID</th>
                            <th data-sortable="name">Nazwa</th>
                            <th data-sortable="created_at">Utworzono</th>
                            <th>Zarządzanie</th>
                        </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                    <div class="pull-left" data-type="records"></div>
                    <div class="pull-right">
                        <nav data-type="pagination" data-resource="admin/role">
                            <ul class="pagination">
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row hidden" data-section="admin/permission">
    <div class="col">
        <div class="card animated fadeIn">
            <div class="card-header">
                <h4 class="card-title">
                    <i class="fa fa-user"></i>
                    <span class="ml-2 mr-1">Uprawnienia</span>
                    <span class="pull-right mr-2">
                        <button class="action-add mt-0 btn btn-sm btn-secondary" data-element="admin/permission">Dodaj</button>
                    </span>
                </h4>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-stripped" data-resource="admin/permission">
                        <thead>
                        <tr>
                            <th data-sortable="id">ID</th>
                            <th data-sortable="name">Nazwa</th>
                            <th data-sortable="created_at">Utworzono</th>
                            <th>Zarządzanie</th>
                        </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                    <div class="pull-left" data-type="records"></div>
                    <div class="pull-right">
                        <nav data-type="pagination" data-resource="admin/permission">
                            <ul class="pagination">
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('script')
<script src="{{ Helpers::asset('assets/js/services/manage.js') }}"></script>
@endsection
