$(document).ready(function () {
    let inputPasswordOld = $('input[name="old_password"]');
    let inputPassword = $('input[name="password"]');
    let inputPasswordRepeat = $('input[name="password_repeat"]');
    let buttonSubmit = $('button[name="submit"]');

    let password = function password(old_password, password, password_repeat) {
        put('password', {
            password: old_password,
            password_new: password,
            password_new_repeat: password_repeat
        }, function(data) {
            window.location.href = '/dashboard';
        }, function(data) {
            $('div.text-danger').html('Hasło nie zostało zmienione, upewnij się czy podane hasłą są identyczne, czy spełnia ono wymogi bezpieczeństwa oraz czy nie zostało użyte w przeciągu ostatnich 6 miesięcy');
        });
    };

    $(buttonSubmit).on('click', function () {
        password($(inputPasswordOld).val(), $(inputPassword).val(), $(inputPasswordRepeat).val());
    });

    $(inputPassword).keypress(function (e) {
        if(e.which === 13) {
            $(buttonSubmit).trigger('click');
        }
    });

    $(inputPassword).on('keyup change', function(e) {
        let val = $(this).val();
        let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/]{8,}$/g;

        if(regex.test(val)) {
            $(this).parent().removeClass('form-control-invalid');
        } else {
            $(this).parent().addClass('form-control-invalid')
        }
    });
});
