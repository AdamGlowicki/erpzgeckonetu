let car = function car(page = false, callbackSuccess = false, callbackError = false, sortBy = ['desc', 'id'], search = false) {
    let resource = 'car';
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
            noResults(table);
        } else {
            $.each(data.data, function(key, value) {
                let serviceDate = 'n/a';

                if(value.service_date) {
                    let target = moment(value.service_date, 'YYYY-MM-DD').add(365, 'days');
                    let targetWarning = moment(value.service_date, 'YYYY-MM-DD').add(358, 'days');

                    if(moment().isBefore(targetWarning)) {
                        serviceDate = `<span class="text-primary">${value.service_date}</span>`;
                    }

                    if(moment().isAfter(targetWarning) && moment().isBefore(target)) {
                        serviceDate = `<span class="text-warning">${value.service_date} (wymagany przegląd!)</span>`;
                    }

                    if(moment().isAfter(target)) {
                        serviceDate = `<span class="text-danger">${value.service_date} (termin minął!)</span>`;
                    }
                }

                let row = `<tr data-element-id="${value.id}" class="clickable">
                                    <td>${value.id}</td>
                                    <td>${value.name}</td>
                                    <td>${value.registration}</td>
                                    <td>${serviceDate}</td>
                                    <td>
                                        <i class="tim-icons icon-pencil action-edit font-weight-bold"></i>
                                        <i class="tim-icons icon-simple-remove action-remove font-weight-bold"></i>
                                        <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
                                    </td>
                                </tr>`;

                $('tbody', table).append(row);

                if(Object.keys(value.cars_user).length > 0) {
                    let el = '<tr><td></td><td colspan="4">';

                    $.each(value.cars_user, function(k, v) {
                        el = el + '<span class="mr-4">' + (userAvatar(v.user) + v.user.name + '</span>');
                    });

                    el = el + '</td></tr>';

                    $('tbody', table).append(el);
                }
            });
        }

        sort(resource, sortBy);
        pagination(resource, data);
        onFirstLoad(resource);
    });
};

let user = function user(page = false, callbackSuccess = false, callbackError = false) {
    let resource = 'user';
    let url = resource + (page !== false ? '?page=' + page : '/all');

    get('user/cars/all', function(data) {
        if(callbackSuccess !== false) {
            callbackSuccess(data);
        }
    });
};

$(document).ready(function() {
    // set menu entry as active
    $('li[data-route="cars"]').addClass('active');

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
        let element = $(this).attr('data-element');
        let modal = $(this).closest('div[data-element="' + element + '"]');

        let title = $('.modal-title', modal);
        let submitBtn = $('.modal-footer > button[data-type]');

        switch(element) {
            case 'car':
                $(title).html('Dodawanie samochodu');

                user(false, function(data) {
                    let select = $('select[name="user_id"]');

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append('<option value="' + value.id + '">' + value.name + '</option>');
                    });

                    $(select).trigger('chosen:updated');
                });

                break;
        }

        $(submitBtn).attr('data-type', 'add');
        $(submitBtn).html('Dodaj');
        $('div[data-element="' + $(this).attr('data-element') + '"]').modal('show');
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
            case 'car':
                $(title).html('Edycja samochodu');

                get('car/edit/' + id, function(data) {
                    $('[name="name"]', modal).val(data.name);
                    $('[name="registration"]', modal).val(data.registration);
                    $('[name="service_date"]', modal).val(data.service_date);
                    $('[name="locked"]', modal).prop('checked', !!data.locked);

                    let select = $('[name="user_id"]', modal);

                    $(select).empty();

                    $.each(data.cars_user, function(k, v) {
                        $(select, modal).append('<option value="' + v.user.id + '" selected>' + v.user.name + '</option>');
                    });

                    user(false, function(data) {
                        $.each(data, function(k, v) {
                            $(select, modal).append('<option value="' + v.id + '">' + v.name + '</option>');
                        });

                        $(select, modal).trigger('chosen:updated');
                    });
                });

                break;
        }

        $(submitBtn).attr('data-type', 'edit');
        $(submitBtn).html('Zapisz');
        $(modal).modal();
    });

    // form POST
    $('form[data-element]').on('submit', function(e) {
        e.preventDefault();

        let form = $(this);

        let resource = $(form).attr('data-element');
        let type = $(form).closest('.modal-content').find('button[data-action="submit"]').attr('data-type');

        switch(type) {
            case 'add':
                switch (resource) {
                    case 'car':
                        post(resource, {
                            name: $('[name="name"]', $(this)).val(),
                            registration: $('[name="registration"]', $(this)).val(),
                            user_id: $('[name="user_id"]', $(this)).chosen().val(),
                            service_date: $('[name="service_date"]', $(this)).val(),
                            locked: $('[name="locked"]', $(this)).prop('checked') ? 1 : 0,
                        }, function (data) {
                            notification.success('Pojazd został dodany!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');
                            $(form)[0].reset();

                            refetch(resource);
                        }, function (data) {
                            notification.error('Pojazd nie został dodany, sprawdź wprowadzone dane.');
                        });

                        break;
                }

                break;
            case 'edit':
                switch (resource) {
                    case 'car':
                        put(resource + '/' + editable_id, {
                            name: $('[name="name"]', $(this)).val(),
                            registration: $('[name="registration"]', $(this)).val(),
                            user_id: $('[name="user_id"]', $(this)).chosen().val(),
                            service_date: $('[name="service_date"]', $(this)).val(),
                            locked: $('[name="locked"]', $(this)).prop('checked') ? 1 : 0,
                        }, function (data) {
                            notification.success('Pojazd został zaktualizowany!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');
                            $(form)[0].reset();

                            refetch(resource);
                        }, function (data) {
                            notification.error('Pojazd nie został zaktualizowany, sprawdź wprowadzone dane.');
                        });

                        break;
                }

                break;
        }
    });

    // remove element
    $(document).on('click', '.action-remove', function() {
        let resource = $(this).closest('table').attr('data-resource');
        let element = $(this).closest('tr').attr('data-element-id');

        del(resource, element, function (data) {
            notification.success('Element został usunięty');

            refetch(resource);
        }, function (data) {
            notification.error('Nie można usunąć elementu, ponieważ posiada inne przypisane elementy lub nie istnieje!');
        });
    });

    // row actions
    $('section').on('click', '.action-remove-row', function() {
        $(this).closest('.form-row').remove();
    });

    $(document).on('click', '.action-doc', function() {
        let resource = $(this).closest('[data-resource]').attr('data-resource');
        let id = $(this).closest('tr').attr('data-element-id');
        let icon = $(this);

        $(icon).removeClass('fa fa-file-pdf').addClass('fas fa-spinner fa-spin');

        switch(resource) {
            case 'car':
                file(`car/${id}/pdf`, function(data) {
                    pdf(data, `CAR_${id}.pdf`);

                    $(icon).removeClass('fas fa-spinner fa-spin').addClass('fa fa-file-pdf');
                });

                break;
        }
    });

    // TR click actions
    $(document).on('click', '.clickable td:not(:last-child)', function() {
        let resource = $(this).closest('table').attr('data-resource');
        let id = $(this).closest('tr').attr('data-element-id');
        let modal = $('div[data-element="' + resource + '-clickable"]');
        let element = $(this).closest('div[data-element]').attr('data-element');
        let clickable = new Clickable();

        switch(element) {
            case 'car-clickable':
                modal = $('div[data-element="data-show"]');

                $('table > tbody', modal).empty();

                get(`car/stock/${id}`, function (data) {
                    $.each(data.element, function (k, v) {
                        $('table > tbody', modal).append(`<tr>
                            <td>${v.item_id}</td>
                            <td>${v.sn}</td>
                            <td>${v.mac}</td>
                            <td>${v.warehouses_in ? v.warehouses_in.warehouses_in_item[0].price_notax : ''}</td>
                            <td>${v.warehouses_in ? v.warehouses_in.invoice_date : ''}</td>
                            <td>${v.warehouses_in ? v.warehouses_in.invoice_name : ''}</td>
                        </tr>`);
                    });
                });

                $(modal).modal();

                break;
        }

        switch(resource) {
            case 'car':
                paging[resource + '-clickable'] = 1;

                clickable_id = id;
                clickable.car(modal, resource + '-clickable', id);

                break;
        }

        $(modal).modal();
    });

    $('button[data-action="submit"]').on('click', function() {
        let form = $(this).attr('data-form');

        $(`form[data-element="${form}"]`).submit();
    });
});
