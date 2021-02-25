$(document).ready(function () {
    let inputUsername = $('input[name="username"]');
    let inputPassword = $('input[name="password"]');
    let buttonSubmit = $('button[name="submit"]');
    let checkboxRememberMe = $('input[name="rememberMe"]');

    let login = function login(username, password, rememberMe) {
        post('login', {
            username: username,
            password: password
        }, function(data) {
            Cookies.set('apiToken', data.data.api_token, { expires: 1/24 });
            Cookies.set('userId', data.data.id, { expires: 1/24 });

            window.location.href = '/dashboard';
        }, function(data) {
            $('.text-danger').empty();

            if(data.status === 429) {
                $('.text-danger').append('<br>Zbyt wiele prób logowania, odczekaj minutę');
                return;
            }

            $.each(data.responseJSON, function(key, value) {
                if($.isPlainObject(value)) {
                    $.each(value, function(key, value) {
                        $('.text-danger').append('<br>' + value);
                    });
                } else {
                    // $('.alert-danger').append('<br>' + value);
                }
            });
        });
    };

    $(buttonSubmit).on('click', function () {
        login($(inputUsername).val(), $(inputPassword).val(), $(checkboxRememberMe).val());
    });

    $(inputPassword).keypress(function (e) {
        if(e.which === 13) {
            $(buttonSubmit).trigger('click');
        }
    });
});
