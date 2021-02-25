@extends('layouts.app')

@php ($title = __('availability.title'))

@section('style')
    <style>
        .map {
            max-height: 350px;
            width: 100%;
        }
    </style>
@endsection

@section('content')
<div class="content">
    <div class="row hidden" data-section="availability">
      <div class="col-lg-12 col-md-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Sprawdzanie dostępności usług</h4>
          </div>
          <div class="card-body">
            <form role="form" class="form-horizontal" data-element="availability">
                <div class="row">
                    <div class="form-group col-md-3">
                        <div class="ui search">
                            <input class="form-control prompt" name="city" type="text" placeholder="Podaj miejscowość">
                        </div>
                    </div>
                    <div class="form-group col-md-5">
                        <div class="ui search">
                            <input class="form-control prompt" name="street" type="text" placeholder="Podaj ulicę" disabled>
                        </div>
                    </div>
                    <div class="form-group col-md-1 mt-1">
                        <span class="d-inline-block" data-toggle="tooltip" title="W mojej miejscowości nie ma ulicy">
                            <input class="bootstrap-switch" name="no_street" type="checkbox" value="true" data-on-label="<i class='tim-icons icon-check-2'></i>" data-off-label="<i class='tim-icons icon-simple-remove'></i>">
                        </span>
                    </div>
                    <!-- <div id="locationField" class="form-group">
                        <input class="form-control" id="autocomplete" placeholder="ulica, nr budynku, miejscowość" type="text">
                    </div> -->
                    <div class="col-md-1">
                        <div class="row">
                            <div class="form-group col-md-12">
                                <div class="ui search">
                                    <input class="form-control prompt" name="building_num" type="text" placeholder="Nr budynku" disabled>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group col-md-2">
                        <button type="button" class="btn btn-primary" style="margin-top: -1px;" data-action="submit" data-type="search" data-form="availability" disabled>Sprawdź</button>
                    </div>
                    <input type="hidden" name="cityId">
                    <input type="hidden" name="ulicId">
                </div>
            </form>
          </div>
        </div>
        <div class="card hidden mb-0" data-resource="availability">
              <div class="card-header">
                  <h4 class="card-title">Informacje o lokalizacji</h4>
              </div>
              <div class="card-body">
                  <div class="row">
                      <div class="col">
                          <table class="table table-stripped">
                              <tbody>
                                      <tr>
                                          <th scope="row">Miejscowość</th>
                                          <td data-value="city"></td>
                                      </tr>
                                      <tr>
                                          <th scope="row">Gmina</th>
                                          <td data-value="commune"></td>
                                      </tr>
                                      <tr>
                                            <th scope="row">Ulica</th>
                                            <td data-value="street"></td>
                                      </tr>
                                        <tr>
                                            <th scope="row">Nr budynku</th>
                                            <td data-value="building_number"></td>
                                        </tr>
                                      <tr>
                                          <th scope="row">Notatka</th>
                                          <td data-value="notes"></td>
                                      </tr>
                              </tbody>
                          </table>
                      </div>
                      <div class="col">
                          <table class="table table-stripped">
                              <tbody>
                                  <tr>
                                      <th scope="row">Status budynku</th>
                                      <td data-value="building_status"></td>
                                  </tr>
                                  <tr>
                                      <th scope="row">Technologia</th>
                                      <td data-value="building_technology"></td>
                                  </tr>
                                  <tr>
                                      <th scope="row">Typ budynku</th>
                                      <td data-value="building_type"></td>
                                  </tr>
                                  <tr>
                                      <th scope="row">Węzeł sieci dostępowej</th>
                                      <td data-value="node_name"></td>
                                  </tr>
                                  <tr>
                                      <th scope="row">Punkt dystrybucji</th>
                                      <td data-value="dp_name"></td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
                  <div class="row">
                      <div class="col">
                          <div class="map"></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
</div>
@endsection

@section('script')
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBC1EAoKhRVHYP-vf_7Jpi6R2yysHmeSHY"></script>
<script src="{{ Helpers::asset('assets/js/services/availability.js') }}"></script>
@endsection
