class bhpItemClass {
    constructor() {
        this.data = {};
        this.data.resource = 'bhpItem';
        this.data.id = null;
    }

    get resource() {
        return this.data.resource;
    }

    get id() {
        return this.data.id;
    }

    add() {
        let object = $(`<div class="modal" tabindex="-1" role="dialog" data-object="bhpItem" data-type="add">
            <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Dodawanie materiału BHP</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                    <div class="card animated fadeIn">
                        <div class="card-body">
                            <form role="form" class="form-horizontal" data-type="add">
                                <div class="row">
                                    <div class="col">
                                        <div class="form-group has-label">
                                            <label>Nazwa materiału *</label>
                                            <input class="form-control" name="name" type="text" minlength="1">
                                        </div>
                                        <div class="form-group has-label">
                                            <label>Jednostka miary *</label>
                                            <select class="form-control selectpicker" data-style="btn-primary" name="unit_id" data-live-search="true"></select>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div class="category form-category">* Pola wymagane</div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                    <button type="button" class="btn btn-primary" data-action="submit" data-form="bhpItem">Dodaj</button>
                </div>
              </div>
            </div>
        </div>`);

        unit(false, function(response) {
            let select = $('[name="unit_id"]', object);

            $.each(response, function(k,v) {
                $(select).append(`<option value="${v.id}">${v.name} (${v.short_name})</option>`);
            });

            $('option[value="2"]', select).prop('selected', true);
            $(select).selectpicker('refresh');
        });

        $(object).modal();
    }

    store(form) {
        let object = this;

        post('bhpItem', {
            name: $('[name="name"]', form).val(),
            unit_id: $('[name="unit_id"] option:selected', form).val()
        }, function(response) {
            notification.success('Materiał BHP został wprowadzony!');

            refetch(object.resource);

            $(form).closest('.modal').modal('hide');
        }, function(response) {
            notification.error('Nie udało się dodać materiału BHP, sprawdź wprowadzone dane.');
        });
    }

    edit(id) {
        this.data.id = id;

        get(`${this.data.resource}/${id}/edit`, function(response) {
            let parent = response;

            let object = $(`<div class="modal" tabindex="-1" role="dialog" data-object="bhpItem">
                <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Dodawanie materiału BHP</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                        <div class="card animated fadeIn">
                            <div class="card-body">
                                <form role="form" class="form-horizontal" data-type="edit">
                                    <div class="row">
                                        <div class="col">
                                            <div class="form-group has-label">
                                                <label>Nazwa materiału *</label>
                                                <input class="form-control" name="name" type="text" minlength="1">
                                            </div>
                                            <div class="form-group has-label">
                                                <label>Jednostka miary *</label>
                                                <select class="form-control selectpicker" data-style="btn-primary" name="unit_id" data-live-search="true"></select>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div class="category form-category">* Pola wymagane</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                        <button type="button" class="btn btn-primary" data-action="submit" data-form="bhpItem">Zapisz</button>
                    </div>
                  </div>
                </div>
            </div>`);

            let unit_id = $('[name="unit_id"]', object);

            unit(false, function(response) {
                $.each(response, function(k,v) {
                    $(unit_id).append(`<option value="${v.id}">${v.name} (${v.short_name})</option>`);
                });

                $(unit_id).find(`option[value="${parent.unit_id}"]`).prop('selected', true);
                $(unit_id).selectpicker('refresh');
            });

            $('[name="name"]', object).val(response.name);

            $(object).modal();
        });
    }

    update(form) {
        let object = this;

        put(`${this.data.resource}/${this.data.id}`, {
            name: $('[name="name"]', form).val(),
            unit_id: $('[name="unit_id"] option:selected').val()
        }, function(response) {
            notification.success('Materiał BHP został zaktualizowany!');

            refetch(object.resource);

            $(form).closest('.modal').modal('hide');
        }, function(response) {
            notification.error('Nie udało się zaktualizować materiału BHP, sprawdź wprowadzone dane.');
        });
    }

    get(args) {
        args = parseArgs(args, [false, false, false, false, false]);

        let query = parseQuery(args);
        let params = '?' + $.param(query);
        let resource = this.data.resource;

        let url = resource + params;

        get(url, function(data) {
            if(args.callbackSuccess !== false) {
                args.callbackSuccess(data);
                return;
            }

            let table = $(`table[data-resource="${resource}"]`);

            $('tbody', table).empty();

            if(!(Object.keys(data.data).length > 0)) {
                let ths = $('thead', table).find('th');
                let span = Object.keys(ths).length;

                let tbody = `<tr><td class="text-center" colspan="${span}">Brak wyników</td></tr>`;

                $('tbody', table).append(tbody);
            } else {
                $.each(data.data, function(key, value) {
                    let tbody = `<tr data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.name}</td>
                    <td>${value.unit.short_name}</td>
                    <td>${value.created_at}</td>
                    <td>
                        <i class="tim-icons icon-pencil action-edit font-weight-bold"></i>
                        <i class="tim-icons icon-simple-remove action-remove font-weight-bold"></i>
                    </td>
                </tr>`;

                    $('tbody', table).append(tbody);
                });
            }

            sort(resource, args.sortBy);
            pagination(resource, data);
            onFirstLoad(resource);
        });
    }
}

class bhpOutClass {
    constructor() {
        this.data = {};
        this.data.resource = 'bhpOut';
        this.id = null;
    }

    get resource() {
        return this.data.resource;
    }

    add() {
        let object = $(`<div class="modal" tabindex="-1" role="dialog" data-object="bhpOut" data-type="add">
            <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title"><i class="fa fa-user-plus mr-1"></i> Nowe wydanie materiałów BHP</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                    <form role="form" class="form-horizontal" data-type="add">
                        <div class="card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="form-group has-label col-lg-3 col-md-3">
                                        <label>Użytkownik docelowy *</label>
                                        <select class="form-control selectpicker" data-style="btn-default" name="user_out_id" data-live-search="true">
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col">
                                        <section>
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th class="text-center"></th>
                                                        <th class="text-center" style="width: 60%;">Materiał BHP <i class="tim-icons icon-simple-add action-add btn btn-link btn-icon btn-sm" data-element="bhpItem"></i></th>
                                                        <th class="text-center" style="width: 20%;">Ilość</th>
                                                        <th class="text-center" style="width: 20%;">J.m.</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colspan="7">
                                                            <button type="button" class="btn btn-default pull-right action-add-row">Dodaj pozycję</button>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col">
                                        <textarea class="form-control" rows="3" name="notes" placeholder="wpisz notatki"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                    <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="bhpOut">Dodaj</button>
                </div>
              </div>
            </div>
        </div>`);

        user(false, function(response) {
            let select = $('[name="user_out_id"]', object);

            $.each(response, function(k,v) {
                $(select).append(`<option value="${v.id}">${v.name}</option>`);
            });

            $(select).selectpicker('refresh');
        });

        $(object).modal();
    }

    store(form) {
        let object = this;
        let items = [];

        $('table > tbody', form).find('tr').each(function() {
            let quantity = $('[name="quantity"]', $(this)).val();
            let item_id = $('[name="item_id"]', $(this)).val();

            items.push({
                item_id: item_id,
                quantity: quantity
            });
        });

        post('bhpOut', {
            user_out_id: $('[name="user_out_id"]', form).val(),
            notes: $('[name="notes"]', form).val(),
            items: items
        }, function(response) {
            notification.success('Wydanie materiału BHP zostało wprowadzone!');

            refetch(object.resource);

            $(form).closest('.modal').modal('hide');
        }, function(response) {
            notification.error('Nie udało się dodać wydania materiału BHP, sprawdź wprowadzone dane.');
        });
    }

    show(id) {
        this.id = id;

        let url = `bhpOut/${this.id}`;

        get(url, function(data) {
            let object = $(`<div class="modal" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
                  <div class="modal-content">
                    <div class="modal-header hidden-sm">
                        <h5 class="modal-title"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row ml-2">
                            <div class="col-lg-4 col-md-4 col-sm-4">
                                <img src="assets/img/logo.png" alt="">
                            </div>
                            <div class="col-lg-4 col-md4 col-sm-4">
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-4">
                                <strong>Pracownik</strong>
                                <p class="user_out ml-2"></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-sm-12 text-center mt-5 mb-5 doc-name">
                                <strong>Dokument nr <span class="name"></span></strong>
                            </div>
                        </div>
                        <table class="table table-stripped">
                            <thead>
                                <th>Indeks BHP</th>
                                <th>Nazwa materiału BHP</th>
                                <th>Ilość</th>
                                <th>J.m.</th>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 mt-4 mb-4">
                                <strong>Uwagi</strong>
                                <p class="notes ml-2"></p>
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                                <strong>Data wystawienia</strong>
                                <p class="date ml-2"></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-9 col-md-9 col-sm-9 mt-4 mb-4">
                                <strong>Wydał</strong>
                                <p class="user ml-2"></p>
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                                <strong>Przyjął</strong>
                                <p class="user_out ml-2"></p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer hidden-sm">
                        <div class="pull-left">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
                        </div>
                        <div class="pull-right">
                        </div>
                    </div>
                  </div>
                </div>
            </div>`);

            $('table > tbody', object).empty();

            $('.modal-title', object).html(`Wydanie materiału BHP (<strong>${data.id}</strong>) dla <strong>${data.user_out.name}</strong>`);

            $('.user', object).html(`${data.user.name}`);
            $('.user_out', object).html(`${data.user_out.name}`);
            $('.name', object).html(`${data.document_name}`);
            $('.notes', object).html(`${data.notes ? data.notes : 'n/a'}`);
            $('.date', object).html(`${data.created_at}`);

            $('table > tbody', object).empty();

            $.each(data.bhp_outs_item, function(key, value) {
                let row = `<tr>
                    <td>${value.bhp_item.id}</td>
                    <td>${value.bhp_item.name}</td>
                    <td>${value.quantity}</td>
                    <td>${value.bhp_item.unit.short_name}</td>
                </tr>`;

                $('table > tbody', object).append(row);
            });

            $(object).modal();
        });
    }

    get(args) {
        args = parseArgs(args, [false, false, false, ['desc', 'id'], false]);

        let query = parseQuery(args);
        let params = '?' + $.param(query);
        let resource = this.data.resource;

        let url = resource + params;

        get(url, function(data) {
            if(args.callbackSuccess !== false) {
                args.callbackSuccess(data);
                return;
            }

            let table = $(`table[data-resource="${resource}"]`);

            $('tbody', table).empty();

            if(!(Object.keys(data.data).length > 0)) {
                let ths = $('thead', table).find('th');
                let span = Object.keys(ths).length;

                let tbody = `<tr><td class="text-center" colspan="${span}">Brak wyników</td></tr>`;

                $('tbody', table).append(tbody);
            } else {
                $.each(data.data, function(key, value) {
                    let tbody = `<tr class="clickable" data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.document_name}</td>
                    <td>${userAvatar(value.user) + value.user.name}</td>
                    <td>${userAvatar(value.user_out) + value.user_out.name}</td>
                    <td>${value.created_at}</td>
                    <td>
                        <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
                    </td>
                </tr>`;

                    $('tbody', table).append(tbody);
                });
            }

            sort(resource, args.sortBy);
            pagination(resource, data);
            onFirstLoad(resource);
        });
    }
}

class bhpUsersStocksItemClass {
    constructor() {
        this.data = {};
        this.data.resource = 'bhpUsersStocksItem';
        this.id = null;
    }

    get resource() {
        return this.data.resource;
    }

    show(id) {
        this.id = id;

        let url = `bhpUsersStocksItem/${this.id}`;

        get(url, function(data) {
            let object = $(`<div class="modal" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
                  <div class="modal-content">
                    <div class="modal-header hidden-sm">
                        <h5 class="modal-title"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="card card-body">
                            <div class="row ml-2">
                                <div class="col-lg-4 col-md-4 col-sm-4">
                                    <img src="assets/img/logo.png" alt="">
                                </div>
                                <div class="col-lg-4 col-md4 col-sm-4">
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4">
                                    <strong>Pracownik</strong>
                                    <p class="user ml-2"></p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12 col-md-12 col-sm-12 text-center mt-5 mb-5 doc-name">
                                    <strong>Stan BHP użytkownika: <span class="user"></span></strong>
                                </div>
                            </div>
                            <table class="table table-stripped">
                                <thead>
                                    <th>Indeks BHP</th>
                                    <th>Nazwa materiału BHP</th>
                                    <th>Ilość</th>
                                    <th>J.m.</th>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer hidden-sm">
                        <div class="pull-left">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
                        </div>
                        <div class="pull-right">
                        </div>
                    </div>
                  </div>
                </div>
            </div>`);

            $('table > tbody', object).empty();

            $('.modal-title', object).html(`Stan BHP użytkownika <strong>${data.name}</strong>`);
            $('.user', object).html(`${data.name}`);

            if(!(Object.keys(data.bhp_users_stocks_item).length > 0)) {
                let count = $('table > thead', object).find('th').length;

                $('table > tbody', object).append(`<tr><td class="text-center" colspan="${count}">Brak wyników</td></tr>`);
            }

            $.each(data.bhp_users_stocks_item, function(key, value) {
                let row = `<tr>
                    <td>${value.bhp_item.id}</td>
                    <td>${value.bhp_item.name}</td>
                    <td>${value.quantity}</td>
                    <td>${value.bhp_item.unit.short_name}</td>
                </tr>`;

                $('table > tbody', object).append(row);
            });

            $(object).modal();
        });
    }

    get(args) {
        args = parseArgs(args, [false, false, false, false, false]);

        let query = parseQuery(args);
        let params = '?' + $.param(query);
        let resource = this.data.resource;

        let url = resource + params;

        get(url, function(data) {
            if(args.callbackSuccess !== false) {
                args.callbackSuccess(data);
                return;
            }

            let table = $(`table[data-resource="${resource}"]`);

            $('tbody', table).empty();

            if(!(Object.keys(data.data).length > 0)) {
                let ths = $('thead', table).find('th');
                let span = Object.keys(ths).length;

                let tbody = `<tr><td class="text-center" colspan="${span}">Brak wyników</td></tr>`;

                $('tbody', table).append(tbody);
            } else {
                $.each(data.data, function(key, value) {
                    let row = `<tr class="clickable" data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${userAvatar(value) + value.name}</td>
                    <td>
                        <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
                    </td>
                </tr>`;

                    $('tbody', table).append(row);
                });
            }

            sort(resource, args.sortBy);
            pagination(resource, data);
            onFirstLoad(resource);
        });
    }
}

let bhpItemObj = new bhpItemClass();
let bhpOutObj = new bhpOutClass();
let bhpUsersStocksItemObj = new bhpUsersStocksItemClass();

let bhpUsersStocksItem = function bhpUsersStocksItem(...args) {
    bhpUsersStocksItemObj.get(args);
};

let bhpItem = function bhpItem(...args) {
    bhpItemObj.get(args);
};

let bhpOut = function bhpOut(...args) {
    bhpOutObj.get(args);
};

let unit = function unit(page = false, callbackSuccess = false, callbackError = false, sortBy = []) {
    let resource = 'unit';
    let url = resource + (page !== false ? '?page=' + page : '/all');

    get(url, function(data) {
        if(callbackSuccess !== false) {
            callbackSuccess(data);
        }
    });
};

let user = function user(page = false, callbackSuccess = false, callbackError = false) {
    let resource = 'user';
    let url = resource + (page !== false ? '?page=' + page : '/all');

    get(url, function(data) {
        if(callbackSuccess !== false) {
            callbackSuccess(data);
        }
    });
};

let search = function(resource) {
    let section = $(document).find(`[data-object="${resource}"]`).find('section');

    $(section).find('.resource-item').each(function(key, value) {
        let row = $(this).closest('tr');
        let url;

        switch(resource) {
            case 'bhpOut':
                url = api + 'bhpItem/search/{query}';

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
                    return settings;
                },
                onResponse: function(response) {
                    let convertedResponse = {
                        results : []
                    };

                    switch(resource) {
                        case 'bhpOut':
                            $.each(response, function(index, item) {
                                convertedResponse.results.push({
                                    title       : '<small>' + item.id + '</small> ' + item.name,
                                    description : '',
                                    item_id     : item.id,
                                    unit        : item.unit.short_name
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
                switch(resource) {
                    case 'bhpOut':
                        $('input[name="item_id"]', row).val(result.item_id);
                        $('input[name="unit"]', row).val(result.unit);

                        break;
                }
            }
        });
    });
};

$(document).ready(() => {
    $(document).on('click', '.action-add', function() {
        let element = $(this).data('element');

        switch(element) {
            case 'bhpItem':
                bhpItemObj.add();

                break;
            case 'bhpOut':
                bhpOutObj.add();

                break;
        }
    });

    $(document).on('click', '.action-add-row', function() {
        let resource = $(this).closest('.modal').attr('data-object');
        let tbody = $(this).closest('table').find('tbody');
        let row;

        switch(resource) {
            case 'bhpOut':
                row = $(`<tr>
                            <td>
                                <i class="tim-icons icon-simple-remove action-remove-row btn-link btn-icon btn-sm"></i>
                            </td>
                            <td>
                                <div class="ui search resource-item">
                                    <input class="form-control prompt" type="text" placeholder="Wyszukaj materiał BHP" autocomplete="off">
                                </div>
                            </td>
                            <td>
                                <input class="form-control" name="quantity" type="number" step="1" min="1" value="1" required>
                            </td>
                            <td>
                                <input class="form-control" name="unit" type="text" disabled>
                            </td>
                            <input type="hidden" name="item_id">
                        </tr>`);

                let element = $(row).appendTo(tbody);
                $(element).find('.prompt').focus();

                search(resource);

                break;
        }
    });

    $(document).on('click', '.action-remove', function() {
        let resource = $(this).closest('table').attr('data-resource');
        let element = $(this).closest('tr').attr('data-element-id');

        del(resource, element, function(data) {
            notification.success('Element został usunięty');

            refetch(resource);
        }, function(data) {
            notification.error('Nie można usunąć elementu, ponieważ posiada inne przypisane elementy!');
        });
    });

    $(document).on('click', '.action-edit', function() {
        let resource = $(this).closest('table').attr('data-resource');
        let element = $(this).closest('tr').attr('data-element-id');

        switch(resource) {
            case 'bhpItem':
                bhpItemObj.edit(element);
                break;
        }
    });

    $(document).on('click', 'button[data-action="submit"]', function() {
        $(this).closest('[data-object]').find('form').submit();
    });

    $(document).on('submit', 'form[data-type="add"]', function(e) {
        e.preventDefault();

        let element = $(this).closest('.modal').data('object');
        let form = $(this).closest('.modal').find('form');

        switch(element) {
            case 'bhpItem':
                bhpItemObj.store(form);

                break;
            case 'bhpOut':
                bhpOutObj.store(form);

                break;
        }
    });

    $(document).on('submit', 'form[data-type="edit"]', function(e) {
        e.preventDefault();

        let element = $(this).closest('.modal').data('object');
        let form = $(this).closest('.modal').find('form');

        switch(element) {
            case 'bhpItem':
                bhpItemObj.update(form);

                break;
        }
    });

    $(document).on('click', '.clickable td:not(:last-child)', function() {
        let resource = $(this).closest('table').data('resource');
        let id = $(this).closest('tr').data('element-id');

        switch(resource) {
            case 'bhpOut':
                bhpOutObj.show(id);

                break;
            case 'bhpUsersStocksItem':
                bhpUsersStocksItemObj.show(id);

                break;
        }
    });
});
