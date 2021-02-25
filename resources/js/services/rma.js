let rmaStatusList = {
    0: 'Utworzone (nowe)',
    1: 'Wysłane',
    2: 'Zamknięte'
};

let rmaStatusListClass = {
    0: 'alert-secondary',
    1: 'alert-info',
    2: 'alert-success'
};

let rmaTypeList = {
    0: 'Wymiana',
    1: 'Naprawa',
    2: 'Zwrot pieniędzy'
};

let rmaEndStatusList = {
    0: 'Naprawiono',
    1: 'Wymiana / nowy MAC/SN',
    2: 'Dokonano zwrotu towaru / korekta faktury',
    3: 'Odrzucono'
};

let openId;

var rma = function rma(page = false, callbackSuccess = false, callbackError = false, sortBy = ['desc', 'id'], search = false) {
    let resource = 'rma';
    let sortable = Object.keys(sortBy).length > 0 ? true : false;
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

        $('table[data-resource="' + resource + '"] > tbody').empty();

        if(!(Object.keys(data.data).length > 0)) {
            let ths = $('table[data-resource="' + resource + '"] > thead').find('th');
            let span = Object.keys(ths).length;

            let tbody = `<tr><td class="text-center" colspan="${span}">Brak wyników</td></tr>`;

            $('table[data-resource="' + resource + '"] > tbody').append(tbody);
        } else {
            $.each(data.data, function(key, value) {
                let tbody = `<tr data-element-id="${value.id}" class="clickable">
                    <td>${value.id}</td>
                    <td>${value.document_name}</td>
                    <td>${value.contractor.name}</td>
                    <td>${value.contractor_rma_id ? value.contractor_rma_id : ''}</td>
                    <td>${value.warehouses_in ? value.warehouses_in.invoice_name : ''}</td>
                    <td>${value.rmas_reason.name}</td>
                    <td class="alert ${rmaStatusListClass[value.rma_status]}">${rmaStatusList[value.rma_status]}</td>
                    <td>${value.created_at}</td>
                    <td>
                        <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
                    </td>
                </tr>`;

                $('table[data-resource="' + resource + '"] > tbody').append(tbody);
            });
        }

        sort(resource, sortBy);
        pagination(resource, data);
        onFirstLoad(resource);
    });
};

var rmas_reason = function rmas_reason(page = false, callbackSuccess = false, callbackError = false, sortBy = [], search = false) {
    let resource = 'rmas_reason';
    let sortable = Object.keys(sortBy).length > 0 ? true : false;
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

        $('table[data-resource="' + resource + '"] > tbody').empty();

        if(!(Object.keys(data.data).length > 0)) {
            let ths = $('table[data-resource="' + resource + '"] > thead').find('th');
            let span = Object.keys(ths).length;

            let tbody = `<tr><td class="text-center" colspan="${span}">Brak wyników</td></tr>`;

            $('table[data-resource="' + resource + '"] > tbody').append(tbody);
        } else {
            $.each(data.data, function(key, value) {
                let tbody = `<tr data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.name}</td>
                    <td>${value.created_at}</td>
                    <td>
                        <i class="tim-icons icon-pencil action-edit font-weight-bold"></i>
                        <i class="tim-icons icon-simple-remove action-remove font-weight-bold"></i>
                    </td>
                </tr>`;

                $('table[data-resource="' + resource + '"] > tbody').append(tbody);
            });
        }

        sort(resource, sortBy);
        pagination(resource, data);
        onFirstLoad(resource);
    });
};

var contractor = function contractor(page = false, callbackSuccess = false, callbackError = false) {
    let resource = 'contractor';
    let url = resource + (page !== false ? '?page=' + page : '/all');

    get(url, function(data) {
        if(callbackSuccess !== false) {
            callbackSuccess(data);
            return;
        }
    }, function(data) {
        notification.error('Nie udało się pobrać danych: ' + resource);
    });
};

var warehouse = function warehouse(page = false, callbackSuccess = false, callbackError = false, sortBy = []) {
    let resource = 'warehouse';
    let sortable = Object.keys(sortBy).length > 0 ? true : false;
    let url = 'warehouse' + (sortable ? '/sort/' + sortBy[0] + '/' + sortBy[1] : '') + (page !== false ? '?page=' + page : '/all');

    get(url, function(data) {
        if(callbackSuccess !== false) {
            callbackSuccess(data);
            return;
        }
    }, function(data) {
        notification.error('Nie udało się pobrać danych: ' + resource);
    });
};

var search = function search(resource) {
    // resource-item
    let section = $('section[data-element="' + resource + '"]');
    let modal = $(section).closest('.modal');

    $(section).find('.resource-item').each(function(key, value) {
        let row = $(this).closest('.form-row');
        let url;

        switch(resource) {
            case 'rma':
                url = api + 'stock/search/{query}/rma';
                break;
            default:
                return;
        }

        $(this).search({
            apiSettings: {
                url: url,
                saveRemoteData: false,
                beforeXHR: function(request) {
                    request.setRequestHeader('Accept', 'application/json');
                    request.setRequestHeader('Content-Type', 'application/json');
                    request.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('apiToken'));
                },
                beforeSend: function(settings) {
                    switch(resource) {
                        case 'rma':
                            // settings.url = settings.url + '/' + $(this).closest('form').find('[name="user_get_id"] option:selected').val();

                            break;
                    }

                    return settings;
                },
                onResponse: function(response) {
                    var convertedResponse = {
                        results : []
                    };

                    switch(resource) {
                        case 'rma':
                            $.each(response.data, function(index, stock) {
                                let descr;

                                if(Object.keys(stock.element).length > 0) {
                                    descr = stock.item.items_manufacturer.name + '<br><small>(S/N: ' + stock.element[0].sn + ' / MAC: ' + stock.element[0].mac + ')</small>';
                                }

                                convertedResponse.results.push({
                                    title       : stock.item.items_manufacturer.name + ' <i>' + stock.item.model_name + '</i>',
                                    description : descr,
                                    item_id     : stock.item_id,
                                    unit_id     : stock.item.unit.id,
                                    unit        : stock.item.unit.short_name,
                                    has_data    : stock.item.has_data,
                                    quantity    : stock.quantity,
                                    element     : stock.element,
                                    contractor_id : (stock.element[0].warehouses_in ? stock.element[0].warehouses_in.contractor_id : false),
                                    warehouses_in_id : (stock.element[0].warehouses_in ? stock.element[0].warehouses_in.id : false),
                                    warehouses_in : stock.element[0].warehouses_in ? stock.element[0].warehouses_in : false
                                });
                            });

                            break;
                    }

                    return convertedResponse;
                }
            },
            cache: false,
            minCharacters: 1,
            onSelect: function(result) {
                let quantity;

                switch(resource) {
                    case 'rma':
                        $('input[name="item_id"]', row).val(result.item_id);
                        $('input[name="has_data"]', row).val(result.has_data);

                        if(result.contractor_id) {
                            $('input[name="warehouses_in_id"]', row).val(result.warehouses_in_id);
                            $('input[name="contractor_id"]', row).val(result.contractor_id);

                            $('.invoice_date', row).html(result.warehouses_in.invoice_date).closest('div').removeClass('hidden');

                            // $(modal).find('.modal-body').find('.card:gt(0)').addClass('hidden');
                            // $(modal).find('input').each(function() {
                            //     if($(this).attr('name') === 'item_data') {
                            //         $(this).val('[]');
                            //         return false;
                            //     }
                            //
                            //     $(this).val('');
                            // });
                            //
                            // return;
                        } else {
                            $('input[name="warehouses_in_id"]', row).val(null);
                            $('input[name="contractor_id"]', row).val(null);

                            $('.invoice_date', row).html(result.warehouses_in.invoice_date).closest('div').addClass('hidden');

                            notification.warning('Produkt został zaimportowany ręcznie na magazyn i nie posiada PZ!');
                        }

                        contractor(false, function(data) {
                            let select = $('select[name="contractor_id"]', modal);

                            $(select).empty();

                            $.each(data, function(key, value) {
                                if(result.contractor_id === value.id) {
                                    $(select).append(`<option value="${value.id}" selected="selected">${value.name}, ${value.street}, ${value.postcode} ${value.city}</option>`);
                                } else {
                                    $(select).append(`<option value="${value.id}">${value.name}, ${value.street}, ${value.postcode} ${value.city}</option>`);
                                }
                            });

                            $(select).selectpicker('refresh');
                        });

                        rmas_reason(false, function(data) {
                            let select = $('select[name="rmas_reason_id"]', modal);

                            $(select).empty();

                            $.each(data, function(key, value) {
                                $(select).append(`<option value="${value.id}">${value.name}</option>`);
                            });

                            $(select).selectpicker('refresh');
                        });

                        $(modal).find('.modal-body').find('.card:gt(0)').removeClass('hidden');

                        item_data = $('input[name="item_data"]', row);

                        if(Object.keys(result.element).length > 0) {
                            let json = JSON.parse('[]');

                            json.push({
                                sn: result.element[0].sn,
                                mac: result.element[0].mac
                            });

                            $(quantity).val(Object.keys(json).length);

                            $(item_data).val(JSON.stringify(json));
                        }

                        break;
                }
            }
        });
    });
};

$(document).ready(function() {
    // set menu entry as active
    $('li[data-route="rma"]').addClass('active');

    $('table > tbody').on('click', '.clickable td:not(:last-child)', function() {
        let resource = $(this).closest('table').attr('data-resource');
        let id = $(this).closest('tr').attr('data-element-id');
        let modal = $('div[data-element="' + resource + '-clickable"]');
        let element = $(this).closest('div[data-element]').attr('data-element');

        let title = $(modal).find('.modal-title-text');
        let body = $(modal).find('.modal-body');

        openId = id;

        switch(resource) {
            case 'rma':
                get(`rma/${id}`, function(data) {
                    $(title).html(`Zgłoszenie <strong>${data.document_name}</strong>`);

                    let sn = $('[name="sn"]', modal);
                    let mac = $('[name="mac"]', modal);
                    let note = $('[name="note"]', modal);
                    let new_invoice = $('[name="new_invoice"]', modal);
                    let submitBtn = $('[data-action="submit"]', modal);

                    $([sn, mac, note]).each(function() {
                        $(this).empty();
                    });

                    $('.contractor', modal).html(`${data.contractor.name}<br>${data.contractor.street}<br>${data.contractor.postcode} ${data.contractor.city}`);
                    $('.warehouses_in', modal).html(`${data.warehouses_in ? data.warehouses_in.invoice_name + '<br>z dnia ' + data.warehouses_in.invoice_date : 'brak'}`);

                    $('[name="reason"]', modal).val(data.rmas_reason.name);
                    $('[name="sent_at"]', modal).val(data.sent_at);
                    $('[name="received_at"]', modal).val(data.received_at);
                    $('.name', modal).html(`${data.document_name}`);
                    $('[name="note"]', modal).val(data.note);
                    $('.date', modal).html(`${data.created_at}`);

                    $('table > tbody', modal).empty();

                    let rma_status = $('[name="rma_status"]', modal);

                    $(rma_status).empty();

                    $.each(rmaStatusList, function(k,v) {
                        if(parseInt(data.rma_status) <= parseInt(k)) {
                            $(rma_status).append(`<option value="${k}">${v}</option>`);
                        }

                        if(data.rma_status.toString() === k) {
                            $(rma_status).selectpicker('val', k);
                        }
                    });

                    $(rma_status).selectpicker('refresh');


                    let rma_end_status = $('[name="end_status"]', modal);

                    $(rma_end_status).empty();

                    $.each(rmaEndStatusList, function(k,v) {
                        $(rma_end_status).append(`<option value="${k}">${v}</option>`);

                        if(data.end_status.toString() === k) {
                            $(rma_end_status).selectpicker('val', k);
                        }
                    });

                    $(rma_end_status).selectpicker('refresh');


                    let warehouse_id = $('[name="warehouse_id"]', modal);

                    $(warehouse_id).empty();

                    warehouse(false, function(response) {
                        $.each(response, function(k,v) {
                            $(warehouse_id).append(`<option value="${v.id}">${v.name}</option>`);

                            if(data.warehouse_id !== null) {
                                if(data.warehouse_id.toString() === v.id) {
                                    $(warehouse_id).selectpicker('val', v.id);
                                }
                            }
                        });

                        $(warehouse_id).selectpicker('refresh');
                    });

                    if(data.rma_status === 2) {
                        $(rma_status).prop('disabled', true).selectpicker('refresh');
                        $(rma_end_status).prop('disabled', true).selectpicker('refresh');
                        $(warehouse_id).prop('disabled', true).selectpicker('refresh');

                        if(data.end_status === 1) {
                            $(sn).prop('disabled', true).val(data.rmas_item_new[0].element[0].sn);
                            $(mac).prop('disabled', true).val(data.rmas_item_new[0].element[0].mac);
                        }

                        if(data.end_status === 2) {
                            $(new_invoice).prop('disabled', true).val(data.new_invoice);
                        }

                        $(note).prop('disabled', true);

                        $(submitBtn).prop('disabled', true);
                    } else {
                        $([rma_status, rma_end_status, warehouse_id]).each(function() {
                            $(this).prop('disabled', false).selectpicker('refresh');
                        });

                        $([sn, mac, note, submitBtn]).each(function() {
                            $(this).prop('disabled', false);
                        });
                    }

                    $.each(data.rmas_item, function(k,v) {
                        let tbody = `<tr>
                            <td>${v.item_id}</td>
                            <td>${v.item.items_manufacturer.name} ${v.item.model_name}</td>
                            <td>${v.element[0].sn}</td>
                            <td>${v.element[0].mac}</td>
                            <td>${v.quantity}</td>
                            <td>${v.item.unit.short_name}</td>
                            <td></td>
                        </tr>`;

                        $('table > tbody', modal).append(tbody);
                    });
                });

                break;
        }

        $(modal).modal();
    });

    //change
    $('[name="rma_status"]').on('change', function() {
        let status = $('option:selected', this);
        let form = $(status).closest('form');

        switch(parseInt($(status).val())) {
            case 0:
                $('[data-element="status-closed"]', form).addClass('hidden');

                break;
            case 1:
                $('[data-element="status-closed"]', form).addClass('hidden');

                break;
            case 2:
                $('[data-element="status-closed"]', form).removeClass('hidden');

                break;
        }

        $('[name="end_status"]').trigger('change');
    });

    $('[name="end_status"]').on('change', function() {
        let status = $('option:selected', this);
        let form = $(status).closest('form');

        if(!$(this).is(':visible')) {
            $('[data-element="end-status-warehouse"]', form).addClass('hidden');
            return;
        }

        switch(parseInt($(status).val())) {
            case 0:
                $('[data-element="end-status-data"]', form).addClass('hidden');
                $('[data-element="end-status-invoice"]', form).addClass('hidden');
                $('[data-element="end-status-warehouse"]', form).removeClass('hidden');

                break;
            case 1:
                $('[data-element="end-status-data"]', form).removeClass('hidden');
                $('[data-element="end-status-invoice"]', form).addClass('hidden');
                $('[data-element="end-status-warehouse"]', form).removeClass('hidden');

                break;
            case 2:
                $('[data-element="end-status-data"]', form).addClass('hidden');
                $('[data-element="end-status-invoice"]', form).removeClass('hidden');
                $('[data-element="end-status-warehouse"]', form).addClass('hidden');

                break;
            case 3:
                $('[data-element="end-status-data"]', form).addClass('hidden');
                $('[data-element="end-status-invoice"]', form).addClass('hidden');
                $('[data-element="end-status-warehouse"]', form).removeClass('hidden');

                break;
        }
    });

    //add element
    $('.action-add').on('click', function() {
        let resource = $(this).attr('data-element');
        let modal = $('div[data-element="' + resource + '"]');

        let title = $('.modal-title', modal);
        let submitBtn = $('.modal-footer > button[data-type]', modal);

        related = $(this).closest('.modal').attr('data-element');

        switch(resource) {
            case 'rmas_reason':

                break;
        }

        search(resource);

        $(submitBtn).attr('data-type', 'add');
        $(submitBtn).html('Dodaj');

        if(!($('div[data-element="' + resource + '"]').data('bs.modal') || {})._isShown) {
            $('div[data-element="' + resource + '"]').modal({
                backdrop: 'static'
            });

            $('div[data-element="' + resource + '"]').find('input[type="text"]')[0].focus();
        }
    });

    //edit element
    $('table > tbody').on('click', '.action-edit', function() {
        let element = $(this).closest('table').attr('data-resource');
        let id = $(this).closest('tr').attr('data-element-id');
        let modal = $('div[data-element="' + element + '"]');

        let title = $('.modal-title', modal);
        let submitBtn = $('button[data-action="submit"]', modal);

        editable_id = id;

        switch(element) {
            case 'rmas_reason':
                $(title).html('Edycja powodu');

                get(`rmas_reason/edit/${id}`, function(data) {
                    $('[name="name"]', modal).val(data.name);
                }, function(data) {
                    console.log(data);
                });

                break;
        }

        $(submitBtn).attr('data-type', 'edit');
        $(submitBtn).html('Zapisz');
        $('div[data-element="' + element + '"]').modal();
    });

    //remove element
    $('table > tbody').on('click', '.action-remove', function() {
        let resource = $(this).closest('table').attr('data-resource');
        let element = $(this).closest('tr').attr('data-element-id');

        del(resource, element, function(data) {
            notification.success('Element został usunięty');

            refetch(resource);
        }, function(data) {
            notification.error('Nie można usunąć elementu, ponieważ posiada inne przypisane elementy!');
        });
    });

    //doc element
    $('table > tbody').on('click', '.action-doc', function() {
        let resource = $(this).closest('[data-resource]').attr('data-resource');
        let id = $(this).closest('tr').attr('data-element-id');
        let icon = $(this);

        $(icon).removeClass('fa fa-file-pdf').addClass('fas fa-spinner fa-spin');

        switch(resource) {
            case 'rma':
                file(`rma/${id}/pdf`, function(data) {
                    pdf(data, `RMA_${id}.pdf`);

                    $(icon).removeClass('fas fa-spinner fa-spin').addClass('fa fa-file-pdf');
                });

                break;
        }
    });

    $('button[data-action="submit"]').on('click', function() {
        let resource = $(this).attr('data-form');

        $(this).closest('.modal-footer').parent().find('form').submit();
    });

    $('form').on('submit', function(e) {
        e.preventDefault();

        let form = $(this);
        let modal = $(this).closest('.modal');
        let resource = $(this).attr('data-element');
        let button = $(form).closest('.modal-content').find('button[data-action="submit"]');
        let type = $(button).attr('data-type');

        let errors = 0;
        let data;

        switch(type) {
            case 'add':
                switch(resource) {
                    case 'rma':
                        $(button).prop('disabled', true);

                        data = {
                            item_id: $('[name="item_id"]', form).val(),
                            item_data: $('[name="item_data"]', form).val(),
                            contractor_id: $('[name="contractor_id"] option:selected', form).val(),
                            rmas_reason_id: $('[name="rmas_reason_id"] option:selected', form).val(),
                            warehouses_in_id: $('[name="warehouses_in_id"]', form).val(),
                            note: $('[name="note"]', form).val(),
                            contractor_rma_id: $('[name="contractor_rma_id"]', form).val()
                        };

                        $.each(data, function(k,v) {
                            switch(k) {
                                case 'item_id':
                                    if(!v) {
                                        notification.error('RMA nie zostało dodane, wybierz produkt!');

                                        errors++;
                                        return false;
                                    }

                                    break;
                                case 'item_data':
                                    if(Object.keys(JSON.parse(v)).length < 1) {
                                        notification.error('RMA nie zostało dodane, wybierz produkt!');

                                        errors++;
                                        return false;
                                    }

                                    break;
                                case 'contractor_id':
                                    if(!v) {
                                        notification.error('RMA nie zostało dodane, wybierz kontrahenta!');

                                        errors++;
                                        return false;
                                    }

                                    break;
                                case 'rmas_reason_id':
                                    if(!v) {
                                        notification.error('RMA nie zostało dodane, wybierz powód zgłoszenia!');

                                        errors++;
                                        return false;
                                    }

                                    break;
                            }
                        });

                        if(errors > 0) {
                            $(button).prop('disabled', false);
                            return;
                        }

                        post(resource, data, function(data) {
                            notification.success('RMA zostało dodane!');

                            $('div[data-element="' + resource + '"]').modal('hide');
                            $(form)[0].reset();

                            refetch(resource);

                            $(button).prop('disabled', false);
                        }, function(data) {
                            notification.error('RMA nie zostało dodane, sprawdź wprowadzone dane.');

                            $(button).prop('disabled', false);
                        });

                        break;
                    case 'rmas_reason':
                        $(button).prop('disabled', true);

                        post(resource, {
                            name: $('[name="name"]', form).val()
                        }, function(data) {
                            notification.success('Powód został dodany!');

                            $('div[data-element="' + resource + '"]').modal('hide');
                            $(form)[0].reset();

                            refetch(resource);

                            $(button).prop('disabled', false);
                        }, function(data) {
                            notification.error('Powód nie został dodany, sprawdź wprowadzone dane.');

                            $(button).prop('disabled', false);
                        });

                        break;
                }

                break;
            case 'edit':
                switch(resource) {
                    case 'rmas_reason':
                        $(button).prop('disabled', true);

                        put(resource + '/' + editable_id, {
                            name: $('[name="name"]', form).val()
                        }, function(data) {
                            notification.success('Powód został zaktualizowany!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');
                            $(form)[0].reset();

                            $(button).prop('disabled', false);

                            refetch(resource);
                        }, function(data) {
                            notification.error('Powód nie został zaktualizowany, sprawdź wprowadzone dane.');

                            $(button).prop('disabled', false);
                        });

                        break;
                    case 'rma':
                        $(button).prop('disabled', true);

                        put(resource + '/' + openId, {
                            note: $('[name="note"]', form).val(),
                            rma_status: $('[name="rma_status"]', form).val(),
                            end_status: $('[name="end_status"]', form).val(),
                            warehouse_id: $('[name="warehouse_id"]', form).val(),
                            sn: $('[name="sn"]', form).val(),
                            mac: $('[name="mac"]', form).val(),
                            new_invoice: $('[name="new_invoice"]', form).val()
                        }, function(data) {
                            notification.success('RMA zostało zaktualizowane!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');

                            $(button).prop('disabled', false);

                            refetch(resource);

                            $(modal).modal('hide');
                        }, function(data) {
                            notification.error('RMA nie zostało zaktualizowane, sprawdź wprowadzone dane.');

                            $(button).prop('disabled', false);
                        });

                        break;
                }

                break;
        }
    });
});
