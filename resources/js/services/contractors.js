let contractor = function contractor(page = false, callbackSuccess = false, callbackError = false, sortBy = [], search = false) {
    let resource = 'contractor';
    let sortable = Object.keys(sortBy).length > 0;
    let params;

    if(page !== false) {
        params = '?page=' + page + (search !== false ? '&q=' + search : '');
    } else {
        params = '/all' + (search !== false ? '?q=' + search : '');
    }

    let url = resource + (sortable ? '/sort/' + sortBy[0] + '/' + sortBy[1] : '') + params;

    get(url, function(data) {
        if(callbackSuccess !== false) {
            callbackSuccess(data);
            return;
        }

        let table = $(`table[data-resource="${resource}"]`);

        $('tbody', table).empty();

        if(!(Object.keys(data.data).length > 0)) {
            let ths = $('thead', table).find('th');
            let span = Object.keys(ths).length;

            let row = `<tr><td class="text-center" colspan="${span}">Brak wyników</td></tr>`;

            $('tbody', table).append(row);
        } else {
            $.each(data.data, function(key, value) {
                let row = `<tr data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.name}</td>
                    <td>${value.nip}</td>
                    <td>${value.street}</td>
                    <td>${value.postcode}</td>
                    <td>${value.city}</td>
                    <td>${value.country.code}</td>
                    <td>
                        <i class="tim-icons icon-pencil action-edit font-weight-bold"></i>
                        <i class="tim-icons icon-simple-remove action-remove font-weight-bold"></i>
                    </td>
                </tr>`;

                $('tbody', table).append(row);
            });
        }

        sort(resource, sortBy);
        pagination(resource, data);
        onFirstLoad(resource);
    }, function(jqXHR) {
        switch(jqXHR.status) {
            case 403:
                $('div[data-section="' + resource + '"]').hide();
                break;
            default:
                notification.error('Nie udało się pobrać danych: ' + resource);
                break;
        }
    });
};

let countries = function countries(page = false, callbackSuccess = false, callbackError = false) {
    let resource = 'countries';
    let url = resource + (page !== false ? '?page=' + page : '/all');

    get(url, function(data) {
        if(callbackSuccess !== false) {
            callbackSuccess(data);
        }
    }, function(data) {
        notification.error('Nie udało się pobrać danych: ' + resource);
    });
};

$(document).ready(function() {
    // print action
    $('.action-print').on('click', function() {
        let title = $(this).closest('.modal').find('.doc-name').text();

        $(this).closest('.modal').printThis({
            debug: true,
            pageTitle: title,
            header: '<style>table, td, th, tr, thead, tbody { color: #7c7c7c !important; } .table { color: #7c7c7c; } .table-stripped { color: #7c7c7c; }</style>'
        });
    });

    // add element
    $('.action-add').on('click', function() {
        let resource = $(this).attr('data-element');
        let modal = $(`div[data-element="${resource}"]`);

        let title = $('.modal-title', modal);
        let submitBtn = $('.modal-footer > button[data-type]', modal);

        related = $(this).closest('.modal').attr('data-element');

        switch(resource) {
            case 'contractor':
                $(title).html('Dodawanie kontrahenta');

                countries(false, function(data) {
                    let select = $('select[name="country_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $('option[value="167"]', select).prop('selected', true);

                    $(select).selectpicker('refresh');
                });

                break;
        }

        $(submitBtn).attr('data-type', 'add');
        $(submitBtn).html('Dodaj');

        if(!($(modal).data('bs.modal') || {})._isShown) {
            $(modal).modal({
                backdrop: 'static'
            });

            $(modal).find('input[type="text"]')[0].focus();
        }
    });

    // edit element
    $(document).on('click', '.action-edit', function() {
        let element = $(this).closest('table').attr('data-resource');
        let id = $(this).closest('tr').attr('data-element-id');
        let modal = $(`div[data-element="${element}"]`);

        let title = $('.modal-title', modal);
        let submitBtn = $('.modal-footer > button[data-type]', modal);

        editable_id = id;

        switch(element) {
            case 'contractor':
                $(title).html('Edycja kontrahenta');

                countries(false, function(data) {
                    let select = $('select[name="country_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $('option[value="167"]', select).prop('selected', true);

                    $(select).selectpicker('refresh');
                });

                get(`contractor/edit/${id}`, function(data) {
                    $('[name="type"]', modal).find('option[value="' + data.type + '"]').prop('selected', true);
                    $('[name="name"]', modal).val(data.name);
                    $('[name="nip"]', modal).val(data.nip);
                    $('[name="street"]', modal).val(data.street);
                    $('[name="postcode"]', modal).val(data.postcode);
                    $('[name="city"]', modal).val(data.city);
                    $('[name="country_id"]', modal).find('option[value="' + data.country_id + '"]').prop('selected', true);
                    $('[name="bacc_iban"]', modal).val(data.bacc_iban);
                    $('[name="bacc_swift"]', modal).val(data.bacc_swift);

                    $('.selectpicker', modal).selectpicker('refresh');
                });

                break;
        }

        $(submitBtn).attr('data-type', 'edit');
        $(submitBtn).html('Zapisz');

        $(modal).modal();
    });

    // remove element
    $(document).on('click', '.action-remove', function() {
        let resource = $(this).closest('table').attr('data-resource');
        let element = $(this).closest('tr').attr('data-element-id');

        del(resource, element, function(data) {
            notification.success('Element został usunięty');

            refetch(resource);
        }, function(data) {
            notification.error('Nie można usunąć elementu, ponieważ posiada inne przypisane elementy lub nie istnieje.');
        });
    });

    // row actions
    $('section').on('click', '.action-remove-row', function() {
        $(this).closest('.form-row').remove();
    });

    // form POST
    $('form[data-element]').on('submit', function(e) {
        e.preventDefault();

        let form = $(this);
        let modal = $(this).closest('.modal');
        let resource = $(this).attr('data-element');
        let type = $(form).closest('.modal-content').find('button[data-action="submit"]').attr('data-type');

        switch(type) {
            case 'add':
                switch(resource) {
                    case 'contractor':
                        post(resource, {
                            country_id: $('select[name="country_id"] option:selected', $(this)).val(),
                            name: $('input[name="name"]', $(this)).val(),
                            postcode: $('input[name="postcode"]', $(this)).val(),
                            street: $('input[name="street"]', $(this)).val(),
                            city: $('input[name="city"]', $(this)).val(),
                            bacc_iban: $('input[name="bacc_iban"]', $(this)).val(),
                            bacc_swift: $('input[name="bacc_swift"]', $(this)).val(),
                            nip: $('input[name="nip"]', $(this)).val(),
                            type: $('select[name="type"] option:selected', $(this)).val()
                        }, function(data) {
                            notification.success('Kontrahent został dodany!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');
                            $(form)[0].reset();

                            refetch(resource);
                        }, function(data) {
                            notification.error('Kontrahent nie został dodany, sprawdź wprowadzone dane.');
                        });

                        break;
                }

                break;
            case 'edit':
                switch(resource) {
                    case 'contractor':
                        put(resource + '/' + editable_id, {
                            country_id: $('select[name="country_id"] option:selected', $(this)).val(),
                            name: $('input[name="name"]', $(this)).val(),
                            postcode: $('input[name="postcode"]', $(this)).val(),
                            street: $('input[name="street"]', $(this)).val(),
                            city: $('input[name="city"]', $(this)).val(),
                            bacc_iban: $('input[name="bacc_iban"]', $(this)).val(),
                            bacc_swift: $('input[name="bacc_swift"]', $(this)).val(),
                            nip: $('input[name="nip"]', $(this)).val(),
                            type: $('select[name="type"] option:selected', $(this)).val()
                        }, function(data) {
                            notification.success('Kontrahent został zaktualizowany!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');
                            $(form)[0].reset();

                            refetch(resource);
                        }, function(data) {
                            notification.error('Kontrahent nie został zaktualizowany, sprawdź wprowadzone dane.');
                        });

                        break;
                }

                break;
        }
    });

    $('button[data-action="submit"]').on('click', function() {
        $('form[data-element="' + $(this).attr('data-form') + '"]').submit();
    });
});
