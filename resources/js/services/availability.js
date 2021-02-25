let rodzGm = function rodzGm(val) {
    switch(val) {
        case 1:
            return 'gmina miejska';
        case 2:
            return 'gmina wiejska';
        case 3:
            return 'gmina miejsko-wiejska';
        case 4:
            return 'miasto w gminie miejsko-wiejskiej';
        case 5:
            return 'obszar wiejski w gminie miejsko-wiejskiej';
        case 8:
            return 'dzielnica m. st. Warszawy';
        case 9:
            return 'delegatura miasta';
    }
};

var search = function search(resource) {
    switch(resource) {
        case 'availability':
            let form = $('form[data-element="' + resource + '"]');

            let city = $(form).find('[name="city"]').parent();
            let street = $(form).find('[name="street"]').parent();

            $(city).search({
                apiSettings: {
                    url: api + 'services/search/{query}',
                    saveRemoteData: true,
                    cache: false,
                    beforeXHR: function(request) {
                        request.setRequestHeader('Accept', 'application/json');
                        request.setRequestHeader('Content-Type', 'application/json');
                        request.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('apiToken'));
                    },
                    onResponse: function(response) {
                        var convertedResponse = {
                            results : []
                        };

                        $.each(response, function(index, item) {
                            convertedResponse.results.push({
                                title       : '<strong>' + item.NAZWA + '</strong>',
                                description : `woj. <span class="font-weight-bold">${item.woj.NAZWA}</span>, pow. <span class="font-weight-bold">${item.pow.NAZWA}</span>, gm. <span class="font-weight-bold">${item.gmi.NAZWA}</span> (${rodzGm(item.RODZ_GMI)})`,
                                cityId      : item.SYM
                            });
                        });

                        return convertedResponse;
                    }
                },
                minCharacters: 2,
                maxResults: 250,
                cache: true,
                onSelect: function(result) {
                    $('input[name="cityId"]', form).val(result.cityId);

                    $('input[name="no_street"]', form).prop('disabled', false);
                    $('input[name="no_street"]', form).closest('.bootstrap-switch-disabled').removeClass('bootstrap-switch-disabled');

                    $('input[name="street"]', form).val(null);
                    $('input[name="building_num"]', form).val(null);

                    $('input[name="street"]', form).prop('disabled', false);
                    $('input[name="street"]', form).focus();
                }
            });

            $(street).search({
                apiSettings: {
                    url: api + 'services/search/local/{query}',
                    saveRemoteData: true,
                    beforeXHR: function(request) {
                        request.setRequestHeader('Accept', 'application/json');
                        request.setRequestHeader('Content-Type', 'application/json');
                        request.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('apiToken'));
                    },
                    beforeSend: function(settings) {
                        settings.url = api + 'services/search/local/' + $(this).closest('form').find('input[name="cityId"]').val() + '/{query}';

                        return settings;
                    },
                    onResponse: function(response) {
                        var convertedResponse = {
                            results : []
                        };

                        $.each(response, function(index, item) {
                            convertedResponse.results.push({
                                title       : '<strong>' + item.NAZWA_1 + '</strong>',
                                description : item.NAZWA_2 ? item.NAZWA_2 : '',
                                ulicId      : item.SYM_UL
                            });
                        });

                        return convertedResponse;
                    }
                },
                minCharacters: 2,
                maxResults: 50,
                cache: false,
                onSelect: function(result) {
                    $('input[name="ulicId"]', form).val(result.ulicId);

                    $('input[name="street"]', form).prop('disabled', false);

                    $('input[name="building_num"]', form).prop('disabled', false);
                }
            });

            break;
    }
};

$(document).ready(function() {
    $('li[data-route="availability"]').addClass('active');

    onFirstLoad('availability');
    search('availability');

    $('body').tooltip({ selector: '[data-toggle="tooltip"]', trigger: 'hover', placement: 'bottom' });

    let form = $('form[data-element="availability"]');

    $('input[name="no_street"]', form).on('switchChange.bootstrapSwitch', function(e) {
        if(e.target.checked) {
            $('input[name="street"]', form).prop('disabled', true);
        } else {
            $('input[name="street"]', form).prop('disabled', false);
        }
    });

    $('input[name="building_num"]', form).on('keyup', function(e) {
        if($(this).val().length > 0) {
            $('button[data-action="submit"]', form).prop('disabled', false);
        } else {
            $('button[data-action="submit"]', form).prop('disabled', true);
        }
    });

    $('[data-action="submit"]', form).on('click', function(e) {
        e.preventDefault();

        let city = $('input[name="cityId"]', form).val();
        let street = $('input[name="ulicId"]', form).val();
        let buildingNumber = $('input[name="building_num"]', form).val();

        get(`services/${city}/${street}/${buildingNumber}`, function(response) {
            if(Object.keys(response).length === 0) {
                alert('Brak danych w bazie Netstork');

                $(element).hide();

                return;
            }

            let element = $('[data-resource="availability"]');

            $('[data-value="city"]', element).html(response[0].address.city);
            $('[data-value="commune"]', element).html(response[0].address.commune);
            $('[data-value="street"]', element).html(response[0].address.street);
            $('[data-value="building_number"]', element).html(response[0].building_number);
            $('[data-value="notes"]', element).html(response[0].notes ? response[0].notes : 'brak notatki');

            $('[data-value="building_status"]', element).html(response[0].building_status ? response[0].building_status.value : 'brak danych');
            $('[data-value="building_technology"]', element).html(response[0].building_technology ? response[0].building_technology.value : 'brak danych');
            $('[data-value="building_type"]', element).html(response[0].building_type ? response[0].building_type.value : 'brak danych');
            $('[data-value="node_name"]', element).html(response[0].node_name ? response[0].node_name : 'brak danych');
            $('[data-value="dp_name"]', element).html(response[0].dp_name ? response[0].dp_name : 'brak danych');

            let pointRegex = /POINT\s\((.*)\s(.*)\)/;
            let pointMatch = (response[0].location).match(pointRegex);

            let loc = {
                lat: parseFloat(pointMatch[2]),
                lng: parseFloat(pointMatch[1]),
            }

            let map = new google.maps.Map($('.map')[0], { zoom: 16, center: loc });

            let marker = new google.maps.Marker({
                position: { lat: loc.lat, lng: loc.lng },
                map: map,
                animation: google.maps.Animation.DROP,
            });

            $(element).show();
        });
    })
});
