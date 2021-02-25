@extends('layouts.app')

@php ($title = __('warehouse.title'))

@section('style')
<link href="assets/css/jasny-bootstrap.min.css" rel="stylesheet">
@endsection

@section('content')
<div class="content">
    <div class="row hidden" data-section="client">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
              <h4 class="card-title"><i class="fa fa-users"></i><span class="ml-2 mr-1">Klienci</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                <input type="text" class="form-control-search" name="search" data-search="client" placeholder="wyszukaj klienta" aria-label="wyszukaj klienta">
                <!--<i class="tim-icons icon-simple-add action-add hidden btn btn-link btn-icon btn-sm" data-element="client"></i>-->
            </span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="client">
                  <thead>
                    <tr>
                        <th data-sortable="id">ID</th>
                        <th data-sortable="client_id">ID klienta</th>
                        <th data-sortable="name">Klient</th>
                        <th data-sortable="address">Adres</th>
                        <th data-sortable="created_at">Data wprowadzenia</th>
                        <th>Zarządzanie</th>
                    </tr>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
             <div class="pull-left" data-type="records"></div>
             <div class="pull-right">
                <nav data-type="pagination" data-resource="client">
                    <ul class="pagination">
                    </ul>
                </nav>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row hidden" data-section="investment">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-project-diagram"></i><span class="ml-2 mr-1">Inwestycje</span><small>(strona nr: <span class="page-number">1</span>)</small>
                <span class="pull-right">
                    <input type="text" class="form-control-search" name="search" data-search="investment" placeholder="wyszukaj inwestycję" aria-label="wyszukaj inwestycję">
                    <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="investment"></i>
                </span>
            </h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="investment">
                  <thead>
                    <tr>
                        <th data-sortable="id">ID</th>
                        <th data-sortable="name">Nazwa</th>
                        <th data-sortable="investment_name">Numer inwestycji</th>
                        <th data-sortable="users.name">Wprowadził</th>
                        <th data-sortable="date_start">Plan. data rozp.</th>
                        <th data-sortable="date_end">Plan. data zak.</th>
                        <th data-sortable="created_at">Data wprowadzenia</th>
                        <th>Zarządzanie</th>
                    </tr>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
             <div class="pull-left" data-type="records"></div>
             <div class="pull-right">
                <nav data-type="pagination" data-resource="investment">
                    <ul class="pagination">
                    </ul>
                </nav>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row hidden" data-section="request">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-file-import"></i><span class="ml-2 mr-1">Zapotrzebowanie</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right"><i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="request"></i></span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="request">
                  <thead>
                      <tr>
                          <th data-sortable="id">ID</th>
                          <th data-sortable="users.name">Zgłaszający</th>
                          <th data-sortable="document_name">Nazwa dokumentu</th>
                          <th data-sortable="date">Data zapotrzebowania</th>
                          <th data-sortable="created_at">Data wprowadzenia</th>
                          <th>Zarządzanie</th>
                      </tr>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
             <div class="pull-left" data-type="records"></div>
             <div class="pull-right">
                <nav data-type="pagination" data-resource="request">
                    <ul class="pagination">
                    </ul>
                </nav>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row hidden" data-section="carsMove">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-people-carry"></i><span class="ml-2 mr-1">Przekazania sprzętu</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                <input type="text" class="form-control-search" name="search" data-search="carsMove" placeholder="wyszukaj MM/T" aria-label="wyszukaj MM/T">
                <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="carsMove"></i>
            </span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
                <table class="table table-stripped" data-resource="carsMove">
                    <thead>
                        <tr>
                            <th data-sortable="id">ID</th>
                            <th data-sortable="users.name{user_in}">Wydał</th>
                            <th data-sortable="users.name{user_out}">Dla</th>
                            <th data-sortable="cars.name{car_in}">Pojazd źródłowy</th>
                            <th data-sortable="cars.name{car_out}">Pojazd docelowy</th>
                            <th data-sortable="document_name">Dokument</th>
                            <th data-sortable="created_at">Data operacji</th>
                            <th>Zarządzanie</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="carsMove">
                        <ul class="pagination">
                        </ul>
                    </nav>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row hidden" data-section="carsOut">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-arrow-up"></i><span class="ml-2 mr-1">Wydania zewnętrzne</span><small>(strona nr: <span class="page-number">1</span>)</small>
                <span class="pull-right">
                    <input type="text" class="form-control-search" name="search" data-search="carsOut" placeholder="wyszukaj WZ" aria-label="wyszukaj WZ">
                    <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="carsOut"></i>
                </span>
            </h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="carsOut">
                  <thead>
                      <tr>
                          <th data-sortable="id">ID</th>
                          <th data-sortable="document_name">Dokument</th>
                          <th data-sortable="cars.name">Pojazd źródłowy</th>
                          <th data-sortable="clients.name">Klient</th>
                          <th data-sortable="investments.investment_name">Inwestycja</th>
                          <th data-sortable="users.name">Wydał</th>
                          <th data-sortable="created_at">Data wydania</th>
                          <th>Zarządzanie</th>
                      </tr>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
             <div class="pull-left" data-type="records"></div>
             <div class="pull-right">
                <nav data-type="pagination" data-resource="carsOut">
                    <ul class="pagination">
                    </ul>
                </nav>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row hidden" data-section="carsIn">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-undo"></i><span class="ml-2 mr-1">Zwroty / Demontaże</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                    <input type="text" class="form-control-search" name="search" data-search="carsIn" placeholder="wyszukaj ZWROT" aria-label="wyszukaj ZWROT">
                    <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="carsIn"></i>
                </span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="carsIn">
                  <thead>
                      <tr>
                          <th data-sortable="id">ID</th>
                          <th data-sortable="document_name">Dokument</th>
                          <th data-sortable="clients.name">Klient</th>
                          <th data-sortable="investments.investment_name">Inwestycja</th>
                          <th data-sortable="cars.name">Pojazd docelowy</th>
                          <th data-sortable="users.name">Odebrał</th>
                          <th data-sortable="created_at">Data wydania</th>
                          <th>Zarządzanie</th>
                      </tr>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
             <div class="pull-left" data-type="records"></div>
             <div class="pull-right">
                <nav data-type="pagination" data-resource="carsIn">
                    <ul class="pagination">
                    </ul>
                </nav>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row hidden" data-section="warehousesInCar">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-angle-double-down"></i><span class="ml-2 mr-1">Zwroty wewnętrzne</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                <input type="text" class="form-control-search" name="search" data-search="warehousesInCar" placeholder="wyszukaj ZW" aria-label="wyszukaj ZW">
                <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="warehousesInCar"></i>
            </span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
                <table class="table table-stripped" data-resource="warehousesInCar">
                    <thead>
                        <tr>
                            <th data-sortable="id">ID</th>
                            <th data-sortable="cars.name">Pojazd</th>
                            <th data-sortable="warehouses.name">Magazyn</th>
                            <th data-sortable="users.name{user_get}">Zdał</th>
                            <th data-sortable="users.name{user_approved}">Przyjął</th>
                            <th data-sortable="created_at">Data zwrotu</th>
                            <th data-sortable="document_name">Nazwa dokumentu</th>
                            <th>Ilość</th>
                            <th>Zarządzanie</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
             <div class="pull-left" data-type="records"></div>
             <div class="pull-right">
                <nav data-type="pagination" data-resource="warehousesInCar">
                    <ul class="pagination">
                    </ul>
                </nav>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row hidden" data-section="warehousesOutCar">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-angle-double-up"></i><span class="ml-2 mr-1">Rozchody wewnętrzne</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                    <input type="text" class="form-control-search" name="search" data-search="warehousesOutCar" placeholder="wyszukaj RW" aria-label="wyszukaj RW">
                    <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="warehousesOutCar"></i>
                </span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="warehousesOutCar">
                  <thead>
                      <tr>
                          <th data-sortable="id">ID</th>
                          <th data-sortable="warehouses.name">Magazyn</th>
                          <th data-sortable="cars.name">Pojazd</th>
                          <th data-sortable="users.name{user_approved}">Wydał</th>
                          <th data-sortable="users.name{user_get}">Przyjął</th>
                          <th data-sortable="created_at">Data wydania</th>
                          <th data-sortable="document_name">Nazwa dokumentu</th>
                          <th>Ilość</th>
                          <th>Zarządzanie</th>
                      </tr>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
             <div class="pull-left" data-type="records"></div>
             <div class="pull-right">
                <nav data-type="pagination" data-resource="warehousesOutCar">
                    <ul class="pagination">
                    </ul>
                </nav>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row hidden" data-section="warehousesIn">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-dolly"></i><span class="ml-2 mr-1">Przyjęcia zewnętrzne</span><small>(strona nr: <span class="page-number">1</span>)</small>
                <span class="pull-right">
                    <input type="text" class="form-control-search" name="search" data-search="warehousesIn" placeholder="wyszukaj PZ" aria-label="wyszukaj PZ">
                    <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="warehousesIn"></i>
                </span>
            </h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
                <table class="table table-stripped" data-resource="warehousesIn">
                    <thead>
                        <tr>
                            <th data-sortable="id">ID</th>
                            <th data-sortable="warehouses.name">Magazyn</th>
                            <th data-sortable="contractors.name">Kontrahent</th>
                            <th data-sortable="users.name">Przyjął</th>
                            <th data-sortable="created_at">Data przyjęcia</th>
                            <th data-sortable="invoice_date">Data faktury</th>
                            <th data-sortable="document_name">Dokument</th>
                            <th data-sortable="invoice_name">Faktura</th>
                            <th>Wartość netto</th>
                            <th>Zarządzanie</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="warehousesIn">
                        <ul class="pagination">
                        </ul>
                    </nav>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row hidden" data-section="warehousesImport">
        <div class="col-lg-12 col-md-12">
            <div class="card animated fadeIn">
                <div class="card-header">
                    <h4 class="card-title"><i class="fa fa-box-open"></i><span class="ml-2 mr-1">Importy magazynowe</span><small>(strona nr: <span class="page-number">1</span>)</small>
                        <span class="pull-right">
                    <input type="text" class="form-control-search" name="search" data-search="warehousesImport" placeholder="wyszukaj import" aria-label="wyszukaj import">
                    <!-- <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="warehousesImport"></i> -->
                </span>
                    </h4>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-stripped" data-resource="warehousesImport">
                            <thead>
                            <tr>
                                <th data-sortable="id">ID</th>
                                <th data-sortable="warehouses.name">Magazyn</th>
                                <th data-sortable="users.name">Przyjął</th>
                                <th data-sortable="created_at">Data importu</th>
                                <th>Zarządzanie</th>
                            </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                        <div class="pull-left" data-type="records"></div>
                        <div class="pull-right">
                            <nav data-type="pagination" data-resource="warehousesImport">
                                <ul class="pagination">
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row hidden" data-section="warehousesMove">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-sync-alt"></i><span class="ml-2 mr-1">Przesunięcia międzymagazynowe</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right"><i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="warehousesMove"></i></span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
                <table class="table table-stripped" data-resource="warehousesMove">
                    <thead>
                        <tr>
                            <th data-sortable="id">ID</th>
                            <th data-sortable="warehouses.name{warehouse_in}">Magazyn źródłowy</th>
                            <th data-sortable="warehouses.name{warehouse_out}">Magazyn docelowy</th>
                            <th data-sortable="users.name">Odpowiedzialny</th>
                            <th data-sortable="document_name">Dokument</th>
                            <th data-sortable="created_at">Data operacji</th>
                            <th>Zarządzanie</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="warehousesMove">
                        <ul class="pagination">
                        </ul>
                    </nav>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row hidden" data-section="item">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
              <h4 class="card-title"><i class="fa fa-box"></i><span class="ml-2 mr-1">Produkty</span><small>(strona nr: <span class="page-number">1</span>)</small>
                <span class="pull-right">
                    <div class="form-check form-check-inline" style="margin-top: 10px;">
                        <label class="form-check-label text-center">
                              <input class="form-check-input" name="hidden" type="checkbox" value="">
                              <span class="form-check-sign">Pokaż ukryte</span>
                        </label>
                    </div>
                    <input type="text" class="form-control-search" name="search" data-search="item" placeholder="wyszukaj produkt" aria-label="wyszukaj produkt">
                    <i class="tim-icons icon-minimal-down action-import font-weight-bold hidden" data-element="item"></i>
                    <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="item"></i>
                </span>
              </h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="item">
                  <thead>
                      <tr>
                          <th data-sortable="id">ID</th>
                          <th data-sortable="model_name">Model</th>
                          <th data-sortable="items_manufacturers.name">Producent</th>
                          <th data-sortable="items_categories.name">Kategoria</th>
                          <th>Stan</th>
                          <th data-sortable="low_quant">Stan min.</th>
                          <th>Stan w grupach</th>
                          <th data-sortable="units.name">J.m.</th>
                          <th>Śr. cena netto</th>
                          <th>Zarządzanie</th>
                      </tr>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="item">
                        <ul class="pagination">
                        </ul>
                    </nav>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg hidden" data-section="itemsManufacturer">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-industry"></i><span class="ml-2 mr-1">Producenci</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right"><i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="itemsManufacturer"></i></span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="itemsManufacturer">
                  <thead>
                      <tr>
                          <th data-sortable="id">ID</th>
                          <th data-sortable="name">Nazwa</th>
                          <th data-sortable="item_count">Ilość produktów</th>
                          <th>Zarządzanie</th>
                      </tr>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="itemsManufacturer">
                        <ul class="pagination">
                        </ul>
                    </nav>
                </div>
            </div>
          </div>
        </div>
      </div>
        <div class="col-lg col-md-12 hidden" data-section="itemsCategory">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-list-alt"></i><span class="ml-2 mr-1">Kategorie</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right"><i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="itemsCategory"></i></span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped"  data-resource="itemsCategory">
                  <thead>
                      <tr>
                          <th data-sortable="id">ID</th>
                          <th data-sortable="name">Nazwa</th>
                          <th data-sortable="item_count">Ilość produktów</th>
                          <th>Zarządzanie</th>
                      </tr>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="itemsCategory">
                        <ul class="pagination">
                        </ul>
                    </nav>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg col-md-12 hidden" data-section="unit">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-ruler"></i><span class="ml-2 mr-1">Jedn. miary</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right"><i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="unit"></i></span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="unit">
                  <thead>
                      <tr>
                          <th data-sortable="id">ID</th>
                          <th data-sortable="name">Nazwa</th>
                          <th data-sortable="short_name">Nazwa skrócona</th>
                          <th>Zarządzanie</th>
                      </tr>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="unit">
                        <ul class="pagination">
                        </ul>
                    </nav>
                </div>
            </div>
          </div>
        </div>
      </div>
        <div class="col-lg-12 col-md-12 hidden" data-section="warehousesPlace">
            <div class="card animated fadeIn">
                <div class="card-header">
                    <h4 class="card-title"><i class="fa fa-pallet"></i><span class="ml-2 mr-1">Miejsca magazynowania</span><small>(strona nr: <span class="page-number">1</span>)</small>
                    <span class="pull-right">
                        <i class="tim-icons icon-minimal-down action-import font-weight-bold hidden" data-element="warehousesPlace"></i>
                        <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="warehousesPlace"></i>
                    </span>
                    </h4>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-stripped" data-resource="warehousesPlace">
                            <thead>
                            <tr>
                                <th data-sortable="id">ID</th>
                                <th data-srtoable="warehouses.name">Magazyn</th>
                                <th data-sortable="name">Nazwa miejsca</th>
                                <th data-sortable="items.model_name">Produkt</th>
                                <th>Zarządzanie</th>
                            </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <div class="pull-left" data-type="records"></div>
                        <div class="pull-right">
                            <nav data-type="pagination" data-resource="warehousesPlace">
                                <ul class="pagination">
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <div class="col-lg-12 col-md-12 hidden" data-section="warehouse">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-warehouse"></i><span class="ml-2 mr-1">Magazyny</span><small>(strona nr: <span class="page-number">1</span>)</small>
                <span class="pull-right">
                    <i class="tim-icons icon-minimal-down action-import font-weight-bold hidden" data-element="warehouse"></i>
                    <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="warehouse"></i>
                </span>
            </h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="warehouse">
                  <thead>
                      <tr>
                          <th data-sortable="id">ID</th>
                          <th data-sortable="name">Nazwa</th>
                          <th data-sortable="descr">Opis</th>
                          <th data-sortable="city">Adres</th>
                          <th>Zarządzanie</th>
                      </tr>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="warehouse">
                        <ul class="pagination">
                        </ul>
                    </nav>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- modals -->
    <div class="modal" tabindex="-1" role="dialog" data-element="item">
        <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Dodawanie produktu</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="card animated fadeIn">
                    <div class="card-body">
                        <form role="form" class="form-horizontal" data-element="item">
                            <div class="row">
                                <div class="col">
                                    <div class="form-group has-label">
                                        <label>Model *</label>
                                        <input class="form-control" name="model_name" type="text" minlength="1" aria-label="">
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Indeks nadrzędny</label>
                                        <input class="form-control" name="parent_id" type="text" pattern="\d*" aria-label="">
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Kategoria * <i class="tim-icons icon-simple-add action-add hidden btn btn-link btn-icon btn-sm mb-0" data-element="itemsCategory"></i></label>
                                        <select class="form-control selectpicker" data-style="btn-primary" name="items_category_id" data-live-search="true" aria-label="Kategoria">
                                        </select>
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Producent * <i class="tim-icons icon-simple-add action-add hidden btn btn-link btn-icon btn-sm mb-0" data-element="itemsManufacturer"></i></label>
                                        <select class="form-control selectpicker" data-style="btn-primary" name="items_manufacturer_id" data-live-search="true" aria-label="Producent"></select>
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Jednostka miary *</label>
                                        <select class="form-control selectpicker" data-style="btn-primary" name="unit_id" data-live-search="true" aria-label="Jednostka miary"></select>
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Ukryty *</label>
                                        <select class="form-control selectpicker" data-style="btn-primary" name="hidden" data-live-search="true" aria-label="Ukryty">
                                            <option value="0">Nie</option>
                                            <option value="1">Tak</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="form-group has-label">
                                        <label>Ilość minimalna *</label>
                                        <input class="form-control" name="low_quant" type="number" step="1" min="0" value="0"  aria-label="Ilość minimalna">
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Posiada S/N i/lub MAC *</label>
                                        <select class="form-control selectpicker" data-style="btn-primary" name="has_data" data-live-search="false"  aria-label="Posiada S/N/MAC">
                                            <option value="0">Nie</option>
                                            <option value="1">Tak</option>
                                        </select>
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Opis produktu</label>
                                        <textarea class="form-control" name="descr" aria-label="Opis"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <div class="fileinput fileinput-new" data-provides="fileinput">
                                            <div class="fileinput-new img-thumbnail" style="width: 200px; height: 124px; background-color: #ffffff;" data-type="thumb">
                                            </div>
                                            <div class="fileinput-preview fileinput-exists img-thumbnail" style="max-width: 200px; max-height: 124px; background-color: #ffffff;"></div>
                                            <div>
                                            <span class="btn btn-outline-secondary btn-file">
                                                <span class="fileinput-new">Wybierz obraz</span>
                                                <span class="fileinput-exists">Zmień</span>
                                                <input type="file" name="photo">
                                            </span>
                                            <a href="#" class="btn btn-outline-secondary fileinput-exists" data-dismiss="fileinput">Usuń</a>
                                          </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div class="category form-category">* Pola wymagane</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="item">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="itemsCategory">
        <div class="modal-dialog animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Dodawanie kategorii</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="card animated fadeIn">
                    <div class="card-body">
                        <form role="form" class="form-horizontal" data-element="itemsCategory">
                            <div class="form-group has-label">
                                <label>Nazwa kategorii *</label>
                                <input class="form-control" name="name" type="text" minlength="1" aria-label="Nazwa kategorii">
                            </div>
                        </form>
                        <div class="category form-category">* Pola wymagane</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="itemsCategory">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="itemsManufacturer">
        <div class="modal-dialog animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Dodawanie producenta</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="card animated fadeIn">
                    <div class="card-body">
                        <form role="form" class="form-horizontal" data-element="itemsManufacturer">
                            <div class="form-group has-label">
                                <label>Nazwa producenta *</label>
                                <input class="form-control" name="name" type="text" minlength="1" aria-label="Nazwa producenta">
                            </div>
                        </form>
                        <div class="category form-category">* Pola wymagane</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="itemsManufacturer">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="unit">
        <div class="modal-dialog animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Dodawanie jedn. miary</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="card animated fadeIn">
                    <div class="card-body">
                        <form role="form" class="form-horizontal" data-element="unit">
                            <div class="form-group has-label">
                                <label>Nazwa jedn. miary *</label>
                                <input class="form-control" name="name" type="text" minlength="3" aria-label="Nazwa jedn. miary">
                            </div>
                            <div class="form-group has-label">
                                <label>Skrócona nazwa jedn. miary *</label>
                                <input class="form-control" name="short_name" type="text" minlength="1" aria-label="Skrócona nazwa jedn. miary">
                            </div>
                            <div class="form-group has-label">
                                <label>Typ jednostki *</label>
                                <select class="form-control selectpicker" data-style="btn-primary" name="type" data-live-search="true" aria-label="Typ jednostki">
                                    <option value="0">Ilościowa (np. szt, kpl)</option>
                                    <option value="1">Metryczna/Wagowa (np. m, g)</option>
                                </select>
                            </div>
                        </form>
                        <div class="category form-category">* Pola wymagane</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="unit">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="warehouse-import">
        <div class="modal-dialog animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Import stanów magazynowych</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="card animated fadeIn">
                    <div class="card-body">
                        <form role="form" class="form-horizontal" data-element="warehouse-import">
                            <div class="form-group has-label">
                                <div class="form-group has-label">
                                    <label>Magazyn *</label>
                                    <select class="form-control selectpicker" data-style="btn-primary" name="warehouse_id" data-live-search="true" aria-label="Magazyn">
                                    </select>
                                </div>
                            </div>
                            <div class="form-group has-label">
                                <label>CSV (dane oddzielone przecinkiem) *</label>
                                <textarea class="form-control" name="csv" rows="6" aria-label="CSV"></textarea>
                            </div>
                        </form>
                        <div class="category form-category">* Pola wymagane</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="import" data-form="warehouse-import">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="item-import">
        <div class="modal-dialog animated fadeInDown modal-xlg" role="document">
            <div class="modal-content">
                <form role="form" class="form-horizontal" data-element="item-import">
                    <div class="modal-header">
                        <h5 class="modal-title">Masowe dodawanie produktów</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col">
                                        <section data-element="item-import">
                                            <table class="table" data-element="item-import">
                                                <thead>
                                                    <tr>
                                                        <th class="text-center"></th>
                                                        <th class="text-center" style="width: 15%;">Producent * <i class="tim-icons icon-simple-add action-add btn btn-link btn-icon btn-sm" data-element="itemsManufacturer"></i></th>
                                                        <th class="text-center" style="width: 40%;">Model *</th>
                                                        <th class="text-center" style="width: 15%;">Kategoria * <i class="tim-icons icon-simple-add action-add btn btn-link btn-icon btn-sm" data-element="itemsCategory"></i></th>
                                                        <th class="text-center" style="width: 10%;">J.m. *</th>
                                                        <th class="text-center" style="width: 10%;">Ilość min. *</th>
                                                        <th class="text-center" style="width: 10%;">Posiada SN/MAC? *</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                                <tfoot>
                                                <tr>
                                                    <td colspan="7">
                                                        <button type="button" class="btn btn-default pull-right action-add-row">Dodaj pozycję</button>
                                                    </td>
                                                </tr>
                                                </tfoot>
                                            </table>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                    <button type="button" class="btn btn-primary" data-action="submit" data-type="import" data-form="item-import">Dodaj</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="warehousesPlace-import">
        <div class="modal-dialog animated fadeInDown modal-lg" role="document">
            <div class="modal-content">
                <form role="form" class="form-horizontal" data-element="warehousesPlace-import">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fa fa-pallet"></i> Masowe dodawanie miejsc magazynowania</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col">
                                        <div class="form-group has-label">
                                            <label>Magazyn *</label>
                                            <select class="form-control selectpicker" data-style="btn-default" name="warehouse_id" data-live-search="true" aria-label="Magazyn">
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <section data-element="warehousesPlace-import">
                                            <table class="table" data-element="warehousesPlace-import">
                                                <thead>
                                                <tr>
                                                    <th class="text-center"></th>
                                                    <th class="text-center">Nazwa miejsca *</th>
                                                    <th class="text-center">Produkt</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                                <tfoot>
                                                <tr>
                                                    <td colspan="7">
                                                        <button type="button" class="btn btn-default pull-right action-add-row">Dodaj pozycję</button>
                                                    </td>
                                                </tr>
                                                </tfoot>
                                            </table>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                    <button type="button" class="btn btn-primary" data-action="submit" data-type="import" data-form="warehousesPlace-import">Dodaj</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="warehousesPlace">
        <div class="modal-dialog animated fadeInDown" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-pallet"></i> <span>Dodawanie miejsca magazynowego</span></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="card animated fadeIn">
                        <div class="card-body">
                            <form role="form" class="form-horizontal" data-element="warehousesPlace" autocomplete="off">
                                <div class="form-group has-label">
                                    <label>Magazyn *</label>
                                    <select class="form-control selectpicker" data-style="btn-default" name="warehouse_id" data-live-search="true" aria-label="Magazyn">
                                    </select>
                                </div>
                                <div class="form-group has-label">
                                    <label>Nazwa miejsca *</label>
                                    <input class="form-control" name="name" type="text" minlength="3" aria-label="Nazwa miejsca">
                                </div>
                                <div class="form-group has-label">
                                    <label>Produkt</label>
                                    <div class="ui search resource-search" data-resource="item">
                                        <div class="ui icon input">
                                            <input class="form-control prompt" type="text" placeholder="Wyszukaj produkt" autocomplete="off">
                                            <i class="search icon"></i>
                                        </div>
                                    </div>
                                </div>
                                <input type="hidden" name="item_id">
                            </form>
                            <div class="category form-category">* Pola wymagane</div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                    <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="warehousesPlace">Dodaj</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="warehouse">
        <div class="modal-dialog animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Dodawanie magazynu</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="card animated fadeIn">
                    <div class="card-body">
                        <form role="form" class="form-horizontal" data-element="warehouse">
                            <div class="form-group has-label">
                                <label>Nazwa magazynu *</label>
                                <input class="form-control" name="name" type="text" minlength="3" aria-label="Nazwa magazynu">
                            </div>
                            <div class="form-group has-label">
                                <label>Opis magazynu</label>
                                <input class="form-control" name="descr" type="text" minlength="3" aria-label="Opis magazynu">
                            </div>
                            <div class="form-group has-label">
                                <div class="form-group has-label">
                                    <label>Adres (ulica, nr domu, nr lokalu) *</label>
                                    <input class="form-control" name="street" placeholder="np. Grunwaldzka 13" type="text" minlength="3" aria-label="Adres">
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group has-label col-lg-4 col-md-4">
                                    <label>Kod pocztowy *</label>
                                    <input class="form-control" name="postcode" placeholder="np. 00-107" type="text" minlength="6" maxlength="6" aria-label="Kod pocztowy">
                                </div>
                                <div class="form-group has-label col-lg-8 col-md-4">
                                    <label>Miejscowość *</label>
                                    <input class="form-control" name="city" type="text" minlength="1" aria-label="Miejscowość">
                                </div>
                            </div>
                            <div class="form-group has-label">
                                <div class="form-group has-label">
                                    <label>Kraj *</label>
                                    <select class="form-control selectpicker" data-style="btn-primary" name="country_id" data-live-search="true" aria-label="Kraj">
                                    </select>
                                </div>
                            </div>
                            <div class="form-group has-label">
                                <div class="form-group has-label">
                                    <label>Typ magazynu *</label>
                                    <select class="form-control selectpicker" data-style="btn-primary" name="type" aria-label="Typ magazynu">
                                        <option value="0">Główny</option>
                                        <option value="1">Poboczny</option>
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
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="warehouse">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="warehousesIn">
        <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nowe przyjęcie zewnętrzne</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <form role="form" class="form-horizontal" data-element="warehousesIn">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="form-group has-label col-lg-3 col-md-3">
                                    <label>Kontrahent/Dostawca * <i class="tim-icons icon-simple-add action-add hidden btn btn-link btn-icon btn-sm" data-element="contractor"></i></label>
                                    <select class="form-control selectpicker" data-style="btn-default" name="contractor_id" data-live-search="true" aria-label="Kontrahent/Dostawca">
                                    </select>
                                </div>
                                <div class="col-lg-3 col-md-3">
                                    <label>Numer oryginalnej faktury *</label>
                                    <input class="form-control" name="document_name" placeholder="" type="text" aria-label="Numer oryginalnej faktury" minlength="1">
                                </div>
                                <div class="col-lg-3 col-md-3">
                                    <label>Data wystawienia faktury *</label>
                                    <input class="form-control" name="invoice_date" placeholder="" type="date" aria-label="Data wystawienia faktury" required>
                                </div>
                                <div class="form-group has-label col-lg-3 col-md-3">
                                    <label>Magazyn przyjęcia *</label>
                                    <select class="form-control selectpicker" data-style="btn-default" name="warehouse_id" data-live-search="true" aria-label="Magazyn przyjęcia">
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <section data-element="warehousesIn">
                                        <table class="table table-stripped" data-element="warehousesIn">
                                            <thead>
                                                <tr>
                                                    <th class="text-center"></th>
                                                    <th class="text-center" style="width: 52.5%;">Produkt <i class="tim-icons icon-simple-add action-add btn btn-link btn-icon btn-sm" data-element="item"></i></th>
                                                    <th class="text-center" style="width: 15%"></th>
                                                    <th class="text-center" style="width: 7.5%;">Ilość</th>
                                                    <th class="text-center" style="width: 7.5%;">J.m.</th>
                                                    <th class="text-center" style="width: 10%;">Cena Netto</th>
                                                    <th class="text-center" style="width: 10%;">Podatek</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colspan="7">
                                                        <button type="button" class="btn btn-default pull-right action-add-row">Dodaj pozycję</button>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <label>Notatka</label>
                                    <textarea class="form-control" rows="3" name="notes" placeholder="wpisz notatki" aria-label="notatki"></textarea>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12 col-md-12">
                                    <div class="row">
                                        <div class="col-lg-12 col-md-12 mt-3">Skan faktury *</div>
                                    </div>
                                    <div class="fileinput fileinput-new" data-provides="fileinput">
                                        <span class="btn btn-outline-secondary btn-file">
                                            <span class="fileinput-new">Wybierz plik</span>
                                            <span class="fileinput-exists">Zmień</span>
                                            <input type="file" name="file" multiple="">
                                        </span>
                                        <div>
                                            <span class="fileinput-filename"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12">
                                    <div class="form-check">
                                        <label class="form-check-label hidden">
                                            <input class="form-check-input" type="checkbox" name="import_only" value="true">
                                            <span class="form-check-sign"></span>
                                            Tylko import danych (bez PZ)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="warehousesIn">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="warehousesMove">
        <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fa fa-sync-alt mr-1"></i> Nowe przesunięcie międzymagazynowe</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
              <div class="modal-body">
                  <form role="form" class="form-horizontal" data-element="warehousesMove">
                      <div class="card">
                          <div class="card-body">
                              <div class="row">
                                  <div class="form-group has-label col-lg-4 col-md-4">
                                      <label>Magazyn źródłowy *</label>
                                      <select class="form-control" data-style="btn-default" name="warehouse_in_id" data-live-search="true" aria-label="Magazyn źródłowy">
                                      </select>
                                  </div>
                                  <div class="col-lg-4 col-md-4">
                                  </div>
                                  <div class="form-group has-label col-lg-4 col-md-4">
                                      <label>Magazyn docelowy *</label>
                                      <select class="form-control" data-style="btn-default" name="warehouse_out_id" data-live-search="true" aria-label="Magazyn docelowy">
                                      </select>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-body">
                              <div class="row">
                                  <div class="col">
                                      <section data-element="warehousesMove">
                                          <table class="table table-stripped" data-element="warehousesMove">
                                              <thead>
                                              <tr>
                                                  <th class="text-center"></th>
                                                  <th class="text-center" style="width: 70%;">Produkt <i class="tim-icons icon-simple-add action-add btn btn-link btn-icon btn-sm" data-element="item"></i></th>
                                                  <th class="text-center" style="width: 15%"></th>
                                                  <th class="text-center" style="width: 7.5%;">Ilość</th>
                                                  <th class="text-center" style="width: 7.5%;">J.m.</th>
                                              </tr>
                                              </thead>
                                              <tbody>
                                              </tbody>
                                              <tfoot>
                                              <tr>
                                                  <td colspan="5">
                                                      <button type="button" class="btn btn-default pull-right action-add-row">Dodaj pozycję</button>
                                                  </td>
                                              </tr>
                                              </tfoot>
                                          </table>
                                      </section>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-body">
                              <div class="row">
                                  <div class="col">
                                      <textarea class="form-control" rows="3" name="notes" placeholder="wpisz notatki"></textarea>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </form>
              </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="warehousesMove">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="warehousesOutCar">
        <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fa fa-angle-double-up mr-1"></i> Nowy rozchód wewnętrzny</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
              <div class="modal-body">
                  <form role="form" class="form-horizontal" data-element="warehousesOutCar">
                      <div class="card">
                          <div class="card-body">
                              <div class="row">
                                  <div class="form-group has-label col-lg-4 col-md-4">
                                      <label>Magazyn wydania *</label>
                                      <select class="form-control selectpicker" data-style="btn-default" name="warehouse_id" data-live-search="true" aria-label="Magazyn wydania">
                                      </select>
                                  </div>
                                  <div class="col-lg-4 col-md-4">
                                      <div class="row">
                                          <div class="col">
                                              <button type="button" class="btn btn-default action-warehouse" name="warehouse" style="margin-top: 29px;">
                                                  <i class="fa fa-warehouse"></i>&nbsp; Stan magazynu
                                              </button>
                                          </div>
                                          <div class="col">
                                          </div>
                                      </div>
                                  </div>
                                  <div class="form-group has-label col-lg-4 col-md-4">
                                      <label>Technik/Przyjmujący towar *</label>
                                      <select class="form-control selectpicker" data-style="btn-default" name="user_get_id" data-live-search="true" aria-label="Technik/Przyjmujący towar">
                                      </select>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-body">
                              <div class="row">
                                  <div class="col">
                                      <section data-element="warehousesOutCar">
                                          <table class="table table-stripped" data-element="warehousesOutCar">
                                              <thead>
                                              <tr>
                                                  <th class="text-center"></th>
                                                  <th class="text-center" style="width: 70%;">Produkt <!-- <i class="tim-icons icon-simple-add action-add btn btn-link btn-icon btn-sm" data-element="item"></i> --></th>
                                                  <th class="text-center" style="width: 15%"></th>
                                                  <th class="text-center" style="width: 7.5%;">Ilość</th>
                                                  <th class="text-center" style="width: 7.5%;">J.m.</th>
                                              </tr>
                                              </thead>
                                              <tbody>
                                              </tbody>
                                              <tfoot>
                                              <tr>
                                                  <td colspan="5">
                                                      <button type="button" class="btn btn-default pull-right action-add-row">Dodaj pozycję</button>
                                                  </td>
                                              </tr>
                                              </tfoot>
                                          </table>
                                      </section>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="card">
                          <div class="card-body">
                              <div class="row">
                                  <div class="col">
                                      <textarea class="form-control" rows="3" name="notes" placeholder="wpisz notatki"></textarea>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </form>
              </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="warehousesOutCar">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="warehousesInCar">
        <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nowy zwrot wewnętrzny</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="card animated fadeIn">
                    <div class="card-body">
                        <form role="form" class="form-horizontal" data-element="warehousesInCar">
                            <div class="row">
                                <div class="form-group has-label col-lg-4 col-md-4">
                                    <label>Technik/Zdający towar *</label>
                                    <select class="form-control selectpicker" data-style="btn-default" name="user_get_id" data-live-search="true" aria-label="Technik/Zdający towar">
                                    </select>
                                </div>
                                <div class="col-lg-4 col-md-4">
                                </div>
                                <div class="form-group has-label col-lg-4 col-md-4">
                                    <label>Magazyn przyjęcia *</label>
                                    <select class="form-control selectpicker" data-style="btn-default" name="warehouse_id" data-live-search="true" aria-label="Magazyn przyjęcia">
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-1 col-md-1">
                                </div>
                                <div class="col-lg-2 col-md-2">
                                    Indeks *
                                </div>
                                <div class="col-lg-6 col-md-6">
                                    Numery S/N i adresy MAC
                                </div>
                                <div class="col-lg-1 col-md-1">
                                    Ilość *
                                </div>
                                <div class="col-lg-1 col-md-1">
                                    J.m.
                                </div>
                            </div>
                            <section data-element="warehousesInCar">
                                <div class="form-row mb-1">
                                    <div class="col-lg-1 col-md-1">
                                    </div>
                                    <div class="col-lg-2 col-md-2">
                                        <div class="ui search resource-item">
                                            <div class="ui icon input">
                                                <input class="form-control prompt" type="text" placeholder="Podaj indeks" autocomplete="off">
                                                <i class="search icon"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <button type="button" class="btn btn-info btn-block" name="data-add" style="margin-top: -1px;" disabled>Dodaj dane</button>
                                    </div>
                                    <div class="col-lg-1 col-md-1">
                                        <input class="form-control" name="quantity" type="number" step="1" min="1" max="10" value="1" required>
                                    </div>
                                    <div class="col-lg-1 col-md-1">
                                        <input class="form-control" name="unit" type="text" disabled required>
                                    </div>
                                    <div class="col-lg-1 col-md-1">
                                    </div>
                                    <input type="hidden" name="item_id">
                                    <input type="hidden" name="item_data" value="[]">
                                    <input type="hidden" name="has_data">
                                </div>
                                <div class="row">&nbsp;</div>
                                <button type="button" class="btn btn-default pull-right action-add-row">Dodaj pozycję</button>
                            </section>
                            <textarea class="form-control" rows="3" name="notes" placeholder="wpisz notatki"></textarea>
                            <div class="row">
                                <div class="form-group has-label col-lg-4 col-md-4">
                                </div>
                                <div class="col-lg-4 col-md-4">
                                </div>
                                <div class="col-lg-4 col-md-4">
                                </div>
                            </div>
                        </form>
                        <div class="category form-category">* Pola wymagane</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="warehousesInCar">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="carsOut">
        <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nowe wydanie zewnętrzne</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <form role="form" class="form-horizontal" data-element="carsOut">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-lg-4 col-md-4">
                                    <label>Cel wydania *</label>
                                    <select class="form-control selectpicker" name="type" aria-label="Cel wydania">
                                        <option value="0">Klient</option>
                                        <option value="1">Inwestycja</option>
                                    </select>
                                </div>
                                <div class="form-group has-label col-lg-4 col-md-4">
                                    <label>Klient *</label>
                                    <div class="ui search resource-search" data-resource="clientNodes">
                                        <div class="ui icon input">
                                            <input class="form-control prompt" type="text" placeholder="Wyszukaj klienta w systemie LMS" aria-label="Klient">
                                            <input type="hidden" name="client_id" value="">
                                            <i class="search icon"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group has-label col-lg-4 col-md-4 hidden">
                                    <label>Inwestycja *</label>
                                    <div class="ui search resource-search" data-resource="investment">
                                        <div class="ui icon input">
                                            <input class="form-control prompt" type="text" placeholder="Wyszukaj inwestycję" aria-label="Inwestycja">
                                            <input type="hidden" name="investment_id" value="">
                                            <i class="search icon"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group has-label col-lg-4 col-md-4">
                                    <button type="button" class="btn btn-default action-own-stock" name="own-stock" style="margin-top: 29px;"><i class="tim-icons icon-delivery-fast"></i>&nbsp; Stan własny</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card animated fadeIn hidden">
                        <div class="card-header">
                            <strong>Węzły klienta</strong>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-lg-12 col-md-12 text-center">
                                    <table class="table table-stripped table-condensed" data-data="nodes">
                                        <thead>
                                            <tr>
                                                <th>Węzeł</th>
                                                <th>Adres</th>
                                                <th>IP</th>
                                                <th>Hasło</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>
                                    <div class="row">
                                        <div class="col">
                                            <div class="row">
                                                <div class="offset-4 col-4 form-group has-label hidden">
                                                    <label>Podaj PIN z umowy klienta</label>
                                                    <input type="text" class="form-control text-center" name="pin" aria-label="PIN">
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="offset-5 col-2">
                                                    <button type="button" class="btn btn-sm btn-primary" data-action="checkPin">Sprawdź PIN</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <strong>Produkty</strong>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-lg-4 col-md-4">
                                </div>
                                <div class="col-lg-4 col-md-4">
                                </div>
                                <div class="col-lg-4 col-md-4">
                                    <button type="button" class="btn btn-info btn-block action-add-row" style="margin-bottom: 10px;">Dodaj pozycję</button>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-1 col-md-1">
                                </div>
                                <div class="col-lg-2 col-md-2">
                                    Produkt *
                                </div>
                                <div class="col-lg-6 col-md-6">
                                </div>
                                <div class="col-lg-1 col-md-1">
                                    Ilość *
                                </div>
                                <div class="col-lg-1 col-md-1">
                                    J.m.
                                </div>
                            </div>
                            <section data-element="carsOut">
                                <div class="form-row mb-1">
                                    <div class="col-lg-1 col-md-1">
                                    </div>
                                    <div class="col-lg-2 col-md-2">
                                        <div class="ui search resource-item">
                                            <div class="ui icon input">
                                                <input class="form-control prompt" type="text" placeholder="Wyszukaj produkt" autocomplete="off">
                                                <i class="search icon"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <button type="button" class="btn btn-info btn-block" name="data-add" style="margin-top: -1px;" disabled>Dodaj dane</button>
                                    </div>
                                    <div class="col-lg-1 col-md-1">
                                        <input class="form-control" name="quantity" type="number" step="1" min="1" max="10" value="1" required>
                                    </div>
                                    <div class="col-lg-1 col-md-1">
                                        <input class="form-control" name="unit" type="text" disabled required>
                                    </div>
                                    <div class="col-lg-1 col-md-1">
                                    </div>
                                    <input type="hidden" name="item_id">
                                    <input type="hidden" name="item_data" value="[]">
                                    <input type="hidden" name="has_data">
                                </div>
                                <div class="row">&nbsp;</div>
                            </section>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <strong>Notatka</strong>
                        </div>
                        <div class="card-body">
                            <textarea class="form-control" rows="3" name="notes" placeholder="wpisz notatki"></textarea>
                            <div class="category form-category">* Pola wymagane</div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="carsOut">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="carsIn">
        <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nowy zwrot</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="card animated fadeIn">
                    <div class="card-body">
                        <form role="form" class="form-horizontal" data-element="carsIn">
                            <div class="row">
                                <div class="col">
                                    <div class="alert alert-warning">
                                        Jeśli zdemontowanego sprzętu nie ma na stanie klienta, sprawdź inwestycję <strong>urządzenia własne</strong> i wpisz w notatce od jakiego klienta sprzęt został zdemontowany.<br>
                                        Jeśli w inwestycji również brakuje zdemontowanego sprzętu, w dowolnej pozycji zaznacz <strong>Brak</strong>, wyszukaj produkt z listy dostępnych produktów w systemie oraz podaj ewentualny MAC/SN przy danej pozycji.<br>
                                        Sprzęt zostanie utworzony w systemie i dodany na Twój samochód.<br>
                                        <strong>Prośba o dokładną weryfikację stanów, aby nie dublować produktów!</strong>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-4 col-md-4">
                                    <label>Źródło zwrotu *</label>
                                    <select class="form-control selectpicker" name="type">
                                        <option value="0">Klient</option>
                                        <option value="1">Inwestycja</option>
                                    </select>
                                </div>
                                <div class="form-group has-label col-lg-5 col-md-5" data-resource="client">
                                    <div class="row">
                                        <div class="col">
                                            <label>Klient *</label>
                                            <div class="ui search resource-search">
                                                <div class="ui icon input">
                                                    <input class="form-control prompt" type="text" placeholder="Wyszukaj klienta w systemie LMS">
                                                    <input type="hidden" name="client_id" value="">
                                                    <i class="search icon"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <button type="button" disabled="disabled" class="btn btn-default action-client-stock" name="client-stock" style="margin-top: 29px;">Stan klienta</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group has-label col-lg-5 col-md-5 hidden" data-resource="investment">
                                    <div class="row">
                                        <div class="col">
                                            <label>Inwestycja *</label>
                                            <div class="ui search resource-search">
                                                <div class="ui icon input">
                                                    <input class="form-control prompt" type="text" placeholder="Wyszukaj inwestycję">
                                                    <input type="hidden" name="investment_id" value="">
                                                    <i class="search icon"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <button type="button" disabled="disabled" class="btn btn-default action-investment-stock" name="investment-stock" style="margin-top: 29px;">Stan inwestycji</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group has-label col-lg-3 col-md-3">
                                    <button type="button" class="btn btn-info btn-block action-add-row" style="margin-top: 29px;">Dodaj pozycję</button>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-1 col-md-1">
                                </div>
                                <div class="col-lg-2 col-md-2">
                                    Produkt *
                                </div>
                                <div class="col-lg-6 col-md-6">
                                </div>
                                <div class="col-lg-1 col-md-1">
                                    Ilość *
                                </div>
                                <div class="col-lg-1 col-md-1">
                                    J.m.
                                </div>
                                <div class="col-lg-1 col-md-1"></div>
                            </div>
                            <section data-element="carsIn">
                                <div class="form-row mb-1">
                                    <div class="col-lg-1 col-md-1">
                                    </div>
                                    <div class="col-lg-2 col-md-2">
                                        <div class="ui search resource-item">
                                            <div class="ui icon input">
                                                <input class="form-control prompt" type="text" placeholder="Wyszukaj produkt" autocomplete="off">
                                                <i class="search icon"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <button type="button" class="btn btn-info btn-block" name="data-add" style="margin-top: -1px;" disabled>Dodaj dane</button>
                                    </div>
                                    <div class="col-lg-1 col-md-1">
                                        <input class="form-control" name="quantity" type="number" step="1" min="1" max="10" value="1" required>
                                    </div>
                                    <div class="col-lg-1 col-md-1">
                                        <input class="form-control" name="unit" type="text" disabled required>
                                    </div>
                                    <div class="col-lg-1 col-md-1">
                                        <div class="form-check form-check-inline" style="margin-top: 10px;">
                                            <label class="form-check-label text-center">
                                              <input class="form-check-input" name="new" type="checkbox" value="">
                                              <span class="form-check-sign">Brak</span>
                                            </label>
                                        </div>
                                    </div>
                                    <input type="hidden" name="item_id">
                                    <input type="hidden" name="item_data" value="[]">
                                    <input type="hidden" name="has_data">
                                </div>
                                <div class="row">&nbsp;</div>
                            </section>
                            <textarea class="form-control" rows="3" name="notes" placeholder="wpisz notatki" aria-label="Notatki"></textarea>
                        </form>
                        <div class="category form-category">* Pola wymagane</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="carsIn">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="request">
        <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nowe zapotrzebowanie</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <form role="form" class="form-horizontal" data-element="request">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="form-group has-label col-lg-3 col-md-3">
                                    <label>Zapotrzebowanie dla *</label>
                                    <select class="form-control selectpicker" data-style="btn-default" name="car_id" data-live-search="true" aria-label="Grupa">
                                    </select>
                                </div>
                                <div class="col-lg-6 col-md-6">
                                    <label>Miejsce odbioru *</label>
                                    <select class="form-control selectpicker" data-style="btn-default" name="warehouse_id" data-live-search="true" aria-label="Magazyn">
                                    </select>
                                </div>
                                <div class="form-group has-label col-lg-3 col-md-3">
                                    <label>Data realizacji zapotrzebowania *</label>
                                    <input class="form-control" name="date" placeholder="" type="date" value="{{ date('Y-m-d', strtotime('+1 day')) }}" aria-label="Data zapotrzebowania" required>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <section data-element="request">
                                        <table class="table table-stripped" data-element="request">
                                            <thead>
                                            <tr>
                                                <th class="text-center"></th>
                                                <th class="text-center" style="width: 80.0%;">Produkt <!-- <i class="tim-icons icon-simple-add action-add btn btn-link btn-icon btn-sm" data-element="item"></i> --></th>
                                                <th class="text-center" style="width: 10%;">Ilość</th>
                                                <th class="text-center" style="width: 10%;">J.m.</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td colspan="4">
                                                    <button type="button" class="btn btn-default pull-right action-add-row">Dodaj pozycję</button>
                                                </td>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <textarea class="form-control" rows="3" name="notes" placeholder="wpisz notatki" aria-label="notatki"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="request">Dodaj</button>
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
                                    <select class="form-control selectpicker" data-style="btn-primary" name="type" data-live-search="false" aria-label="Typ">
                                        <option value="0">Firma</option>
                                        <option value="1">Osoba fizyczna</option>
                                    </select>
                                </div>
                                <div class="form-group has-label col-lg-6 col-md-6">
                                    <label>Nazwa firmy/Imię i nazwisko *</label>
                                    <input class="form-control" name="name" type="text" minlength="3" aria-label="Nazwa firmy/Imię nazwisko">
                                </div>
                                <div class="form-group has-label col-lg-3 col-md-3">
                                    <label>NIP</label>
                                    <input class="form-control" name="nip" type="text" minlength="10"  maxlength="10" aria-label="NIP">
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group has-label col-lg-7 col-md-7">
                                    <label>Adres (ulica, nr domu, nr lokalu) *</label>
                                    <input class="form-control" name="street" placeholder="np. Grunwaldzka 13" type="text" minlength="3" aria-label="Adres">
                                </div>
                                <div class="form-group has-label col-lg-2 col-md-2">
                                    <label>Kod pocztowy *</label>
                                    <input class="form-control" name="postcode" placeholder="np. 00-107" type="text" minlength="6" maxlength="6" aria-label="Kod pocztowy">
                                </div>
                                <div class="form-group has-label col-lg-3 col-md-3">
                                    <label>Miejscowość *</label>
                                    <input class="form-control" name="city" type="text" minlength="3" aria-label="Miejscowość">
                                </div>
                            </div>
                            <div class="form-group has-label">
                                <div class="form-group has-label">
                                    <label>Kraj *</label>
                                    <select class="form-control selectpicker" data-style="btn-primary" name="country_id" data-live-search="true" aria-label="Kraj">
                                    </select>
                                </div>
                            </div>
                            <div class="form-group has-label">
                                <div class="form-group has-label">
                                    <label>Numer konta bankowego</label>
                                    <input class="form-control" name="bacc_iban" placeholder="" type="text" minlength="3" aria-label="Numer konta bankowego">
                                </div>
                            </div>
                            <div class="form-group has-label">
                                <div class="form-group has-label">
                                    <label>Kod SWIFT banku</label>
                                    <input class="form-control" name="bacc_swift" placeholder="" type="text" minlength="3" aria-label="Kod SWIFT">
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
                                    <input class="form-control" name="name" placeholder="" type="text" minlength="3" aria-label="Nazwa">
                                </div>
                            </div>
                            <div class="form-group has-label">
                                <div class="form-group has-label">
                                    <label>Numer rejestracyjny *</label>
                                    <input class="form-control" name="registration" placeholder="" type="text" minlength="3" aria-label="Numer rejestracyjny">
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

    <!-- clickable globals -->
    <div class="modal" tabindex="-1" role="dialog" data-element="item-clickable">
        <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row" data-data="item-clickable">
                    <div class="col-3 hidden"></div>
                    <div class="col">
                        <div class="card">
                            <div class="card-header">
                                <strong>Stany magazynowe</strong>
                            </div>
                            <div class="card-body">
                                <table class="table table-stripped" data-resource="item-clickable">
                                    <thead>
                                        <tr>
                                            <th>Indeks</th>
                                            <th>Magazyn</th>
                                            <th>Miejsce mag.</th>
                                            <th>Stan</th>
                                            <th>J.m.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" data-data="last-wIn">
                    <div class="col-3 hidden"></div>
                    <div class="col">
                        <div class="card">
                            <div class="card-header">
                                <strong>Stany w grupach</strong>
                            </div>
                            <div class="card-body">
                                <table class="table table-stripped" data-resource="last-cars">
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nazwa</th>
                                        <th>Opis grupy</th>
                                        <th>Ilość</th>
                                        <th>J.m.</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" data-data="last-wIn">
                    <div class="col-3 hidden"></div>
                    <div class="col">
                        <div class="card">
                            <div class="card-header">
                                <strong>Ostatnie przyjęcia magazynowe</strong>
                            </div>
                            <div class="card-body">
                                <table class="table table-stripped" data-resource="last-wIn">
                                    <thead>
                                    <tr>
                                        <th>Dokument</th>
                                        <th>Magazyn</th>
                                        <th>Kontrahent</th>
                                        <th>Przyjął</th>
                                        <th>Data przyjęcia</th>
                                        <th>Faktura</th>
                                        <th>Data faktury</th>
                                        <th>Ilość</th>
                                        <th>J.m.</th>
                                        <th>Cena (netto/szt.)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="warehouse-clickable">
        <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <div class="pull-right">
                    <input type="text" class="form-control-search-modal" name="search" data-search="warehouse-clickable" placeholder="wyszukaj pordukt">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
            <div class="modal-body">
                <table class="table table-stripped" data-resource="warehouse-clickable">
                    <thead>
                    <tr>
                        <th data-sortable="item_id">Indeks</th>
                        <th>Miejsce mag.</th>
                        <th data-sortable="items.items_manufacturers.name">Producent</th>
                        <th data-sortable="items.model_name">Model</th>
                        <th data-sortable="items.items_categories.name">Kategoria</th>
                        <th data-sortable="quantity">Stan</th>
                        <th data-sortable="items.units.short_name">J.m.</th>
                        <th>Cena (średnia)</th></tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="warehouse-clickable">
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
    <div class="modal" tabindex="-1" role="dialog" data-element="element-clickable">
        <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <table class="table table-stripped">
                    <thead>
                        <tr>
                            <th>Indeks</th>
                            <th>S/N</th>
                            <th>MAC</th>
                        </tr>
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
    <div class="modal" tabindex="-1" role="dialog" data-element="warehousesIn-clickable">
        <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header hidden-sm">
                <h5 class="modal-title"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row ml-2">
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <img src="assets/img/logo.png" alt="">
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <strong>Kontrahent/Dostawca</strong>
                        <p class="contractor ml-2"></p>
                    </div>
                    <div class="col-lg-4 col-md4 col-sm-4">
                        <strong>Magazyn</strong>
                        <p class="warehouse ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 text-center mt-5 mb-5 doc-name">
                        <strong>Dokument nr <span class="name"></span></strong>
                    </div>
                </div>
                <table class="table table-stripped" data-resource="warehousesIn-clickable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Indeks</th>
                            <th>Producent</th>
                            <th>Model</th>
                            <th>Ilość</th>
                            <th>J.m.</th>
                            <th>Cena (netto)</th>
                            <th>Podatek</th>
                            <th>Cena (brutto)</th>
                            <th>Wartość (netto)</th>
                            <th>Wartość (brutto)</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <div class="row">
                    <div class="col-lg-7 col-md-7 col-sm-7 mt-4 mb-4">
                        <strong>Uwagi</strong>
                        <p class="notes ml-2"></p>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-2"></div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Data wystawienia</strong>
                        <p class="date ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-9 col-md-9 col-sm-9">
                        <strong>Załączniki</strong>
                        <p class="ml-2">
                            <ul class="files"></ul>
                        </p>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Wystawił</strong>
                        <p class="user ml-2"></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer hidden-sm">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
                <!-- <button type="button" class="btn btn-info action-print">Drukuj</button> -->
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="warehousesImport-clickable">
        <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
            <div class="modal-content">
                <div class="modal-header hidden-sm">
                    <h5 class="modal-title"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row ml-2">
                        <div class="col-lg-4 col-md-4 col-sm-4">
                            <img src="assets/img/logo.png" alt="">
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-4">
                        </div>
                        <div class="col-lg-4 col-md4 col-sm-4">
                            <strong>Magazyn</strong>
                            <p class="warehouse ml-2"></p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12 text-center mt-5 mb-5 doc-name">
                            <strong>Dokument nr <span class="name"></span></strong>
                        </div>
                    </div>
                    <table class="table table-stripped" data-resource="warehousesImport-clickable">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Indeks</th>
                            <th>Producent</th>
                            <th>Model</th>
                            <th>Ilość</th>
                            <th>J.m.</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <div class="row">
                        <div class="col-lg-7 col-md-7 col-sm-7 mt-4 mb-4">
                            <strong>Uwagi</strong>
                            <p class="notes ml-2"></p>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2"></div>
                        <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                            <strong>Data wystawienia</strong>
                            <p class="date ml-2"></p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-9 col-md-9 col-sm-9"></div>
                        <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                            <strong>Wystawił</strong>
                            <p class="user ml-2"></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer hidden-sm">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
                    <!-- <button type="button" class="btn btn-info action-print">Drukuj</button> -->
                </div>
            </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="investment-clickable">
        <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header hidden-sm">
                <h5 class="modal-title"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="card">
                    <div class="card-body">
                        <div class="row ml-2 mt-2 mb-2">
                            <div class="col-lg-4 col-md-4 col-sm-4">
                                <img src="assets/img/logo.png" alt="">
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-4">
                            </div>
                            <div class="col-lg-4 col-md4 col-sm-4">
                                <strong>Inwestycja</strong>
                                <p class="investment ml-2"></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-sm-12 text-center mt-1 mb-5 doc-name">
                                <strong>Podinwestycje/Etapy</strong>
                            </div>
                        </div>
                        <table class="table table-stripped schemas">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Etap</th>
                                <th>Plan. data rozp.</th>
                                <th>Plan. data zak.</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-lg-12 col-md-12 col-sm-12 text-center mt-1 mb-5 doc-name">
                                        <strong>Planowany materiał</strong>
                                    </div>
                                </div>
                                <table class="table table-stripped planned" data-resource="investment-clickable">
                                    <thead>
                                    <tr>
                                        <th>Indeks</th>
                                        <th>Producent</th>
                                        <th>Model</th>
                                        <th>Ilość</th>
                                        <th>J.m.</th>
                                        <th>Śr. wartość Netto</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-lg-12 col-md-12 col-sm-12 text-center mt-1 mb-5 doc-name">
                                        <strong>Stan inwestycji</strong>
                                    </div>
                                </div>
                                <table class="table table-stripped stock" data-resource="investment-clickable">
                                    <thead>
                                    <tr>
                                        <th>Indeks</th>
                                        <th>Producent</th>
                                        <th>Model</th>
                                        <th>Ilość</th>
                                        <th>J.m.</th>
                                        <th>Śr. wartość Netto</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-7 col-md-7 col-sm-7 mt-4 mb-4">
                        <strong>Opis inwestycji</strong>
                        <p class="descr ml-2"></p>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-2"></div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Data utworzenia inwestycji</strong>
                        <p class="date ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-9 col-md-9 col-sm-9">
                        <strong>Załączniki</strong><span class="attachments ml-2 clickable">Pobierz wszystkie</span>
                        <p class="ml-2">
                            <ul class="files" data-res="investment"></ul>
                        </p>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Utworzył</strong>
                        <p class="user ml-2"></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer hidden-sm">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="client-clickable">
        <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header hidden-sm">
                <h5 class="modal-title"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row ml-2">
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <img src="assets/img/logo.png" alt="">
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                    </div>
                    <div class="col-lg-4 col-md4 col-sm-4">
                        <strong>Klient</strong>
                        <p class="client ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 text-center mt-5 mb-5 doc-name">
                        <strong>Stan klienta: <span class="client_name"></span></strong>
                    </div>
                </div>
                <table class="table table-stripped" data-resource="client-clickable">
                    <thead>
                        <tr>
                            <th>Indeks</th>
                            <th>Producent</th>
                            <th>Model</th>
                            <th>Ilość</th>
                            <th>J.m.</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <div class="row">
                    <div class="col-lg-7 col-md-7 col-sm-7 mt-4 mb-4">
                        <strong>Uwagi</strong>
                        <p class="notes ml-2"></p>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-2"></div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Data utworzenia klienta</strong>
                        <p class="date ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-9 col-md-9 col-sm-9"></div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4"></div>
                </div>
            </div>
            <div class="modal-footer hidden-sm">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
                <button type="button" class="btn btn-info action-print">Drukuj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="warehousesOutCar-clickable">
        <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header hidden-sm">
                <h5 class="modal-title"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row ml-2">
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <img src="assets/img/logo.png" alt="">
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <strong>Magazyn</strong>
                        <p class="warehouse ml-2"></p>
                    </div>
                    <div class="col-lg-4 col-md4 col-sm-4">
                        <strong>Pojazd</strong>
                        <p class="car ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 text-center mt-5 mb-5 doc-name">
                        <strong>Dokument nr <span class="name"></span></strong>
                    </div>
                </div>
                <table class="table table-stripped" data-resource="warehousesOutCar-clickable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Indeks</th>
                            <th>Producent</th>
                            <th>Model</th>
                            <th>Ilość</th>
                            <th>J.m.</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <div class="row">
                    <div class="col-lg-9 col-md-9 col-sm-9 mt-4 mb-4">
                        <strong>Uwagi</strong>
                        <p class="notes ml-2"></p>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Data wystawienia</strong>
                        <p class="date ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-9 col-md-9 col-sm-9 mt-4 mb-4">
                        <strong>Wystawił</strong>
                        <p class="user-approved ml-2"></p>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Przyjął</strong>
                        <p class="user-get ml-2"></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer hidden-sm">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
                <!-- <button type="button" class="btn btn-info action-print">Drukuj</button> -->
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="warehousesMove-clickable">
        <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header hidden-sm">
                <h5 class="modal-title"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row ml-2">
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <img src="assets/img/logo.png" alt="">
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <strong>Magazyn źródłowy</strong>
                        <p class="warehouse_in ml-2"></p>
                    </div>
                    <div class="col-lg-4 col-md4 col-sm-4">
                        <strong>Magazyn docelowy</strong>
                        <p class="warehouse_out ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 text-center mt-5 mb-5 doc-name">
                        <strong>Dokument nr <span class="name"></span></strong>
                    </div>
                </div>
                <table class="table table-stripped" data-resource="warehousesMove-clickable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Indeks</th>
                            <th>Producent</th>
                            <th>Model</th>
                            <th>Ilość</th>
                            <th>J.m.</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <div class="row">
                    <div class="col-lg-9 col-md-9 col-sm-9 mt-4 mb-4">
                        <strong>Uwagi</strong>
                        <p class="notes ml-2"></p>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Data wystawienia</strong>
                        <p class="date ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-9 col-md-9 col-sm-9 mt-4 mb-4">
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Wystawił</strong>
                        <p class="user ml-2"></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer hidden-sm">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
                <!-- <button type="button" class="btn btn-info action-print">Drukuj</button> -->
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="warehousesInCar-clickable">
        <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header hidden-sm">
                <h5 class="modal-title"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row ml-2">
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <img src="assets/img/logo.png" alt="">
                    </div>
                    <div class="col-lg-4 col-md4 col-sm-4">
                        <strong>Pojazd</strong>
                        <p class="car ml-2"></p>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <strong>Magazyn</strong>
                        <p class="warehouse ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 text-center mt-5 mb-5 doc-name">
                        <strong>Dokument nr <span class="name"></span></strong>
                    </div>
                </div>
                <table class="table table-stripped" data-resource="warehousesInCar-clickable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Indeks</th>
                            <th>Producent</th>
                            <th>Model</th>
                            <th>Ilość</th>
                            <th>J.m.</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <div class="row">
                    <div class="col-lg-9 col-md-9 col-sm-9 mt-4 mb-4">
                        <strong>Uwagi</strong>
                        <p class="notes ml-2"></p>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Data wystawienia</strong>
                        <p class="date ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-9 col-md-9 col-sm-9 mt-4 mb-4">
                        <strong>Zdał</strong>
                        <p class="user-get ml-2"></p>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Przyjął</strong>
                        <p class="user-approved ml-2"></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer hidden-sm">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
                <!-- <button type="button" class="btn btn-info action-print">Drukuj</button> -->
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="carsOut-clickable">
        <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header hidden-sm">
                <h5 class="modal-title"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row ml-2">
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <img src="assets/img/logo.png" alt="">
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <strong>Pojazd</strong>
                        <p class="car ml-2"></p>
                    </div>
                    <div class="col-lg-4 col-md4 col-sm-4">
                        <strong>Klient/Inwestycja</strong>
                        <p class="client ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 text-center mt-5 mb-5 doc-name">
                        <strong>Dokument nr <span class="name"></span></strong>
                    </div>
                </div>
                <table class="table table-stripped" data-resource="carsOut-clickable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Indeks</th>
                            <th>Producent</th>
                            <th>Model</th>
                            <th>Ilość</th>
                            <th>J.m.</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <div class="row">
                    <div class="col-lg-9 col-md-9 col-sm-9 mt-4 mb-4">
                        <strong>Uwagi</strong>
                        <p class="notes ml-2"></p>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Data wystawienia</strong>
                        <p class="date ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-9 col-md-9 col-sm-9 mt-4 mb-4">
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Wydał</strong>
                        <p class="user ml-2"></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer hidden-sm">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="carsIn-clickable">
        <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header hidden-sm">
                <h5 class="modal-title"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row ml-2">
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <img src="assets/img/logo.png" alt="">
                    </div>
                    <div class="col-lg-4 col-md4 col-sm-4">
                        <strong>Klient/Inwestycja</strong>
                        <p class="client ml-2"></p>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <strong>Pojazd</strong>
                        <p class="car ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 text-center mt-5 mb-5 doc-name">
                        <strong>Dokument nr <span class="name"></span></strong>
                    </div>
                </div>
                <table class="table table-stripped" data-resource="carsIn-clickable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Indeks</th>
                            <th>Producent</th>
                            <th>Model</th>
                            <th>Ilość</th>
                            <th>J.m.</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <div class="row">
                    <div class="col-lg-9 col-md-9 col-sm-9 mt-4 mb-4">
                        <strong>Uwagi</strong>
                        <p class="notes ml-2"></p>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Data wystawienia</strong>
                        <p class="date ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-9 col-md-9 col-sm-9 mt-4 mb-4">
                    </div>
                    <div class="colWystawiłlg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Wystawił</strong>
                        <p class="user ml-2"></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer hidden-sm">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="request-clickable">
        <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header hidden-sm">
                <h5 class="modal-title"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row ml-2">
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <img src="assets/img/logo.png" alt="">
                    </div>
                    <div class="col-lg-4 col-md4 col-sm-4">
                        <strong>Przygotować dla</strong>
                        <p class="car ml-1"></p>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <strong>Miejsce odbioru</strong>
                        <p class="warehouse ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 text-center mt-5 mb-5 doc-name">
                        <strong>Dokument nr <span class="name"></span></strong>
                    </div>
                </div>
                <table class="table table-stripped" data-resource="request-clickable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Indeks</th>
                            <th>Producent</th>
                            <th>Model</th>
                            <th>Ilość potrzebna</th>
                            <th>Stan mag. głównych</th>
                            <th>J.m.</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 mt-4 mb-4">
                        <strong>Uwagi</strong>
                        <p class="notes ml-2"></p>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Data zapotrzebowania</strong>
                        <p class="date-request ml-2"></p>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Data wystawienia</strong>
                        <p class="date ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-9 col-md-9 col-sm-9 mt-4 mb-4">
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Zgłaszający</strong>
                        <p class="user ml-2"></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer hidden-sm">
                <div class="pull-left">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
                </div>
                <div class="pull-right">
                    <button type="button" class="btn btn-primary action-approve hidden" data-element="request">Oznacz jako zrealizowane</button>
                </div>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="data-add">
        <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Dodawanie numerów S/N i adresów MAC</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="card">
                    <div class="card-body">
                        <form role="form" class="form-horizontal" data-element="data-add">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group has-label">
                                        <label>S/N</label>
                                        <input class="form-control" name="sn" placeholder="" type="text" minlength="3" aria-label="S/N">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group has-label">
                                        <label>MAC</label>
                                        <input class="form-control" name="mac" placeholder="" type="text" minlength="3" aria-label="MAC">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="save_data">Zapisz</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="investment">
        <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                  <i class="fa fa-project-diagram"></i>
                  <span class="ml-2">Dodawanie inwestycji</span>
              </h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <form role="form" class="form-horizontal" data-element="investment">
                    <div class="row">
                        <div class="col-lg-3 col-md-12">
                            <div class="card">
                                <div class="card-header">
                                    <strong>Podstawowe dane</strong>
                                </div>
                                <div class="card-body">
                                    <div class="form-group has-label">
                                        <label>Przyjazna nazwa inwestycji *</label>
                                        <input class="form-control" name="name" type="text" minlength="1" aria-label="Przyjazna nazwa inwestycji">
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Kod miasta inwestycji *</label>
                                        <input class="form-control" name="num_city" placeholder="np. GRU" type="text" minlength="3" maxlength="3" aria-label="Kod miasta inwestycji">
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Typ inwestycji *</label>
                                        <select class="form-control" name="num_type" aria-label="Typ inwestycji">
                                            <option value="U">Uzbrajanie</option>
                                            <option value="Z">Zaciąg</option>
                                            <option value="S">Słupy</option>
                                        </select>
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Inwestycja nadrzędna *</label>
                                        <div class="ui search resource-search" data-resource="investment">
                                            <div class="ui icon input">
                                                <input class="form-control prompt" type="text" placeholder="Wyszukaj inwestycję" aria-label="Inwestycja">
                                                <input type="hidden" name="investment_id" value="">
                                                <i class="search icon"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Planowana data rozpoczęcia inwestycji *</label>
                                        <input class="form-control" name="date_start" type="date" aria-label="Data rozpoczęcia inwestycji">
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Planowana data zakończenia inwestycji *</label>
                                        <input class="form-control" name="date_end" type="date" aria-label="Data zakończenia inwestycji">
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Realizowane przez *</label>
                                        <select class="form-control" name="car_id" aria-label="Pojazd"></select>
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Miejsce odbioru *</label>
                                        <select class="form-control" name="warehouse_id" aria-label="Magazyn zapotrzebowania"></select>
                                    </div>
                                    <div class="form-group has-label">
                                        <div class="form-check">
                                            <label class="form-check-label hidden">
                                                <input class="form-check-input" type="checkbox" name="request_create" value="true">
                                                <span class="form-check-sign"></span>
                                                Utwórz zapotrzebowanie na podstawie projektu
                                            </label>
                                        </div>
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Opis inwestycji</label>
                                        <textarea class="form-control" name="descr" type="text" rows="3"></textarea>
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Pliki projektu</label>
                                        <div class="row">
                                            <div class="col">
                                                <div class="fileinput fileinput-new" data-provides="fileinput">
                                                    <span class="btn btn-outline-secondary btn-file">
                                                        <span class="fileinput-new">Wybierz plik</span>
                                                        <span class="fileinput-exists">Zmień</span>
                                                        <input type="file" name="file" multiple>
                                                    </span>
                                                    <div>
                                                        <span class="fileinput-filename"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <ul class="files">
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-9 col-md-12">
                            <div class="card">
                                <div class="card-header">
                                    <strong>Materiał na inwestycję</strong>
                                    <div>
                                        <small>planowany/wykorzystany materiał na inwestycję</small>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col">
                                            <section data-element="investment">
                                                <table class="table table-stripped" data-element="investment">
                                                    <thead>
                                                    <tr>
                                                        <th class="text-center" style="width: 2.5%;"></th>
                                                        <th class="text-center" style="width: 2.5%;">Zap</th>
                                                        <th class="text-center" style="width: 45%;">Produkt <i class="tim-icons icon-simple-add action-add btn btn-link btn-icon btn-sm hidden" data-element="item"></i></th>
                                                        <th class="text-center" style="width: 10%;">Ilość plan.</th>
                                                        <th class="text-center" style="width: 10%;">Ilość użyta</th>
                                                        <th class="text-center" style="width: 7.5%;">J.m.</th>
                                                        <th class="text-center" style="width: 25%;">Komentarz</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                                                        <td colspan="8">
                                                            <button type="button" class="btn btn-default pull-right action-add-row">Dodaj pozycję</button>
                                                        </td>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div class="category form-category">* Pola wymagane</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="investment">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
</div>
@endsection

@section('script')
<script src="assets/demo/demo.js"></script>
<script src="assets/js/plugins/jasny-bootstrap.min.js"></script>
<script src="{{ mix('assets/js/services/warehouse.js') }}"></script>
@endsection
