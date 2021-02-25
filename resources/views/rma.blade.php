@extends('layouts.app')

@php ($title = __('rma.title'))

@section('style')
@endsection

@section('content')
<div class="content">
    <div class="row hidden" data-section="rma">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-tools"></i><span class="ml-2 mr-1">Zgłoszenia RMA</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                <input type="text" class="form-control-search" name="search" data-search="rma" placeholder="wyszukaj zgłoszenie">
                <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="rma"></i>
            </span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="rma">
                  <thead>
                    <th data-sortable="id">ID</th>
                    <th data-sortable="document_name">Dokument</th>
                    <th data-sortable="contractors.name">Kontrahent</th>
                    <th data-sortable="contractor_rma_id">RMA ID Kontrahenta</th>
                    <th data-sortable="warehouses_in.invoice_name">Faktura</th>
                    <th data-sortable="rmas_reasons.name">Powód</th>
                    <th data-sortable="rma_status">Status</th>
                    <th data-sortable="created_at">Data utworzenia</th>
                    <th>Zarządzanie</th>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="rma">
                        <ul class="pagination">
                        </ul>
                    </nav>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row hidden" data-section="rmas_reason">
      <div class="col-lg-12 col-md-12">
        <div class="card animated fadeIn">
          <div class="card-header">
            <h4 class="card-title"><i class="fa fa-list"></i><span class="ml-2 mr-1">Powody RMA</span><small>(strona nr: <span class="page-number">1</span>)</small><span class="pull-right">
                <input type="text" class="form-control-search" name="search" data-search="rmas_reason" placeholder="wyszukaj powód">
                <i class="tim-icons icon-simple-add action-add font-weight-bold hidden" data-element="rmas_reason"></i>
            </span></h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-stripped" data-resource="rmas_reason">
                  <thead>
                    <th data-sortable="id">ID</th>
                    <th data-sortable="name">Powód</th>
                    <th data-sortable="created_at">Data utworzenia</th>
                    <th>Zarządzanie</th>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
                <div class="pull-left" data-type="records"></div>
                <div class="pull-right">
                    <nav data-type="pagination" data-resource="rmas_reason">
                        <ul class="pagination">
                        </ul>
                    </nav>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" tabindex="-1" role="dialog" data-element="rma">
        <div class="modal-dialog modal-xlg animated fadeInUp" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nowe zgłoszenie RMA</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <form role="form" class="form-horizontal" data-element="rma">
                    <div class="card">
                        <div class="card-header">
                            <strong>1. Wyszukaj produkt po S/N lub MAC</strong>
                        </div>
                        <div class="card-body">
                                <section data-element="rma">
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
                                        <div class="col-lg-2 col-md-2 mt-2 ml-3 hidden">
                                            Data zakupu: <strong><span class="invoice_date"></span></strong>
                                        </div>
                                        <input type="hidden" name="item_id">
                                        <input type="hidden" name="item_data" value="[]">
                                        <input type="hidden" name="warehouses_in_id">
                                        <input type="hidden" name="contractor_id">
                                        <input type="hidden" name="has_data">
                                    </div>
                                    <div class="row">&nbsp;</div>
                                </section>
                                <div class="row">
                                    <div class="form-group has-label col-lg-4 col-md-4">
                                    </div>
                                    <div class="col-lg-4 col-md-4">
                                    </div>
                                    <div class="col-lg-4 col-md-4">
                                    </div>
                                </div>
                            <div class="form-category">Produkt należy wyszukać po numerze seryjnym lub adresie MAC, można użyć ostatnich cyfr S/N lub MAC</div>
                        </div>
                    </div>

                    <div class="card hidden">
                        <div class="card-header">
                            <strong>2. Wybierz odbiorcę wysyłki reklamacyjnej (jeśli jest inny niż z danych faktury)</strong>
                        </div>
                        <div class="card-body">
                            <section data-element="rma">
                                <div class="form-row mb-1">
                                    <div class="col-lg-1 col-md-1">
                                    </div>
                                    <div class="col-lg-3 col-md-3">
                                        <select class="form-control" name="contractor_id" data-live-search="true">
                                        </select>
                                    </div>
                                </div>
                                <div class="row">&nbsp;</div>
                            </section>
                            <div class="row">
                                <div class="form-group has-label col-lg-4 col-md-4">
                                </div>
                                <div class="col-lg-4 col-md-4">
                                </div>
                                <div class="col-lg-4 col-md-4">
                                </div>
                            </div>
                            <div class="form-category">System automatycznie wyszukał dostawcę po przyjęciu zewnętrznym. Jeśli pojawił się komunikat o braku PZ lub wysyłasz pod inny adres - dodaj nowego kontrahenta lub wybierz go z listy</div>
                        </div>
                    </div>

                    <div class="card hidden">
                        <div class="card-header">
                            <strong>3. Wybierz powód reklamacji</strong>
                        </div>
                        <div class="card-body">
                            <section data-element="rma">
                                <div class="form-row mb-1">
                                    <div class="col-lg-1 col-md-1">
                                    </div>
                                    <div class="col-lg-2 col-md-2">
                                        <select class="form-control" name="rmas_reason_id">
                                        </select>
                                    </div>
                                </div>
                                <div class="row">&nbsp;</div>
                            </section>
                            <div class="row">
                                <div class="form-group has-label col-lg-4 col-md-4">
                                </div>
                                <div class="col-lg-4 col-md-4">
                                </div>
                                <div class="col-lg-4 col-md-4">
                                </div>
                            </div>
                            <div class="form-category">Powód reklamacji jest wymagany aby umieścić go na zgłoszeniu</div>
                        </div>
                    </div>

                    <div class="card hidden">
                        <div class="card-header">
                            <strong>4. Podaj RMA ID kontrahenta</strong>
                        </div>
                        <div class="card-body">
                            <section data-element="rma">
                                <div class="form-row mb-1">
                                    <div class="col-lg-1 col-md-1">
                                    </div>
                                    <div class="col-lg-2 col-md-2">
                                        <input type="text" class="form-control" name="contractor_rma_id">
                                    </div>
                                </div>
                                <div class="row">&nbsp;</div>
                            </section>
                            <div class="row">
                                <div class="form-group has-label col-lg-4 col-md-4">
                                </div>
                                <div class="col-lg-4 col-md-4">
                                </div>
                                <div class="col-lg-4 col-md-4">
                                </div>
                            </div>
                            <div class="form-category">Podaj ewentualny RMA ID stworzony przez kontrahenta</div>
                        </div>
                    </div>

                    <div class="card hidden">
                        <div class="card-header">
                            <strong>5. Wpisz dodatkowe uwagi dotyczące reklamacji</strong>
                        </div>
                        <div class="card-body">
                            <section data-element="rma">
                                <div class="form-row mb-1">
                                    <div class="col-lg-1 col-md-1">
                                    </div>
                                    <div class="col-lg-2 col-md-2">
                                        <textarea class="form-control" name="note" placeholder="notatki"></textarea>
                                    </div>
                                </div>
                                <div class="row">&nbsp;</div>
                            </section>
                            <div class="row">
                                <div class="form-group has-label col-lg-4 col-md-4">
                                </div>
                                <div class="col-lg-4 col-md-4">
                                </div>
                                <div class="col-lg-4 col-md-4">
                                </div>
                            </div>
                            <div class="form-category">Dodatkowe informacje dotyczące uszkodzenia, sposobu rozpatrzenia reklamacji etc.</div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="rma">Dodaj</button>
            </div>
          </div>
        </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" data-element="rmas_reason">
        <div class="modal-dialog animated fadeInUp" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Dodawanie powodu zgłoszenia</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="card animated fadeIn">
                    <div class="card-body">
                        <form role="form" class="form-horizontal" data-element="rmas_reason">
                            <div class="form-group has-label">
                                <label>Powód *</label>
                                <input class="form-control" name="name" type="text" minlength="1">
                            </div>
                        </form>
                        <div class="category form-category">* Pola wymagane</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="rmas_reason">Dodaj</button>
            </div>
          </div>
        </div>
    </div>

    <div class="modal" tabindex="-1" role="dialog" data-element="rma-clickable">
        <div class="modal-dialog modal-xlg animated fadeInUp" role="document">
            <div class="modal-content">
                <div class="modal-header hidden-sm">
                    <h5 class="modal-title"><i class="fa fa-tools"></i>&nbsp; <span class="modal-title-text"></span></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-lg-4 col-md-4 col-sm-4">
                                    <img src="assets/img/logo.png" alt="">
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4">
                                    <strong>Kontrahent/Dostawca</strong>
                                    <p class="contractor ml-2"></p>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4">
                                    <strong>Faktura</strong>
                                    <p class="warehouses_in ml-2"></p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col text-center mt-5 mb-5">
                                    <table class="table">
                                        <thead>
                                            <th>Indeks</th>
                                            <th>Produkt</th>
                                            <th>S/N</th>
                                            <th>MAC</th>
                                            <th>Ilość</th>
                                            <th>J.m.</th>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="row mb-2 mr-2">
                                <form role="form" class="form-horizontal col-12 ml-3" data-element="rma">
                                    <div class="row">
                                        <div class="col-6">
                                            <div class="form-group has-label">
                                                <label>Powód zgłoszenia</label>
                                                <input class="form-control" name="reason" type="text" readonly>
                                            </div>
                                            <div class="form-group has-label">
                                                <label>Status</label>
                                                <select class="form-control selectpicker" data-style="btn-primary" name="rma_status">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-group has-label">
                                                <label>Data wysyłki</label>
                                                <input class="form-control" name="sent_at" type="text" readonly>
                                            </div>
                                            <div class="form-group has-label">
                                                <label>Data zwrotu</label>
                                                <input class="form-control" name="received_at" type="text" readonly>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row hidden" data-element="status-closed">
                                        <div class="col-6">
                                            <div class="form-group has-label">
                                                <label>Powód zamknięcia</label>
                                                <select class="form-control selectpicker" data-style="btn-primary" name="end_status">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="row hidden" data-element="end-status-data">
                                                <div class="col">
                                                    <div class="form-group has-label">
                                                        <label>S/N</label>
                                                        <input class="form-control" name="sn" type="text">
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="form-group has-label">
                                                        <label>MAC</label>
                                                        <input class="form-control" name="mac" type="text">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row hidden" data-element="end-status-invoice">
                                                <div class="col">
                                                    <div class="form-group has-label">
                                                        <label>Numer korekty</label>
                                                        <input class="form-control" name="new_invoice" type="text">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row hidden" data-element="end-status-warehouse">
                                        <div class="col">
                                            <div class="form-group has-label">
                                                <label>Magazyn zwrotu</label>
                                                <select class="form-control selectpicker" data-style="btn-primary" name="warehouse_id">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col">
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-12">
                                            <div class="form-group has-label">
                                                <label>Notatki</label>
                                                <textarea class="form-control" name="note"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer hidden-sm">
                    <div class="pull-left">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
                    </div>
                    <div class="pull-right">
                        <button type="button" class="btn btn-primary" data-action="submit" data-type="edit" data-form="rma">Zapisz</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('script')
<script src="{{ Helpers::asset('assets/js/services/rma.js') }}"></script>
@endsection
