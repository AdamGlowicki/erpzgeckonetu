@php ($sidebarMini = false)

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="author" content="GeckoNET">
    <meta name="description" content="GeckoNET ERP">
    <link rel="apple-touch-icon" sizes="76x76" href="assets/img/favicon.png">
    <link rel="icon" type="image/png" href="assets/img/favicon.png">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name') }} / {{ $title }}</title>
    <link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,600,700,800" rel="stylesheet">
    <link  href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" rel="stylesheet" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous"><link href="assets/css/nucleo-icons.css" rel="stylesheet">
    <link href="assets/css/jquery-ui.min.css" rel="stylesheet">
    <link href="{{ Helpers::asset('assets/css/black-dashboard.css') }}" rel="stylesheet">
    <link href="assets/css/animate.css" rel="stylesheet">
    <link href="assets/css/bootstrap-select.min.css" rel="stylesheet">
    <link href="assets/css/search.min.css" rel="stylesheet">
    <link href="assets/css/chosen.min.css" rel="stylesheet">
    @yield('style')
</head>
<body class="white-content">
    <div class="wrapper">
      <div class="sidebar" data="green">
        <div class="sidebar-wrapper">
            <div class="logo">
                <a href="javascript:void(0)" class="simple-text logo-mini" aria-label="GeckoNET logo">
                    <img src="assets/img/favicon.png">
                </a>
                <a href="javascript:void(0)" class="simple-text logo-normal">
                    GeckoNET
                </a>
            </div>
            <ul class="nav" style="padding-bottom: 200px;">
              <li data-route="dashboard">
                  <a href="/dashboard">
                    <i class="tim-icons icon-chart-bar-32"></i>
                    <p>Dashboard</p>
                  </a>
              </li>
              <li data-route="warehouse">
                  <a href="/warehouse">
                    <i class="tim-icons icon-app"></i>
                    <p>Magazyn</p>
                  </a>
              </li>
              <li data-route="cars">
                  <a href="/cars">
                    <i class="tim-icons icon-molecule-40"></i>
                    <p>Grupy</p>
                  </a>
              </li>
              <li data-route="contractors">
                  <a href="/contractors">
                    <i class="tim-icons icon-badge"></i>
                    <p>Kontrahenci</p>
                  </a>
              </li>
              <li data-route="availability">
                  <a href="/availability">
                      <i class="tim-icons icon-square-pin"></i>
                      <p>Dostępność usług</p>
                  </a>
              </li>
              <li data-route="rma">
                  <a href="/rma">
                      <i class="tim-icons icon-settings"></i>
                      <p>RMA</p>
                  </a>
              </li>
              <li data-route="bhp">
                  <a href="/bhp">
                      <i class="tim-icons icon-support-17"></i>
                      <p>Materiały BHP</p>
                  </a>
              </li>
                <li data-route="calendar">
                    <a href="/calendar">
                        <i class="tim-icons icon-calendar-60"></i>
                        <p>Kalendarz prac</p>
                    </a>
                </li>
                @if (app('App\User')->api()->can('wfm-show'))
                    <li data-route="wfm">
                        <a href="/wfm">
                            <i class="tim-icons icon-time-alarm"></i>
                            <p>@lang('wfm.title')</p>
                        </a>
                    </li>
                @endif
                <li data-route="map">
                    <a href="/map">
                        <i class="tim-icons icon-compass-05"></i>
                        <p>Mapa</p>
                    </a>
                </li>
                <li data-route="bok">
                    <a href="/bok">
                        <i class="tim-icons icon-single-02"></i>
                        <p>BOK / PH</p>
                    </a>
                </li>
                @if(!App::environment('production'))
                <li data-route="absence">
                    <a href="/absence">
                        <i class="tim-icons icon-user-run"></i>
                        <p>Urlopy</p>
                    </a>
                </li>
                @endif
                <li data-route="reports">
                    <a href="/reports">
                        <i class="tim-icons icon-paper"></i>
                        <p>@lang('reports.title')</p>
                    </a>
                </li>
                <li data-route="invest">
                    <a href="/react/invest">
                        <i class="tim-icons icon-istanbul"></i>
                        <p>Inwestycje</p>
                    </a>
                </li>
                <li data-route="wiki">
                    <a href="/wiki">
                        <i class="tim-icons icon-book-bookmark"></i>
                        <p>Wiki</p>
                    </a>
                </li>
                <li data-route="doc">
                    <a href="/doc">
                        <i class="tim-icons icon-single-copy-04"></i>
                        <p>Dokumenty</p>
                    </a>
                </li>
                <li data-route="nodes">
                    <a href="/nodes">
                        <i class="tim-icons icon-wifi"></i>
                        <p>Węzły radiowe</p>
                    </a>
                </li>
                <li data-route="invest">
                    <a href="/react/graph">
                        <i class="tim-icons icon-map-big"></i>
                        <p>Mapa procesu</p>
                    </a>
                </li>
                <li data-route="invest">
                    <a href="/react/carService">
                        <i class="tim-icons icon-bus-front-12"></i>
                        <p>Serwis samochodów</p>
                    </a>
                </li>
              <!-- <li data-route="rwdz">
                  <a href="/rwdz">
                      <i class="fa fa-list"></i>
                      <p>RWDZ</p>
                  </a>
              </li> -->
            </ul>
        </div>
      </div>
      <div class="main-panel">
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-absolute navbar-transparent">
          <div class="container-fluid">
            <div class="navbar-wrapper">
              <div class="navbar-toggle d-inline">
                <button type="button" class="navbar-toggler">
                  <span class="navbar-toggler-bar bar1"></span>
                  <span class="navbar-toggler-bar bar2"></span>
                  <span class="navbar-toggler-bar bar3"></span>
                </button>
              </div>
              <a class="navbar-brand" href="javascript:void(0)">{{ $title }}</a>
            </div>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-bar navbar-kebab"></span>
              <span class="navbar-toggler-bar navbar-kebab"></span>
              <span class="navbar-toggler-bar navbar-kebab"></span>
            </button>
            <div class="collapse navbar-collapse" id="navigation">
              <ul class="navbar-nav ml-auto">
                <li class="search-bar input-group">
                  <button class="btn btn-link" id="search-btton" data-toggle="modal" data-target="#searchModal"><i class="tim-icons icon-zoom-split"></i>
                    <span class="d-lg-none d-md-block">Wyszukaj</span>
                  </button>
                </li>
                <li class="dropdown nav-item">
                  <a href="javascript:void(0)" class="nav-link mt-nav" data-nav="car/stock/own">
                    <div class="d-none d-lg-block d-xl-block"></div>
                    <i class="tim-icons icon-delivery-fast"></i>
                    <p class="d-lg-none">
                      Mój samochód
                    </p>
                  </a>
                </li>
                <li class="dropdown nav-item">
                  <a href="javascript:void(0)" class="dropdown-toggle nav-link mt-nav" data-toggle="dropdown">
                    <div class="d-none d-lg-block d-xl-block notifications-button"></div>
                    <i class="tim-icons icon-sound-wave"></i>
                    <p class="d-lg-none">
                      Powiadomienia
                    </p>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-right dropdown-navbar notifications">
                      <li class="nav-link text-center">
                          <span class="nav-item dropdown-item">Brak powiadomień</span>
                      </li>
                  </ul>
                </li>
                <li class="dropdown nav-item">
                  <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">
                    <div class="photo">
                      <img src="assets/img/anime3.png" alt="Profil" class="hidden">
                    </div>
                    <b class="caret d-none d-lg-block d-xl-block"></b>
                    <p class="d-lg-none">
                      Ustawienia
                    </p>
                  </a>
                  <ul class="dropdown-menu dropdown-navbar dropdown-tools-menu">
                    <li class="nav-link">
                        <div class="nav-item dropdown-item username-div">
                            Zalogowany jako <br><strong></strong>
                        </div>
                    </li>
                    @if (app('App\User')->api()->can('root'))
                      <li class="dropdown-divider"></li><li class="nav-link"><a href="/manage" class="nav-item dropdown-item">Zarządzanie</a></li>
                    @endif
                    <li class="dropdown-divider"></li>
                    <li class="nav-link">
                      <a href="/profile" class="nav-item dropdown-item">Profil</a>
                    </li>
                    <li class="nav-link">
                      <a href="javascript:void(0)" class="nav-item dropdown-item">Ustawienia</a>
                    </li>
                    <li class="dropdown-divider"></li>
                    <li class="nav-link">
                      <a href="javascript:void(0)" class="nav-item dropdown-item logout">Wyloguj</a>
                    </li>
                  </ul>
                </li>
                <li class="separator d-lg-none"></li>
              </ul>
            </div>
          </div>
        </nav>
        <div class="modal modal-search fade" id="searchModal" tabindex="-1" role="dialog" aria-labelledby="searchModal" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <input type="text" class="form-control" id="inlineFormInputGroup" placeholder="Wyszkuaj" data-resource="unms">
                <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                  <i class="tim-icons icon-simple-remove"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- End Navbar -->
        <div class="content">
          @yield('content')
        </div>
        <footer class="footer">
          <div class="container-fluid">
            <ul class="nav">
              <li class="nav-item">
                <a href="/dashboard" class="nav-link">
                  Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a href="/warehouse" class="nav-link">
                  Magazyn
                </a>
              </li>
              <li class="nav-item">
                <a href="/cars" class="nav-link">
                  Grupy
                </a>
              </li>
                <li class="nav-item">
                    <a href="/contractors" class="nav-link">
                        Kontrahenci
                    </a>
                </li>
            </ul>
            <div class="copyright">
              Copyright © 2018 - 2021 by <a href="https://geckonet.pl" target="_blank" rel="noreferrer">Geckonet</a>. Theme by <a href="javascript:void(0)" target="_blank">Creative Tim</a>, developed by <a href="https://geckonet.pl" target="_blank" rel="noreferrer">Geckonet</a>
            </div>
          </div>
        </footer>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="car/stock/own">
        <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <span class="pull-right">
                    <div class="row">
                        <div class="col">
                            <button class="btn btn-sm btn-primary btn-simple" style="margin-top: -30px; padding: 7px;" data-button-action="carsMove">Przekazanie sprzętu</button>
                        </div>
                        <div class="col">
                            <input type="text" class="form-control-search-modal" name="search" data-search="car/stock/own" placeholder="wyszukaj pordukt">
                        </div>
                    </div>
                </span>
                <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="card">
                    <div class="card-body">
                        <table class="table table-stripped" data-resource="car/stock/own">
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
                            <nav data-type="pagination" data-resource="car/stock/own">
                                <ul class="pagination">
                                </ul>
                            </nav>
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
    <div class="modal" tabindex="-1" role="dialog" data-element="data-show">
        <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Lista S/N i MAC produktu</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="card">
                    <div class="card-body">
                        <table class="table table-stripped table-sm">
                            <thead>
                                <th>Indeks</th>
                                <th>S/N</th>
                                <th>MAC</th>
                                <th>Cena (netto)</th>
                                <th>Data zakupu</th>
                                <th>Faktura</th>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="data-client-show">
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
                        <th>ID</th>
                        <th>Indeks</th>
                        <th>Producent</th>
                        <th>Model</th>
                        <th>Ilość</th>
                        <th>J.m.</th>
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
                <!-- <button type="button" class="btn btn-info action-print">Drukuj</button> -->
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="data-investment-show">
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
                        <strong>Inwestycja</strong>
                        <p class="investment ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 text-center mt-5 mb-5 doc-name">
                        <strong>Stan inwestycji: <span class="investment_name"></span></strong>
                    </div>
                </div>
                <table class="table table-stripped" data-resource="investment-clickable">
                    <thead>
                        <th>ID</th>
                        <th>Indeks</th>
                        <th>Producent</th>
                        <th>Model</th>
                        <th>Ilość</th>
                        <th>J.m.</th>
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
                        <strong>Data utworzenia inwestycji</strong>
                        <p class="date ml-2"></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-9 col-md-9 col-sm-9"></div>
                    <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                        <strong>Utworzył</strong>
                        <p class="user ml-2"></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer hidden-sm">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
                <button type="button" class="btn btn-info action-print">Drukuj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="carsMove">
        <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nowe przekazanie sprzętu</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="card">
                    <div class="card-body">
                        <form role="form" class="form-horizontal" data-element="carsMove">
                            <div class="row">
                                <div class="form-group has-label col-lg-4 col-md-4">
                                </div>
                                <div class="col-lg-4 col-md-4">
                                </div>
                                <div class="form-group has-label col-lg-4 col-md-4">
                                    <label>Użytkownik docelowy *</label>
                                    <select class="form-control" data-style="btn-default" name="user_id" data-live-search="true">
                                    </select>
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
                            <section data-element="carsMove">
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
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="carsMove">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
    <a id="back-to-top" href="javascript:void(0)" class="btn btn-primary btn-lg back-to-top" role="button" title="Przejdź do góry strony" data-toggle="tooltip" data-placement="left">
        <span class="fa fa-chevron-up"></span>
    </a>
    </div>

    <!--
    <div class="fixed-plugin">
        <div class="dropdown show-dropdown">
          <a href="#" data-toggle="dropdown" aria-expanded="true">
            <i class="fa fa-user-friends fa-2x"> </i>
          </a>
          <ul class="dropdown-menu" x-placement="bottom-start" style="position: absolute; transform: translate3d(-231px, 39px, 0px); top: 0px; left: 0px; will-change: transform;">
            <li class="header-title"> Lista pracowników</li>
            <li class="adjustments-line">
              <a href="javascript:void(0)" class="switch-trigger background-color">
                <div class="badge-colors text-center">
                  <span class="badge filter badge-primary active" data-color="primary"></span>
                  <span class="badge filter badge-info" data-color="blue"></span>
                  <span class="badge filter badge-success" data-color="green"></span>
                </div>
                <div class="clearfix"></div>
              </a>
            </li>
            <li class="adjustments-line text-center color-change">
              <span class="color-label">LIGHT MODE</span>
              <span class="badge light-badge mr-2"></span>
              <span class="badge dark-badge ml-2"></span>
              <span class="color-label">DARK MODE</span>
            </li>
            <li class="button-container">
              <a href="https://www.creative-tim.com/product/black-dashboard" target="_blank" class="btn btn-primary btn-block btn-round">Download Now</a>
              <a href="https://demos.creative-tim.com/black-dashboard/docs/1.0/getting-started/introduction.html" target="_blank" class="btn btn-default btn-block btn-round">
                Documentation
              </a>
            </li>
            <li class="header-title">Thank you for 95 shares!</li>
            <li class="button-container text-center">
              <button id="twitter" class="btn btn-round btn-info sharrre"><i class="fab fa-twitter"></i> · 45</button>
              <button id="facebook" class="btn btn-round btn-info sharrre"><i class="fab fa-facebook-f"></i> · 50</button>
              <br>
              <br>
              <a class="github-button" href="https://github.com/creativetimofficial/black-dashboard" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star ntkme/github-buttons on GitHub">Star</a>
            </li>
          </ul>
        </div>
    </div>
    -->

    <!--   Core JS Files   -->
    <script src="assets/js/core/jquery.min.js"></script>
    <script src="assets/js/jquery-ui.min.js"></script>
    <script src="assets/js/core/popper.min.js"></script>
    <script src="assets/js/core/bootstrap.min.js"></script>
    <script src="assets/js/cookies.js"></script>
    <script src="assets/js/plugins/moment.min.js"></script>
    <script src="assets/js/plugins/perfect-scrollbar.jquery.min.js"></script>
    <!--  Google Maps Plugin    -->
    <!-- Place this tag in your head or just before your close body tag. -->
    <!-- <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE"></script> -->
    <!-- Chart JS -->
    <script defer src="assets/js/plugins/chartjs.min.js"></script>
    <!--  Notifications Plugin    -->
    <script defer src="assets/js/plugins/bootstrap-notify.js"></script>
    <script defer src="assets/js/plugins/bootstrap-select.min.js"></script>
    <script defer src="assets/js/plugins/bootstrap-select.pl.min.js"></script>
    <script defer src="assets/js/plugins/bootstrap-switch.js"></script>
    <script defer src="assets/js/plugins/printThis.js"></script>
    <!-- Control Center for Black Dashboard: parallax effects, scripts for the example pages etc -->
    <script src="assets/js/black-dashboard.min.js?v=1.0.0"></script>
    <script defer src="assets/js/plugins/chosen.jquery.min.js"></script>
    <script defer src="assets/js/plugins/search.min.js"></script>
    <script defer src="assets/js/plugins/api.min.js"></script>
    <script defer src="assets/js/plugins/jquery.mask.min.js"></script>
    <script src="assets/js/plugins/pusher.min.js"></script>
    <script src="assets/js/plugins/echo.js"></script>
    <script src="{{ mix('assets/js/all.js') }}"></script>
    @yield('script')
    @if (getenv('APP_ENV') === 'local')
    <script async src="http://192.168.10.10:3000/browser-sync/browser-sync-client.js?v=2.26.7"></script>
    @endif
</body>
</html>
