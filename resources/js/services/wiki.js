class Wiki {
    constructor() {
        this.content = null;

        this.data = {};
        this.data.resource = 'wiki';
        this.data.id = null;
        this.data.info = null;
    }

    get resource() {
        return this.data.resource;
    }

    get id() {
        return this.data.id;
    }

    add() {f
        let el = $(`<div class="modal" tabindex="-1" role="dialog" data-element="wiki">
            <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title"><i class="fa fa-book mr-2"></i>Dodawanie artykułu</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div class="modal-body">
                    <div class="card animated fadeIn">
                        <div class="card-body">
                            <form role="form" class="form-horizontal" data-element="wiki" data-type="add">
                                <div class="form-group has-label">
                                    <label>Tytuł *</label>
                                    <input class="form-control" name="title" type="text" minlength="1" aria-label="Tytuł">
                                </div>
                                <div class="form-group has-label">
                                    <label>Treść *</label>
                                    <textarea class="form-control" name="content" type="text" minlength="1" aria-label="Treść"></textarea>
                                </div>
                            </form>
                            <div class="category form-category">* Pola wymagane</div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                    <button type="button" class="btn btn-primary" data-action="submit" data-type="add" data-form="wiki">Dodaj</button>
                </div>
              </div>
            </div>
        </div>`);

        $('body', document).append(el);

        let textarea = $(el).find('textarea');

        sceditor.create(textarea[0], {
            format: 'xhtml',
            style: 'assets/js/plugins/sceditor/themes/content/modern.min.css',
            locale: 'pl-PL',
            emoticonsRoot: 'assets/js/plugins/sceditor/',
        });

        this.content = sceditor.instance(textarea[0]);

        $(el).modal();
    }

    edit(id) {
        let resource = this.resource;
        let parent = this;

        get(`${resource}/${id}/edit`, function(response) {
            let el = $(`<div class="modal" tabindex="-1" role="dialog" data-element="wiki" data-id="${response.id}">
                <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title"><i class="fa fa-book mr-2"></i>Edycja artykułu: <strong>${response.title}</strong></h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                    <div class="modal-body">
                        <div class="card animated fadeIn">
                            <div class="card-body">
                                <form role="form" class="form-horizontal" data-element="wiki" data-type="edit">
                                    <div class="form-group has-label">
                                        <label>Tytuł *</label>
                                        <input class="form-control" name="title" type="text" minlength="1" aria-label="Tytuł" value="${response.title}">
                                    </div>
                                    <div class="form-group has-label">
                                        <label>Treść *</label>
                                        <textarea class="form-control" name="content" type="text" minlength="1" aria-label="Treść">${response.content}</textarea>
                                    </div>
                                </form>
                                <div class="category form-category">* Pola wymagane</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                        <button type="button" class="btn btn-primary" data-action="submit" data-type="edit" data-form="wiki">Zapisz</button>
                    </div>
                  </div>
                </div>
            </div>`);

            $('body', document).append(el);

            let textarea = $(el).find('textarea');

            sceditor.create(textarea[0], {
                format: 'xhtml',
                style: 'assets/js/plugins/sceditor/themes/content/default.min.css',
                locale: 'pl-PL',
                emoticonsRoot: 'assets/js/plugins/sceditor/',
            });

            parent.content = sceditor.instance(textarea[0]);

            $(el).modal();
        });
    }

    show(id) {
        let resource = this.resource;

        get(`${resource}/${id}`, function(response) {
            let el = $(`<div class="modal" tabindex="-1" role="dialog" data-element="wiki">
                <div class="modal-dialog modal-xlg animated fadeInDown" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title"><i class="fa fa-book mr-2"></i>${response.title}</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                    <div class="modal-body">
                        <div class="card animated fadeIn">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col" data-object="content">
                                       ${response.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
                    </div>
                  </div>
                </div>
            </div>`);

            $('body', document).append(el);

            $(el).modal();
        }, function(error) {
            notification.error('Nie udało się odnaleźć artykułu');
        });
    }

    store(form) {
        let resource = this.resource;
        let button = $(form).closest('.modal-content').find('button[data-action="submit"]');

        $(button).prop('disabled', true);

        let data = {
            title: $('[name="title"]', form).val(),
            body: (this.content).val(),
        };

        post(resource, data, function(response) {
            let modal = $(form).closest('.modal');

            $(modal).modal('hide');
            $(modal).remove();

            refetch(resource);

            notification.success('Artykuł został dodany');
        }, function(response) {
            $(button).prop('disabled', false);

            let msg = 'Wystąpił błąd podczas dodawania artykułu';

            parseErrors(form, response, msg);
        });
    }

    update(form, id) {
        let resource = this.resource;
        let button = $(form).closest('.modal-content').find('button[data-action="submit"]');

        $(button).prop('disabled', true);

        let data = {
            title: $('[name="title"]', form).val(),
            body: (this.content).val(),
        }

        put(`${resource}/${id}`, data, function(response) {
            let modal = $(form).closest('.modal');

            $(modal).modal('hide');
            $(modal).remove();

            refetch(resource);

            notification.success('Artykuł został zaktualizowany');
        }, function(response) {
            $(button).prop('disabled', false);

            let msg = 'Wystąpił błąd podczas aktualizacji artykułu';

            parseErrors(form, response, msg);
        })
    }
}

let wikiObj = new Wiki();

let wiki = function wiki(page = false, callbackSuccess = false, callbackError = false, sortBy = []) {
    let resource = 'wiki';
    let sortable = Object.keys(sortBy).length > 0;
    let url = resource + (sortable ? '/sort/' + sortBy[0] + '/' + sortBy[1] : '') + (page !== false ? '?page=' + page : '/all');

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
                    <td>${value.updated_at ? value.updated_at : ''}</td>
                    <td>
                        <i class="tim-icons icon-pencil action-edit font-weight-bold"></i>
                        <i class="tim-icons icon-simple-remove action-remove font-weight-bold"></i>
                        <!-- <i class="fa fa-file-pdf action-doc font-weight-bold"></i> -->
                    </td>
                </tr>`;

                $('tbody', table).append(row);
            });
        }

        sort(resource, sortBy);
        pagination(resource, data);
        onFirstLoad(resource);
    });
};


$(document).ready(() => {
    $(document).on('click', '.action-add', function() {
        let element = $(this).data('element');

        switch(element) {
            case 'wiki':
                wikiObj.add();

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
            case 'wiki':
                wikiObj.edit(element);
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
            case 'wiki':
                wikiObj.store(form);

                break;
        }
    });

    $(document).on('submit', 'form[data-type="edit"]', function(e) {
        e.preventDefault();

        let element = $(this).closest('.modal').data('element');
        let form = $(this).closest('.modal').find('form');
        let id = $(this).closest('.modal').data('id');

        switch(element) {
            case 'wiki':
                wikiObj.update(form, id);

                break;
        }
    });

    $(document).on('click', '.clickable td:not(:last-child)', function() {
        let resource = $(this).closest('table').data('resource');
        let id = $(this).closest('tr').data('element-id');

        switch(resource) {
            case 'wiki':
                wikiObj.show(id);

                break;
        }
    });
});
