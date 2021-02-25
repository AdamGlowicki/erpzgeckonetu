var profile = function profile() {
    let resource = 'profile';

    get('profile', function(data) {
        $.each(data.data, function(key, value) {
            $('[name="' + key + '"]').val(value);
        });

        $('[data-element="role"]').html(data.data.role[0]);

        let datap = data;

        get('countries/all', function(data) {
            $('[name="country_id"]').empty();

            $.each(data, function(key, value) {
                $('[name="country_id"]').append(`<option value="${value.id}">${value.name}</option>`);
            });

            $('[name="country_id"] option[value="' + datap.data.country_id + '"]').prop('selected', true);

            $('.selectpicker').selectpicker('refresh');
        });

        $('[data-element="avatar"]').attr('src', storage + data.data.avatar);
        $('[data-element="name"]').html(data.data.name);

        onFirstLoad(resource);
    });
};

$(document).ready(function() {
    setTimeout(profile, 200);

    $('body').tooltip({ selector: '[data-toggle="tooltip"]', trigger: 'focus', placement: 'top' });

    // form post
    $('form[data-element="profile"]').on('submit', function(e) {
        e.preventDefault();

        let form = $(this);
        let resource = $(this).attr('data-element');
        let data = {
            email: $('[name="email"]', form).val(),
            name: $('[name="name"]', form).val(),
            phone: $('[name="phone"]', form).val(),
            address: $('[name="address"]', form).val(),
            postcode: $('[name="postcode"]', form).val(),
            city: $('[name="city"]', form).val(),
            country_id: $('[name="country_id"]', form).val(),
            desc: $('[name="desc"]', form).val()
        };

        put(resource, data, function(data) {
            notification.success('Profil został zapisany!');

            profile();
        }, function(data) {
            notification.error('Profil nie został zapisany, sprawdź wprowadzone dane.');
        });
    });

    $('form[data-element="password"]').on('submit', function(e) {
        e.preventDefault();

        let form = $(this);
        let resource = $(this).attr('data-element');
        let data = {
            username: $('[name="username"]', form).val(),
            password: $('[name="password"]', form).val(),
            password_new: $('[name="password_new"]', form).val(),
            password_new_repeat: $('[name="password_new_repeat"]', form).val()
        };

        put(resource, data, function(data) {
            notification.success('Hasło zostało zmienione!');

            setTimeout(function() {
                window.location.href = '/login';
            }, 500);
        }, function(data) {
            notification.error('Profil nie został zapisany, sprawdź wprowadzone dane.');
        });
    });

    $('[data-element="avatar"]').on('click', function() {
        $('[data-element="avatar-upload"]').trigger('click');
    });

    $('[data-element="avatar-upload"]').on('change', function() {
        let av = $(this).get(0).files[0];
        let data = new FormData();
        data.append('avatar', av);

        post('profile/avatar', data, function(data) {
            notification.success('Avatar został zaktualizowany!');

            profile();
            avatar();
        }, function(data) {
            notification.error('Avatar nie został zaktualizowany, dozwolone pliki to: .jpg, .png; max rozmiar pliku: 2MB');
        });
    });
});
