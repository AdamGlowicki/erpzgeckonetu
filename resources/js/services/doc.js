class Doc {
    constructor() {
        this.resource = 'doc';
    }

    add() {
        let el = $(`<div class="modal" tabindex="-1" role="dialog" data-element="doc">
            <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fa fa-file mr-2"></i>Dodawanie dokumentu</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="card animated fadeIn">
                            <div class="card-body">
                                <form role="form" class="form-horizontal" data-element="doc" autocomplete="off" data-type="add">
                                    <div class="form-group row">
                                        <label for="name" class="col-4 col-form-label">Nazwa dokumentu *</label>
                                        <div class="col-8">
                                            <input name="title" type="text" class="form-control" autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="active" class="col-4 col-form-label">Plik *</label>
                                        <div class="col-8">
                                            <div class="fileinput fileinput-new" data-provides="fileinput">
                                                <span class="btn btn-outline-secondary btn-file">
                                                    <span class="fileinput-new">Wybierz plik</span>
                                                    <span class="fileinput-exists">Zmień</span>
                                                    <input type="file" name="file">
                                                </span>
                                                <div>
                                                    <span class="fileinput-filename"></span>
                                                </div>
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
                        <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="doc">Dodaj</button>
                    </div>
                </div>
            </div>
        </div>`);

        search(this.resource);

        $('body', document).append(el);
        $(el).modal();
    }

    edit(id) {
        get(`${this.resource}/${id}/edit`, function(response) {
            let parent = response;

            let el = $(`<div class="modal" tabindex="-1" role="dialog" data-element="doc">
                <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"><i class="fa fa-file mr-2"></i>Edycja pliku</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="card animated fadeIn">
                                <div class="card-body">
                                    <form role="form" class="form-horizontal" data-element="doc" autocomplete="off" data-type="edit">
                                        <div class="form-group row">
                                        <label for="name" class="col-4 col-form-label">Nazwa dokumentu *</label>
                                        <div class="col-8">
                                            <input name="title" type="text" class="form-control" autocomplete="off" value="${response.title}">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="active" class="col-4 col-form-label">Plik *</label>
                                        <div class="col-8">
                                            <div class="fileinput fileinput-exists" data-provides="fileinput">
                                                <span class="btn btn-outline-secondary btn-file">
                                                    <span class="fileinput-new">Wybierz plik</span>
                                                    <span class="fileinput-exists">Zmień</span>
                                                    <input type="file" name="file">
                                                </span>
                                                <span class="fileinput-filename"></span>
                                            </div>
                                            <div>
                                                <span>${response.file[0].name}</span>
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
                            <button type="button" class="btn btn-primary" data-action="submit" data-type="edit" data-form="doc">Zapisz</button>
                        </div>
                    </div>
                </div>
            </div>`);

            $('body', document).append(el);
            $(el).modal();
        });
    }

    show(id) {
        let resource = this.resource;

        get(`${resource}/${id}`, function(response) {
            download(`${resource}/${response.id}/file/${response.file[0].id}`, response.file[0].name);
        });
    }

    store(form) {
        let resource = this.resource;

        let data = new FormData();

        data.append('title', $(`[name="title"]`, form).val());
        data.append('file', $(`[name="file"]`, form)[0].files[0]);

        post(resource, data, function(response) {
            let modal = $(form).closest('.modal');

            $(modal).modal('hide');
            $(modal).remove();

            refetch(resource);

            notification.success('Dokument został dodany');
        }, function(response) {
            let msg = 'Dokument nie został dodany';

            parseErrors(form, response, msg);
        });
    }

    update(id, form) {
        let resource = this.resource;

        let data = new FormData();

        data.append('title', $(`[name="title"]`, form).val());
        data.append('file', $(`[name="file"]`, form)[0].files[0]);

        put(`${resource}/${id}`, data, function(response) {
            let modal = $(form).closest('.modal');

            $(modal).modal('hide');
            $(modal).remove();

            refetch(resource);

            notification.success('Dokument został zaktualizowany');
        }, function(response) {
            let msg = 'Dokument nie został zaktualizowany';

            parseErrors(form, response, msg);
        });
    }
}

let _doc = new Doc();

let doc = function doc(page = false, callbackSuccess = false, callbackError = false, sortBy = []) {
    let resource = 'doc';
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
                    <td>${value.title}</td>
                    <td>${userAvatar(value.user)} ${value.user.name}</td>
                    <td>${value.created_at}</td>
                    <td>${value.updated_at}</td>
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
            case 'doc':
                _doc.add();

                break;
        }
    });

    $(document).on('click', '.action-edit', function() {
        let element = $(this).closest('table').attr('data-resource');
        let id = $(this).closest('tr').attr('data-element-id');

        editable_id = id;

        switch(element) {
            case 'doc':
                _doc.edit(id);

                break;
        }
    });

    $(document).on('click', '.clickable td:not(:last-child)', function() {
        let resource = $(this).closest('table').attr('data-resource');
        let id = $(this).closest('tr').attr('data-element-id');


        switch(resource) {
            case 'doc':
                _doc.show(id);

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
            case 'doc':
                _doc.store(form);

                break;
        }
    });

    $(document).on('submit', 'form[data-type="edit"]', function(e) {
        e.preventDefault();

        let element = $(this).closest('.modal').data('element');
        let form = $(this).closest('.modal').find('form');
        let id = editable_id;

        switch(element) {
            case 'doc':
                _doc.update(id, form);

                break;
        }
    });

    $(document).on('click', '.action-remove', function() {
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
});
