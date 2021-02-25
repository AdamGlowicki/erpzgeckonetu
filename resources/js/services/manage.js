class AdminRole {
    add() {

    }

    show(id) {

    }

    store(form) {

    }
}

class AdminUser {
    constructor() {
        this.resource = 'admin/user';
    }

    add() {
        let el = $(`<div class="modal" tabindex="-1" role="dialog" data-element="admin/user">
            <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fa fa-user mr-2"></i>Dodawanie użytkownika</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="card animated fadeIn">
                            <div class="card-body">
                                <form role="form" class="form-horizontal" data-element="admin/user" autocomplete="off" data-type="add">
                                    <div class="form-group row">
                                        <label for="name" class="col-4 col-form-label">Imię i nazwisko *</label>
                                        <div class="col-8">
                                            <input name="name" type="text" class="form-control" autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="username" class="col-4 col-form-label">Nazwa użytkownika *</label>
                                        <div class="col-8">
                                            <input name="username" placeholder="np. login@domena.pl" type="text" required="required" class="form-control">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="password" class="col-4 col-form-label">Hasło *</label>
                                        <div class="col-8">
                                            <input name="password" readonly="readonly" type="text" required="required" class="form-control">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="email" class="col-4 col-form-label">E-mail</label>
                                        <div class="col-8">
                                            <input name="email" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="phone" class="col-4 col-form-label">Nr telefonu</label>
                                        <div class="col-8">
                                            <input name="phone" placeholder="np. +48525777777" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="role_id" class="col-4 col-form-label">Rola *</label>
                                        <div class="col-8">
                                            <select name="role_id" class="custom-select form-control"></select>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="active" class="col-4 col-form-label">Aktywny *</label>
                                        <div class="col-8">
                                            <select name="active" class="custom-select form-control">
                                                <option value="0">Nie</option>
                                                <option value="1">Tak</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                                <div class="category form-category">* Pola wymagane</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                        <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="admin/user">Dodaj</button>
                    </div>
                </div>
            </div>
        </div>`);

        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';

        for(let i = 0; i < 8; i++) {
            password += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        $(`[name="password"]`, el).val(password);

        admin_role(false, function(response) {
            let select = $(`[name="role_id"]`, el);

            $.each(response, function(k,v) {
                $(select).append(`<option value="${v.id}">${v.name}</option>`);
            });
        });

        search(this.resource);

        $('body', document).append(el);
        $(el).modal();
    }

    edit(id) {
        get(`${this.resource}/${id}/edit`, function(response) {
            let parent = response;

            let el = $(`<div class="modal" tabindex="-1" role="dialog" data-element="admin/user">
                <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"><i class="fa fa-user mr-2"></i>Edycja użytkownika</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="card animated fadeIn">
                                <div class="card-body">
                                    <form role="form" class="form-horizontal" data-element="admin/user" autocomplete="off" data-type="edit">
                                        <div class="form-group row">
                                            <label for="name" class="col-4 col-form-label">Imię i nazwisko *</label>
                                            <div class="col-8">
                                                <input name="name" type="text" class="form-control" autocomplete="off" value="${response.name}">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="username" class="col-4 col-form-label">Nazwa użytkownika *</label>
                                            <div class="col-8">
                                                <input name="username" placeholder="np. login@domena.pl" type="text" required="required" class="form-control" value="${response.username}">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="password" class="col-4 col-form-label">Hasło *</label>
                                            <div class="col-8">
                                                <input name="password" placeholder="podaj nowe hasło, aby je zmienić" type="text" required="required" class="form-control">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="email" class="col-4 col-form-label">E-mail</label>
                                            <div class="col-8">
                                                <input name="email" type="text" class="form-control" value="${response.email}">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="phone" class="col-4 col-form-label">Nr telefonu</label>
                                            <div class="col-8">
                                                <input name="phone" placeholder="np. +48525777777" type="text" class="form-control" value="${response.phone}">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="role_id" class="col-4 col-form-label">Rola *</label>
                                            <div class="col-8">
                                                <select name="role_id" class="custom-select form-control"></select>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="active" class="col-4 col-form-label">Aktywny *</label>
                                            <div class="col-8">
                                                <select name="active" class="custom-select form-control">
                                                    <option value="0">Nie</option>
                                                    <option value="1">Tak</option>
                                                </select>
                                            </div>
                                        </div>
                                    </form>
                                    <div class="category form-category">* Pola wymagane</div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                            <button type="button" class="btn btn-primary" data-action="submit" data-type="edit" data-form="admin/user">Zapisz</button>
                        </div>
                    </div>
                </div>
            </div>`);

            admin_role(false, function(response) {
                let select = $(`[name="role_id"]`, el);

                $.each(response, function(k,v) {
                    $(select).append(`<option value="${v.id}">${v.name}</option>`);
                });

                if(Object.keys(parent.roles).length > 0) {
                    $(select).find(`option[value="${parent.roles[0].id}"]`).prop('selected', true);
                }
            });

            $(`[name="active"]`, el).find(`option[value="${parent.active}"]`).prop('selected', true);

            $('body', document).append(el);
            $(el).modal();
        });
    }

    show(id) {

    }

    store(form) {
        let resource = this.resource;

        let data = {
            name: $(`[name="name"]`, form).val(),
            username: $(`[name="username"]`, form).val(),
            password: $(`[name="password"]`, form).val(),
            email: $(`[name="email"]`, form).val(),
            phone:  $(`[name="phone"]`, form).val(),
            role_id: $(`[name="role_id"]`, form).val(),
            active: $(`[name="active"]`, form).val(),
        }

        post(resource, data, function(response) {
            let modal = $(form).closest('.modal');

            $(modal).modal('hide');
            $(modal).remove();

            refetch(resource);

            notification.success('Użytkownik został dodany');
        }, function(response) {
            let msg = 'Użytkownik nie został dodany';

            parseErrors(form, response, msg);
        });
    }

    update(id, form) {
        let resource = this.resource;

        let data = {
            name: $(`[name="name"]`, form).val(),
            username: $(`[name="username"]`, form).val(),
            password: $(`[name="password"]`, form).val(),
            email: $(`[name="email"]`, form).val(),
            phone:  $(`[name="phone"]`, form).val(),
            role_id: $(`[name="role_id"]`, form).val(),
            active: $(`[name="active"]`, form).val(),
        }

        put(`${resource}/${id}`, data, function(response) {
            let modal = $(form).closest('.modal');

            $(modal).modal('hide');
            $(modal).remove();

            refetch(resource);

            notification.success('Użytkownik został zaktualizowany');
        }, function(response) {
            let msg = 'Użytkownik nie został zaktualizowany';

            parseErrors(form, response, msg);
        });
    }
}

class AdminPermission {

}

let adminRole = new AdminRole();
let adminUser = new AdminUser();
let adminPermission = new AdminPermission();

let admin_user = function admin_user(page = false, callbackSuccess = false, callbackError = false, sortBy = []) {
    let resource = 'admin/user';
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
                    <td>${Object.keys(value.roles).length > 0 ? value.roles[0].name : ''}</td>
                    <td>${value.username}</td>
                    <td>${value.email}</td>
                    <td>${value.phone}</td>
                    <td>${value.active ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>'}</td>
                    <td>${value.updated_at}</td>
                    <td>${value.password_changed_at}</td>
                    <td>
                        <i class="tim-icons icon-pencil action-edit font-weight-bold"></i>
                        <!-- <i class="tim-icons icon-simple-remove action-remove font-weight-bold"></i> -->
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

let admin_role = function admin_role(page = false, callbackSuccess = false, callbackError = false, sortBy = []) {
    let resource = 'admin/role';
    let sortable = Object.keys(sortBy).length > 0;
    let url = resource + (sortable ? '/' + sortBy[1] + '/' + sortBy[0] : '') + (page !== false ? '?page=' + page : '');

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


let admin_permission = function admin_permission(page = false, callbackSuccess = false, callbackError = false, sortBy = []) {
    let resource = 'admin/permission';
    let sortable = Object.keys(sortBy).length > 0;
    let url = resource + (sortable ? '/' + sortBy[1] + '/' + sortBy[0] : '') + (page !== false ? '?page=' + page : '');

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
            case 'admin/user':
                adminUser.add();

                break;
            case 'admin/role':
                adminRole.add();

                break;
        }
    });

    $(document).on('click', '.action-edit', function() {
        let element = $(this).closest('table').attr('data-resource');
        let id = $(this).closest('tr').attr('data-element-id');

        editable_id = id;

        switch(element) {
            case 'admin/user':
                adminUser.edit(id);

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
            case 'admin/user':
                adminUser.store(form);

                break;
        }
    });

    $(document).on('submit', 'form[data-type="edit"]', function(e) {
        e.preventDefault();

        let element = $(this).closest('.modal').data('element');
        let form = $(this).closest('.modal').find('form');
        let id = editable_id;

        switch(element) {
            case 'admin/user':
                adminUser.update(id, form);

                break;
        }
    });
});
