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

class Lead {
    constructor() {
        this.resource = 'lead';
    }

    add() {
        let el = $(`<div class="modal" tabindex="-1" role="dialog" data-element="lead">
            <div class="modal-dialog animated fadeInDown" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fa fa-list-alt mr-2"></i>Dodawanie leada</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="card animated fadeIn">
                            <div class="card-body">
                                <form role="form" class="form-horizontal" data-element="lead" autocomplete="off" data-type="add">
                                    <div class="form-group row">
                                        <label for="name" class="col-4 col-form-label">Imię i nazwisko/Nazwa firmy *</label>
                                        <div class="col-8">
                                            <input name="name" type="text" class="form-control" autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="city" class="col-4 col-form-label">Miejscowość *</label>
                                        <div class="col-8">
                                            <div class="ui search">
                                                <input class="form-control prompt" name="city" type="text" autocomplete="off">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="street" class="col-4 col-form-label">Ulica *</label>
                                        <div class="col-6">
                                            <div class="ui search">
                                                <input class="form-control prompt" name="street" type="text" autocomplete="off" disabled>
                                            </div>
                                        </div>
                                        <div class="col-2">
                                            <div class="mt-2" data-toggle="tooltip" title="W miejscowości nie ma ulicy">
                                                <input disabled class="bootstrap-switch" name="no_street" type="checkbox" value="true">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="building_num" class="col-4 col-form-label">Nr budynku *</label>
                                        <div class="col-8">
                                            <input name="building_num" type="text" class="form-control" autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="apartment_num" class="col-4 col-form-label">Nr lokalu</label>
                                        <div class="col-8">
                                            <input name="apartment_num" type="text" class="form-control" autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="phone" class="col-4 col-form-label">Nr telefonu *</label>
                                        <div class="col-8">
                                            <input name="phone" type="text" class="form-control" autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="phone" class="col-4 col-form-label">Koniec umowy</label>
                                        <div class="col-8">
                                            <input name="contract_end_at" type="date" class="form-control" autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="offer" class="col-4 col-form-label">Oferta/Notatka</label>
                                        <div class="col-8">
                                            <textarea name="offer" class="form-control" autocomplete="off" rows="3" />
                                        </div>
                                    </div>
                                    <input type="hidden" name="street_teryt">
                                    <input type="hidden" name="city_teryt">
                                </form>
                                <div class="category form-category">* Pola wymagane</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                        <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="lead">Dodaj</button>
                    </div>
                </div>
            </div>
        </div>`);

        $('.bootstrap-switch', el).bootstrapSwitch({
            onText: '<i class="tim-icons icon-check-2"></i>',
            offText: '<i class="tim-icons icon-simple-remove"></i>',
        });

        $('body', document).append(el);

        $(el).modal();

        search(this.resource);
    }

    edit(id) {
        get(`${this.resource}/${id}/edit`, function(response) {
            let parent = response;

            let el = $(`<div class="modal" tabindex="-1" role="dialog" data-element="lead">
                <div class="modal-dialog animated fadeInDown" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"><i class="fa fa-list-alt mr-2"></i>Dodawanie leada</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="card animated fadeIn">
                                <div class="card-body">
                                    <form role="form" class="form-horizontal" data-element="lead" autocomplete="off" data-type="edit">
                                        <div class="form-group row">
                                            <label for="name" class="col-4 col-form-label">Imię i nazwisko/Nazwa firmy *</label>
                                            <div class="col-8">
                                                <input name="name" type="text" class="form-control" autocomplete="off" value="${response.name}">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="city" class="col-4 col-form-label">Miejscowość *</label>
                                            <div class="col-8">
                                                <div class="ui search">
                                                    <input class="form-control prompt" name="city" type="text" autocomplete="off" value="${response.city}">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="street" class="col-4 col-form-label">Ulica *</label>
                                            <div class="col-6">
                                                <div class="ui search">
                                                    <input class="form-control prompt" name="street" type="text" autocomplete="off" value="${response.street ? response.street : ''}">
                                                </div>
                                            </div>
                                            <div class="col-2">
                                                <div class="mt-2" data-toggle="tooltip" title="W miejscowości nie ma ulicy">
                                                    <input class="bootstrap-switch" name="no_street" type="checkbox" value="true" ${response.street ? '' : 'checked'}>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="building_num" class="col-4 col-form-label">Nr budynku *</label>
                                            <div class="col-8">
                                                <input name="building_num" type="text" class="form-control" autocomplete="off" value="${response.building_num}">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="apartment_num" class="col-4 col-form-label">Nr lokalu</label>
                                            <div class="col-8">
                                                <input name="apartment_num" type="text" class="form-control" autocomplete="off" value="${response.apartment_num ? response.apartment_num : ''}">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="phone" class="col-4 col-form-label">Nr telefonu *</label>
                                            <div class="col-8">
                                                <input name="phone" type="text" class="form-control" autocomplete="off" value="${response.phone}">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="phone" class="col-4 col-form-label">Koniec umowy</label>
                                            <div class="col-8">
                                                <input name="contract_end_at" type="date" class="form-control" autocomplete="off" value="${response.contract_end_at ? response.contract_end_at : ''}">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="offer" class="col-4 col-form-label">Oferta/Notatka</label>
                                            <div class="col-8">
                                                <textarea name="offer" class="form-control" autocomplete="off" rows="3">${response.offer ? response.offer : ''}</textarea>
                                            </div>
                                        </div>
                                        <input type="hidden" name="street_teryt" value="${response.street_teryt ? response.street_teryt : ''}">
                                        <input type="hidden" name="city_teryt" value="${response.city_teryt}">
                                    </form>
                                    <div class="category form-category">* Pola wymagane</div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                            <button type="button" class="btn btn-primary" data-action="submit" data-type="edit" data-form="lead">Zapisz</button>
                        </div>
                    </div>
                </div>
            </div>`);

            $('.bootstrap-switch', el).bootstrapSwitch({
                onText: '<i class="tim-icons icon-check-2"></i>',
                offText: '<i class="tim-icons icon-simple-remove"></i>',
            });

            if(!response.street) {
                $('[name="street"]', el).prop('disabled', true);
            }

            $('body', document).append(el);

            $(el).modal();

            search('lead');
        });
    }

    show(id) {
        let resource = this.resource;

        get(`${resource}/${id}`, function(response) {

        });
    }

    store(form) {
        let resource = this.resource;

        let data = {
            name: $(`[name="name"]`, form).val(),
            city: $(`[name="city"]`, form).val(),
            city_teryt: $(`[name="city_teryt"]`, form).val(),
            street: $(`[name="street"]`, form).val(),
            street_teryt: $(`[name="street_teryt"]`, form).val(),
            building_num: $(`[name="building_num"]`, form).val(),
            apartment_num: $(`[name="apartment_num"]`, form).val(),
            phone: $(`[name="phone"]`, form).val(),
            contract_end_at: $(`[name="contract_end_at"]`, form).val(),
            offer: $(`[name="offer"]`, form).val(),
            no_street: $(`[name="no_street"`, form).is(':checked') ? 1 : 0,
        };

        console.log(data);

        post(resource, data, function(response) {
            let modal = $(form).closest('.modal');

            $(modal).modal('hide');
            $(modal).remove();

            refetch(resource);

            notification.success('Lead został dodany');
        }, function(response) {
            let msg = 'Lead nie został dodany';

            parseErrors(form, response, msg);
        });
    }

    update(id, form) {
        let resource = this.resource;

        let data = {
            name: $(`[name="name"]`, form).val(),
            city: $(`[name="city"]`, form).val(),
            city_teryt: $(`[name="city_teryt"]`, form).val(),
            street: $(`[name="street"]`, form).val(),
            street_teryt: $(`[name="street_teryt"]`, form).val(),
            building_num: $(`[name="building_num"]`, form).val(),
            apartment_num: $(`[name="apartment_num"]`, form).val(),
            phone: $(`[name="phone"]`, form).val(),
            contract_end_at: $(`[name="contract_end_at"]`, form).val(),
            offer: $(`[name="offer"]`, form).val(),
            no_street: $(`[name="no_street"`, form).is(':checked') ? 1 : 0,
        };

        put(`${resource}/${id}`, data, function(response) {
            let modal = $(form).closest('.modal');

            $(modal).modal('hide');
            $(modal).remove();

            refetch(resource);

            notification.success('Lead został zaktualizowany');
        }, function(response) {
            let msg = 'Lead nie został zaktualizowany';

            parseErrors(form, response, msg);
        });
    }
}

let _lead = new Lead();

let lead = function lead(page = false, callbackSuccess = false, callbackError = false, sortBy = ['desc', 'id']) {
    let resource = 'lead';
    let sortable = Object.keys(sortBy).length > 0;
    let url = resource + (sortable ? '/' + sortBy[1] + '/' + sortBy[0] : '') + (page !== false ? '?page=' + page : '/all');

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
                let row = `<tr class="clickable" data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.name}</td>
                    <td>${value.teryt_simc.NAZWA}</td>
                    <td>${value.teryt_ulic ? value.teryt_ulic.NAZWA_1 : value.teryt_simc.NAZWA}</td>
                    <td>${value.building_num}</td>
                    <td>${value.apartment_num ? value.apartment_num : ''}</td>
                    <td>${value.phone}</td>
                    <td>${value.offer ? value.offer : ''}</td>
                    <td>${value.contract_end_at ? value.contract_end_at : ''}</td>
                    <td>${value.created_at}</td>
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
    }, function(data) {
        notification.error('Nie udało się pobrać danych: ' + resource);
    });
};

let search = function search(resource) {
    switch(resource) {
        case 'lead':
            let form = $(`form[data-element="${resource}"]`, document);

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
                        let convertedResponse = {
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
                    $('input[name="city_teryt"]', form).val(result.cityId);

                    $('input[name="street"]', form).prop('disabled', false);
                    $('input[name="no_street"]', form).bootstrapSwitch('disabled', false);
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
                        settings.url = api + 'services/search/local/' + $(form).find('input[name="city_teryt"]').val() + '/{query}';

                        return settings;
                    },
                    onResponse: function(response) {
                        let convertedResponse = {
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
                    $('input[name="street_teryt"]', form).val(result.ulicId);
                }
            });

            break;
    }
};

$(document).ready(() => {
    $('.action-add').on('click', function() {
        let resource = $(this).attr('data-element');
        let modal = $(`div[data-element="${resource}"]`);

        let title = $('.modal-title', modal);
        let submitBtn = $('.modal-footer > button[data-type]', modal);

        related = $(this).closest('.modal').attr('data-element');

        $(modal).find('.has-danger').each(function () {
            $(this).removeClass('has-danger');
        });

        switch(resource) {
            case 'lead':
                _lead.add();

                break;
        }
    });

    $(document).on('click', '.action-edit', function() {
        let element = $(this).closest('table').attr('data-resource');
        let id = $(this).closest('tr').attr('data-element-id');

        editable_id = id;

        switch(element) {
            case 'lead':
            _lead.edit(id);

                break;
        }
    });

    $(document).on('click', '.clickable td:not(:last-child)', function() {
        let resource = $(this).closest('table').attr('data-resource');
        let id = $(this).closest('tr').attr('data-element-id');


        switch(resource) {
            case 'lead':
                _lead.show(id);

                break;
        }
    });

    $(document).on('click', 'button[data-action="submit"]', function() {
        $(this).closest('[data-element]').find('form').submit();
    });

    $(document).on('submit', 'form[data-type="add"]', function(e) {
        e.preventDefault();

        let element = $(this).closest('.modal').data('element');
        let form = $(this).closest('.modal').find('form');

        switch(element) {
            case 'lead':
                _lead.store(form);

                break;
        }
    });

    $(document).on('submit', 'form[data-type="edit"]', function(e) {
        e.preventDefault();

        let element = $(this).closest('.modal').data('element');
        let form = $(this).closest('.modal').find('form');
        let id = editable_id;

        switch(element) {
            case 'lead':
                _lead.update(id, form);

                break;
        }
    });

    $(document).on('click', '.action-remove', function(e) {
        let resource = $(this).closest('table').attr('data-resource');
        let element = $(this).closest('tr').attr('data-element-id');

        del(resource, element, function(data) {
            switch(resource) {
                default:
                    notification.success('Element został usunięty');
            }

            refetch(resource);
        }, function(data) {
            switch(resource) {
                default:
                    notification.error('Nie można usunąć elementu, ponieważ posiada inne przypisane elementy lub nie posiadasz uprawnień!');
            }
        });
    });

    $(document).on('switchChange.bootstrapSwitch', '[name="no_street"]', function(e) {
        if(e.target.checked) {
            $('input[name="street"]').prop('disabled', true);
        } else {
            $('input[name="street"]').prop('disabled', false);
        }
    });

    $('body').tooltip({ selector: '[data-toggle="tooltip"]', trigger: 'hover', placement: 'bottom' });

    $('body', document).addClass('sidebar-mini');

    /* $(document).on('change', '[name="city_teryt"]', function(e) {
        let form = $(this).closest('form');

        $('[name="street_teryt"]', form).val('');
        $('[name="street"]', form).val('');
    }); */
});
