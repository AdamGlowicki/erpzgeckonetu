<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="GeckoNET">
    <title>{{ config('app.name') }} / Zmiana hasła</title>
    <link href="assets/img/favicon.png" rel="icon" type="image/png">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
    <link href="assets/vendor/nucleo/css/nucleo.css" rel="stylesheet">
    <link  href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" rel="stylesheet" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous"><link href="assets/css/nucleo-icons.css" rel="stylesheet">
    <link type="text/css" href="assets/css/argon.css?v=1.0.0" rel="stylesheet">
</head>
<body class="bg-default">
<div class="main-content">
    <!-- Header -->
    <div class="header bg-gradient-primary py-6 py-lg-7">
        <div class="container">
            <div class="header-body text-center mb-9">
                <div class="row justify-content-center">
                    <div class="col-lg-5 col-md-6">
                    </div>
                </div>
            </div>
        </div>
        <div class="separator separator-bottom separator-skew zindex-100">
            <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
            </svg>
        </div>
    </div>
    <!-- Page content -->
    <div class="container mt--10">
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="card bg-secondary shadow border-0">
                    <div class="card-header bg-transparent pb-5">
                        <div class="text-muted text-center mt-3">
                            <img class="img-fluid" src="assets/img/logo_erp.png" alt="">
                        </div>
                    </div>
                    <div class="card-body px-lg-4 py-lg-4">
                        <div class="text-center text-muted mb-4">
                            <small>Wymagana jest zmiana hasła</small>
                            <div class="row h5 text-danger mt-2"></div>
                        </div>
                        <form role="form" name="change-password">
                            <div class="form-group mb-3">
                                <div class="input-group input-group-alternative">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="ni ni-lock-circle-open"></i></span>
                                    </div>
                                    <input class="form-control" placeholder="Stare hasło" type="password" name="old_password" autocomplete="old-password">
                                </div>
                            </div>
                            <div class="form-group mb-3">
                                <div class="input-group input-group-alternative">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="ni ni-lock-circle-open"></i></span>
                                    </div>
                                    <input class="form-control" placeholder="Nowe hasło" type="password" name="password" autocomplete="new-password" data-toggle="tooltip" data-html="true" data-placement="right" title="min. 8 znaków,<br>min. 1 mała litera,<br>min. 1 duża litera,<br>min. 1 znak specjalny (!@#$%^&*()_+-=[]\{};:'&quot;|,.<>/)">
                                </div>
                            </div>
                            <div class="form-group mb-3">
                                <div class="input-group input-group-alternative">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="ni ni-lock-circle-open"></i></span>
                                    </div>
                                    <input class="form-control" placeholder="Powtórz hasło" type="password" name="password_repeat" autocomplete="new-password">
                                </div>
                            </div>
                            <!-- <div class="custom-control custom-control-alternative custom-checkbox">
                              <input class="custom-control-input" id="rememberMe" name="rememberMe" type="checkbox">
                              <label class="custom-control-label" for="rememberMe">
                                <span class="text-muted">Zapamiętaj mnie</span>
                              </label>
                            </div> -->
                            <div class="text-center">
                                <button type="button" name="submit" class="btn btn-primary my-4">Zmień hasło</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="assets/vendor/jquery/dist/jquery.min.js"></script>
<script src="assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
<script src="assets/js/argon.js?v=1.0.0"></script>
<script src="assets/js/cookies.js"></script>
<script src="{{ mix('assets/js/auth/password.js') }}"></script>
</body>
</html>
