@extends('layouts.app')

@php ($title = __('cars.title'))

@section('style')
@endsection

@section('content')
<div class="content">
    <div class="row hidden" data-section="car">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-user-friends"></i><span class="ml-2 mr-1">Grupy</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                <input type="text" class="form-control-search" name="search" data-search="car" placeholder="wyszukaj pojazd">
                <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="car"></i>
            </span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="car">
                  <thead>
                    <th data-sortable="id">ID</th>
                    <th data-sortable="name">Nazwa</th>
                    <th data-sortable="registration">Opis grupy / nr rej.</th>
                    <th data-sortable="service_date">Data ostatniego przeglądu</th>
                    <th>Zarządzanie</th>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="car">
                        <ul class="pagination">
                        </ul>
                    </nav>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="car">
        <div class="modal-dialog animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Dodawanie pojazdu</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="card">
                    <div class="card-body">
                        <form role="form" class="form-horizontal" data-element="car">
                            <div class="form-group has-label">
                                <div class="form-group has-label">
                                    <label>Nazwa *</label>
                                    <input class="form-control" name="name" placeholder="" type="text" minlength="3">
                                </div>
                            </div>
                            <div class="form-group has-label">
                                <div class="form-group has-label">
                                    <label>Opis grupy/Nr rejestracyjny *</label>
                                    <input class="form-control" name="registration" placeholder="" type="text" minlength="3">
                                </div>
                            </div>
                            <div class="form-group has-label">
                                <div class="form-group has-label">
                                    <label>Data ostatniego przeglądu</label>
                                    <input class="form-control" name="service_date" placeholder="" type="date">
                                </div>
                            </div>
                            <div class="form-group has-label">
                                <div class="form-check">
                                    <label class="form-check-label hidden">
                                        <input class="form-check-input" type="checkbox" name="locked" value="true">
                                        <span class="form-check-sign"></span>
                                        Stan zablokowany
                                    </label>
                                </div>
                            </div>
                            <div class="form-group has-label">
                                <div class="form-group has-label">
                                    <label>Użytkownicy</label>
                                    <select data-placeholder="wybierz użytkowników" name="user_id" class="chosen-select" multiple tabindex="4">
                                    </select>
                                </div>
                            </div>
                        </form>
                        <div class="category form-category">* Pola wymagane</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="car">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="car-clickable">
        <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <span class="pull-right">
                    <input type="text" class="form-control-search-modal" name="search" data-search="car" placeholder="wyszukaj produkt">
                </span>
                <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <table class="table table-stripped" data-resource="car-clickable">
                    <thead>
                        <th data-sortable="item_id">Indeks</th>
                        <th data-sortable="items.model_name">Model</th>
                        <th data-sortable="items.items_manufacturers.name">Producent</th>
                        <th data-sortable="items.items_categories.name">Kategoria</th>
                        <th data-sortable="quantity">Stan</th>
                        <th data-sortable="items.units.short_name">J.m.</th>
                        <th>Zarządzanie</th>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="car-clickable">
                        <ul class="pagination">
                        </ul>
                    </nav>
                </div>
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
<script src="{{ Helpers::asset('assets/js/services/cars.js') }}"></script>
@endsection
