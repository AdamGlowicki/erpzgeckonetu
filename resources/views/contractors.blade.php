@extends('layouts.app')

@php ($title = __('contractors.title'))

@section('style')
@endsection

@section('content')
<div class="content">
    <div class="row hidden" data-section="contractor">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-id-card"></i><span class="ml-2 mr-1">Kontrahenci</span><small>(strona nr: <span class="page-number">1</span>)</small>
                <span class="pull-right">
                    <input type="text" class="form-control-search" name="search" data-search="contractor" placeholder="wyszukaj kontrahenta">
                    <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="contractor"></i>
                </span>
            </h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="contractor">
                  <thead>
                    <th data-sortable="id">ID</th>
                    <th data-sortable="name">Nazwa</th>
                    <th data-sortable="nip">NIP</th>
                    <th data-sortable="street">Ulica</th>
                    <th data-sortable="postcode">Kod pocztowy</th>
                    <th data-sortable="city">Miejscowość</th>
                    <th data-sortable="countries.code">Kraj</th>
                    <th>Zarządzanie</th>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="contractor">
                        <ul class="pagination">
                        </ul>
                    </nav>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="contractor">
        <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Dodawanie kontrahenta</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="card">
                    <div class="card-body">
                        <form role="form" class="form-horizontal" data-element="contractor">
                            <div class="row">
                                <div class="form-group has-label col-lg-3 col-md-3">
                                    <label>Typ *</label>
                                    <select class="form-control selectpicker" data-style="btn-primary" name="type" data-live-search="false">
                                        <option value="0">Firma</option>
                                        <option value="1">Osoba fizyczna</option>
                                    </select>
                                </div>
                                <div class="form-group has-label col-lg-6 col-md-6">
                                    <label>Nazwa firmy/Imię i nazwisko *</label>
                                    <input class="form-control" name="name" type="text" minlength="3">
                                </div>
                                <div class="form-group has-label col-lg-3 col-md-3">
                                    <label>NIP</label>
                                    <input class="form-control" name="nip" type="text" minlength="10"  maxlength="10">
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group has-label col-lg-7 col-md-7">
                                    <label>Adres (ulica, nr domu, nr lokalu) *</label>
                                    <input class="form-control" name="street" placeholder="np. Grunwaldzka 13" type="text" minlength="3">
                                </div>
                                <div class="form-group has-label col-lg-2 col-md-2">
                                    <label>Kod pocztowy *</label>
                                    <input class="form-control" name="postcode" placeholder="np. 00-107" type="text" minlength="6" maxlength="6">
                                </div>
                                <div class="form-group has-label col-lg-3 col-md-3">
                                    <label>Miejscowość *</label>
                                    <input class="form-control" name="city" type="text" minlength="3">
                                </div>
                            </div>
                            <div class="form-group has-label">
                                <div class="form-group has-label">
                                    <label>Kraj *</label>
                                    <select class="form-control selectpicker" data-style="btn-primary" name="country_id" data-live-search="true">
                                    </select>
                                </div>
                            </div>
                            <div class="form-group has-label">
                                <div class="form-group has-label">
                                    <label>Numer konta bankowego</label>
                                    <input class="form-control" name="bacc_iban" placeholder="" type="text" minlength="3">
                                </div>
                            </div>
                            <div class="form-group has-label">
                                <div class="form-group has-label">
                                    <label>Kod SWIFT banku</label>
                                    <input class="form-control" name="bacc_swift" placeholder="" type="text" minlength="3">
                                </div>
                            </div>
                        </form>
                        <div class="category form-category">* Pola wymagane</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="contractor">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="contractor-clickable">
        <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <table class="table table-stripped" data-resource="contractor-clickable">
                    <thead>
                        <th>ID</th>
                        <th>Magazyn</th>
                        <th>Stan</th>
                        <th>J.m.</th>
                        <th>Zarządzanie</th>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
            </div>
          </div>
        </div>
    </div>
</div>
@endsection

@section('script')
<script src="{{ Helpers::asset('assets/js/services/contractors.js') }}"></script>
@endsection
