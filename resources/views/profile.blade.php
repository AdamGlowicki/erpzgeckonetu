@extends('layouts.app')

@php ($title = __('profile.title'))

@section('style')
@endsection

@section('content')
<div class="content">
    <div class="row">
      <div class="col-md-8">
        <div class="card animated fadeIn hidden" data-section="profile">
          <div class="card-header">
            <h5 class="title">Edycja profilu</h5>
          </div>
          <div class="card-body">
            <form data-element="profile" role="form">
              <div class="row">
                <div class="col-md-6 pr-md-1">
                  <div class="form-group">
                    <label>Nazwa użytkownika *</label>
                    <input type="text" name="username" class="form-control" disabled="" value="">
                  </div>
                </div>
                <div class="col-md-6 pl-md-1">
                  <div class="form-group">
                    <label>Adres e-mail *</label>
                    <input type="email" name="email" class="form-control" placeholder="">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 pr-md-1">
                  <div class="form-group">
                    <label>Imię i nazwisko/Nazwa firmy *</label>
                    <input type="text" name="name" class="form-control" placeholder="" value="">
                  </div>
                </div>
                <div class="col-md-6 pl-md-1">
                  <div class="form-group">
                    <label>Numer telefonu</label>
                    <input type="text" name="phone" class="form-control" placeholder="np. +48123456789" value="">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label>Adres</label>
                    <input type="text" class="form-control" name="address" placeholder="" value="">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-2 pr-md-1">
                  <div class="form-group">
                    <label>Kod pocztowy</label>
                    <input type="text" class="form-control" name="postcode" placeholder="" value="">
                  </div>
                </div>
                <div class="col-md-5 px-md-1">
                  <div class="form-group">
                    <label>Miasto</label>
                    <input type="text" class="form-control" name="city" placeholder="" value="">
                  </div>
                </div>
                <div class="col-md-5 pl-md-1">
                  <div class="form-group">
                    <label>Kraj</label>
                    <select class="form-control selectpicker" name="country_id"></select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label>O mnie</label>
                    <textarea rows="4" class="form-control" name="desc" placeholder="Opisz siebie"></textarea>
                  </div>
                </div>
              </div>
                <div class="card-footer">
                  <button type="submit" class="btn btn-fill btn-primary">Zapisz</button>
                </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card card-user animated fadeIn hidden" data-section="profile">
          <div class="card-body">
            <p class="card-text">
              </p><div class="author">
                <div class="block block-one"></div>
                <div class="block block-two"></div>
                <div class="block block-three"></div>
                <div class="block block-four"></div>
                <a href="javascript:void(0)">
                  <img class="avatar" src="assets/img/anime3.png" alt="avatar" data-element="avatar">
                  <input type="file" class="d-none" data-element="avatar-upload">
                  <h5 class="title" data-element="name"></h5>
                </a>
                <p class="description" data-element="role">
                  Administrator aplikacji/Programista
                </p>
              </div>
            <p></p>
            <div class="card-description"></div>
          </div>
          <div class="card-footer">
              <!--
            <div class="button-container">
              <button href="javascript:void(0)" class="btn btn-icon btn-round btn-facebook">
                <i class="fab fa-facebook"></i>
              </button>
              <button href="javascript:void(0)" class="btn btn-icon btn-round btn-twitter">
                <i class="fab fa-twitter"></i>
              </button>
              <button href="javascript:void(0)" class="btn btn-icon btn-round btn-google">
                <i class="fab fa-google-plus"></i>
              </button>
            </div>
          </div>
          -->
        </div>
        <div class="card animated fadeIn hidden" data-section="profile">
          <div class="card-header">
            <h5 class="title">Zmiana hasła</h5>
          </div>
          <div class="card-body">
            <form data-element="password" role="form">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label>Nazwa użytkownika</label>
                    <input type="text" name="username" autocomplete="username email" class="form-control" value="" disabled="">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label>Aktualne hasło *</label>
                    <input type="password" name="password" autocomplete="current-password" class="form-control" value="">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label>Nowe hasło *</label>
                    <input type="password" autocomplete="new-password" name="password_new" class="form-control" value="" data-toggle="tooltip" title="Hasło musi zawierać min. 1 dużą literę, 1 cyfrę oraz mieć długość min. 8 znaków">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label>Powtórz nowe hasło *</label>
                    <input type="password" autocomplete="new-password" name="password_new_repeat" class="form-control" value="">
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <button type="submit" class="btn btn-fill btn-primary">Zapisz</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
</div>
@endsection

@section('script')
<script src="{{ Helpers::asset('assets/js/services/profile.js') }}"></script>
@endsection
