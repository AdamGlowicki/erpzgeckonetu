"use strict";

const storage = 'storage/';
const filePrefix = 'ERP_';

let sorting = {};
let searching = {};
let paging = {};
let searchTimeout = null;
let related;

let editable_id;
let clickable_id;
let clickable_params = [];

let permissionsCache = [];
let roleCache;

class Role {
    has(role) {
        return role === roleCache;
    }
}

class Permission {
    has(permission) {
        return $.inArray(permission, permissionsCache) > -1;
    }
}

class File {
    delete(id) {
        del(`file/${id}`, function(response) {
            notification.success('Plik został usunięty');
        }, function(response) {
            notification.error('Wystąpił błąd podczas usuwania pliku');
        });
    }
}

class Investment {
    constructor() {
        this.data = {};
        this.data.resource = 'investment';
        this.data.id = null;
    }

    get resource() {
        return this.data.resource;
    }

    get id() {
        return this.data.id;
    }

    parseStatus(status) {
        switch(status) {
            case 0:
                return 'Zaplanowana';
            case 1:
                return 'W realizacji';
            case 2:
                return 'Wstrzymana';
            case 3:
                return 'Zrealizowana';
            case 4:
                return 'Anulowana';
            default:
                return 'brak statusu'
        }
    }

    show(id) {
        let url = `investment/${id}`;
        let modal = $('[data-element="data-investment-show"]');

        get(url, function(data) {
            $('.investment', modal).html(`<strong>Numer inwestycji: </strong>${data.investment_name}<br>${data.name}`);
            $('.investment_name', modal).html(`${data.investment_name} (${data.name})`);
            $('.user', modal).html(`${data.user.name}`);
            $('.notes', modal).html(`${data.notes ? data.notes : '-'}`);
            $('.date', modal).html(`${data.created_at}`);

            $('table > tbody', modal).empty();

            $.each(data.investments_item, function(key, value) {
                let row = `<tr>
                    <td>${value.id}</td>
                    <td>${value.item.id}</td>
                    <td>${value.item.items_manufacturer.name}</td>
                    <td>${value.item.model_name}</td>
                    <td>${value.quantity}</td>
                    <td>${value.item.unit.short_name}</td>
                </tr>`;

                $('table > tbody', modal).append(row);

                if(value.item.has_data) {
                    let ths = $('table > thead', modal).find('th');
                    let count = Object.keys(ths).length;

                    let el = `<tr><td></td><td></td><td colspan="${count-2}">`;
                    let i = 0;

                    $.each(value.element, function(k, v) {
                        i++;
                        el = el + '<strong>' + i + `</strong>. S/N: ${v.sn} MAC: ${v.mac}<br>`;
                    });

                    el = el + `</td></tr>`;

                    $('table > tbody', modal).append(el);
                }
            });

            $(modal).modal();
        }, function(data) {
            notification.error('Inwestycja nie posiada stanu w ERP lub nie istnieje');
        });
    }

    store(form) {
        let object = this;
        let button = $(form).closest('.modal-content').find('[data-action="submit"]');
        let modal = $(form).closest('.modal');
        let resource = object.resource;

        $(button).prop('disabled', true);

        let data = new FormData();

        let items = [];
        let items_ids = [];
        let errors = 0;

        $('table > tbody', form).find('tr').each(function() {
            let item_id = $('[name="item_id"]', $(this)).val();
            let quantity = $('[name="quantity"]', $(this)).val();
            let add_to_request = $('[name="add_to_request"]', $(this)).prop('checked') ? 1 : 0;

            items.push({
                add_to_request: add_to_request,
                item_id: item_id,
                quantity: quantity
            });

            if($.inArray(item_id, items_ids) !== -1) {
                notification.error('Materiały nie mogą się powtarzać!');
                errors++;
                return false;
            }

            items_ids.push(item_id);
        });

        if(errors) {
            $(button).prop('disabled', false);
            return;
        }

        let input = {
            investment_id: $('[name="investment_id"]', form).val(),
            investment_name: $('[name="investment_name"]', form).val(),
            num_city: $('[name="num_city"]', form).val(),
            num_type: $('[name="num_type"]', form).val(),
            name: $('[name="name"]', form).val(),
            car_id: $('[name="car_id"]', form).val(),
            warehouse_id: $('[name="warehouse_id"]', form).val(),
            date_start: $('[name="date_start"]', form).val(),
            date_end: $('[name="date_end"]', form).val(),
            descr: $('[name="descr"]', form).val(),
            request_create: $('[name="request_create"]', form).prop('checked') ? 1 : 0,
            items: JSON.stringify(items)
        };

        $.each(input, function(k,v) {
            data.append(k,v);
        });

        let files = $('input[name="file"]', form);

        if($(files).get(0).files !== null) {
            if(Object.keys($(files).get(0).files).length > 0) {
                $.each($(files).get(0).files, function(k,v) {
                    data.append('file[]', v);
                });
            }
        }

        post(resource, data, function(data) {
            notification.success('Inwestycja została dodana!');

            $(modal).modal('hide');
            $(form)[0].reset();

            refetch(resource);

            $(button).prop('disabled', false);
        }, function(data) {
            notification.error('Inwestycja nie została dodana, sprawdź wprowadzone dane.');

            $(button).prop('disabled', false);
        });
    }

    update(id, form) {
        let object = this;
        let button = $(form).closest('.modal-content').find('[data-action="submit"]');
        let modal = $(form).closest('.modal');
        let resource = object.resource;

        $(button).prop('disabled', true);

        let data = new FormData();

        let items = [];
        let items_ids = [];
        let errors = 0;

        $('table > tbody', form).find('tr').each(function() {
            let row = $(this);

            let item_id = $('[name="item_id"]', row).val();
            let quantity = $('[name="quantity"]', row).val();
            let quantity_used = $('[name="quantity_used"]', row).val();
            let comment = $('[name="comment"]', row).val();
            let add_to_request = $('[name="add_to_request"]', row).prop('checked') ? 1 : 0;

            items.push({
                add_to_request: add_to_request,
                item_id: item_id,
                quantity: quantity,
                quantity_used: quantity_used,
                comment: comment
            });

            if($.inArray(item_id, items_ids) !== -1) {
                notification.error('Materiały nie mogą się powtarzać!');
                errors++;
                return false;
            }

            items_ids.push(item_id);
        });

        if(errors) {
            $(button).prop('disabled', false);
            return;
        }

        let input = {
            investment_id: $('[name="investment_id"]', form).val(),
            name: $('[name="name"]', form).val(),
            car_id: $('[name="car_id"]', form).val(),
            warehouse_id: $('[name="warehouse_id"]', form).val(),
            date_start: $('[name="date_start"]', form).val(),
            date_end: $('[name="date_end"]', form).val(),
            descr: $('[name="descr"]', form).val(),
            items: JSON.stringify(items)
        };

        $.each(input, function(k,v) {
            data.append(k,v);
        });

        let files = $('input[name="file"]', form);

        if($(files).get(0).files !== null) {
            if(Object.keys($(files).get(0).files).length > 0) {
                $.each($(files).get(0).files, function(k,v) {
                    data.append('file[]', v);
                });
            }
        }

        let url = `${resource}/${id}`;

        put(url, data, function(data) {
            notification.success('Inwestycja została zaktualizowana!');

            $(modal).modal('hide');
            $(form)[0].reset();

            refetch(resource);

            $(button).prop('disabled', false);
        }, function(data) {
            notification.error('Inwestycja nie została zaktualizowana, sprawdź wprowadzone dane.');

            $(button).prop('disabled', false);
        });
    }
}

class Client {
    show(id) {
        let url = `client/${id}/lms`;
        let modal = $('[data-element="data-client-show"]');

        get(url, function(data) {
            $('.modal-title', modal).html(`<i class="fa fa-user"></i><span class="ml-2">Stan klienta <strong>${data.client_id} / ${data.name}</strong></span>`);

            $('.client', modal).html(`<strong>ID klienta: </strong>${data.client_id}<br>${data.name}<br>${data.address}`);
            $('.client_name', modal).html(`${data.name} (ID: ${data.client_id})`);
            $('.notes', modal).html(`${data.notes ? data.notes : '-'}`);
            $('.date', modal).html(`${data.created_at}`);

            $('table > tbody', modal).empty();

            $.each(data.clients_item, function(key, value) {
                let tbody = `<tr>
                    <td>${value.id}</td>
                    <td>${value.item.id}</td>
                    <td>${value.item.items_manufacturer.name}</td>
                    <td>${value.item.model_name}</td>
                    <td>${value.quantity}</td>
                    <td>${value.item.unit.short_name}</td>
                </tr>`;

                $('table > tbody', modal).append(tbody);

                if(value.item.has_data) {
                    let ths = $('table > thead', modal).find('th');
                    this.count = Object.keys(ths).length;

                    let el = `<tr><td></td><td></td><td colspan="${this.count-2}">`;
                    let i = 0;

                    $.each(value.element, function(k, v) {
                        i++;
                        el = el + '<strong>' + i + `</strong>. S/N: ${v.sn} MAC: ${v.mac}<br>`;
                    });

                    el = el + `</td></tr>`;

                    $('table > tbody', modal).append(el);
                }
            });

            $(modal).modal();
        }, function(data) {
            notification.error('Klient nie posiada stanu w ERP');
        });
    }
}

class Clickable {
    car(modal, resource, id) {
        clickable_params[resource] = {
            modal: modal,
            resource: resource,
            id: id
        };

        let params = parseQuery({
            sortBy: typeof sorting[resource] === 'undefined' ? false : sorting[resource],
            page: typeof paging[resource] === 'undefined' ? false : paging[resource],
            search: typeof searching[resource] === 'undefined' ? false : searching[resource],
        });

        params = '?' + $.param(params);

        let url = `car/${id}/stock` + params;

        get(url, function(data) {
            $('.modal-title', modal).html(`Stan samochodu <strong>${data.car.name} (${data.car.registration})</strong>`);

            $('table > tbody', modal).empty();

            let count = 0;

            if(Object.keys(data.items.data).length < 1) {
                let ths = $('table > thead', modal).find('th');

                count = Object.keys(ths).length - 2;
                $('table > tbody', modal).append('<tr><td colspan="' + count + '" class="text-center">Brak produktów na stanie</td></tr>');
            }

            let quantity = 0;

            $.each(data.items.data, function(key, value) {
                let tbody = `<tr ${!parseInt(value.item.has_data) || 'class="clickable"'} data-element-id="${value.id}">
                                <td>${value.item.id}</td>
                                <td>${value.item.photo ? imageThumb(value.item.photo) : ''} ${value.item.model_name}</td>
                                <td>${value.item.items_manufacturer.name}</td>
                                <td>${value.item.items_category.name}</td>
                                <td>${value.quantity}</td>
                                <td>${value.item.unit.short_name}</td>
                                <td></td>
                            </tr>`;

                quantity = quantity + value.quantity;

                $('table > tbody', modal).append(tbody);
            });

            sort(resource, sorting[resource] ? sorting[resource] : []);
            pagination(resource, data.items);
        }, function(data) {
            console.log(data);
        });
    }

    carStockOwn(modal, resource, id) {
        clickable_params[resource] = {
            modal: modal,
            resource: resource,
            id: id
        };

        $('.modal-title', modal).html(`Stan mojego samochodu`);

        let params = parseQuery({
            sortBy: typeof sorting[resource] === 'undefined' ? false : sorting[resource],
            page: typeof paging[resource] === 'undefined' ? false : paging[resource],
            search: typeof searching[resource] === 'undefined' ? false : searching[resource],
        });

        params = '?' + $.param(params);

        let url = `car/stock/own` + params;

        get(url, function(data) {
            $('table > tbody', modal).empty();

            var count = 0;

            if(Object.keys(data.data).length < 1) {
                var ths = $('table > thead', modal).find('th');

                count = Object.keys(ths).length - 2;
                $('table > tbody', modal).append('<tr><td colspan="' + count + '" class="text-center">Brak produktów na stanie</td></tr>');
            }

            var quantity = 0;

            $.each(data.data, function(key, value) {
                var tbody = `<tr ${parseInt(value.item.has_data) ? 'class="clickable"' : ''} data-element-id="${value.id}">
                                <td>${value.item.id}</td>
                                <td>${value.item.photo ? imageThumb(value.item.photo) : ''} ${value.item.model_name}</td>
                                <td>${value.item.items_manufacturer.name}</td>
                                <td>${value.item.items_category.name}</td>
                                <td>${value.quantity}</td>
                                <td>${value.item.unit.short_name}</td>
                                <td></td>
                            </tr>`;

                quantity = quantity + value.quantity;

                $('table > tbody', modal).append(tbody);
            });

            $(modal).modal();

            sort(resource, sorting[resource] ? sorting[resource] : []);
            pagination(resource, data);
        }, function(data) {
            notification.error('Nie jesteś przypisany do żadnej grupy!');
        });
    }

    warehouse(modal, resource, id) {
        clickable_params[resource] = {
            modal: modal,
            resource: resource,
            id: id
        };

        let params = parseQuery({
            sortBy: typeof sorting[resource] === 'undefined' ? false : sorting[resource],
            page: typeof paging[resource] === 'undefined' ? false : paging[resource],
            search: typeof searching[resource] === 'undefined' ? false : searching[resource],
        });

        params = '?' + $.param(params);

        let url = `warehouse/${id}/stock` + params;

        get(url, function(data) {
            $('.modal-title', modal).html(`<i class="fa fa-warehouse mr-1"></i> Stan magazynu: <strong>${data.warehouse.name}</strong>`);

            $('table > tbody', modal).empty();

            let count = 0;

            if(Object.keys(data.items.data).length < 1) {
                let ths = $('table > thead', modal).find('th');

                count = Object.keys(ths).length;
                $('table > tbody', modal).append(`<tr><td colspan="${count}" class="text-center">Brak produktów w magazynie</td></tr>`);
            }

            let quantity = 0;

            $.each(data.items.data, function(key, value) {
                let tbody = `<tr ${!parseInt(value.item.has_data) || 'class="clickable"'} data-element-id="${value.id}">
                    <td>${value.item_id}</td>
                    <td>${value.warehouses_place ? value.warehouses_place.name : ''}</td>
                    <td>${value.item.items_manufacturer.name}</td>
                    <td>${value.item.model_name}</td>
                    <td>${value.item.items_category.name}</td>
                    <td>${value.quantity}</td>
                    <td>${value.item.unit.short_name}</td>
                    <td></td>
                </tr>`;

                quantity = quantity + value.quantity;

                $('table > tbody', modal).append(tbody);
            });

            sort(resource, sorting[resource] ? sorting[resource] : []);
            pagination(resource, data.items);
        }, function(data) {
            console.log(data);
        });
    }
}

class User {
    constructor() {
        this.data = {};
    }

    init() {
        let parent = this;

        get('profile', function(r) {
            parent.data.id = r.data.id;
            parent.data.name = r.data.name;
            parent.data.avatar = r.data.avatar;

            $('.username-div > strong').html(parent.data.name);

            Echo.private(`App.User.${userObj.id}`).notification((n) => {
                notify.parse(n);
            });

            avatar();
        });
    }

    get id() {
        return this.data.id;
    }

    get name() {
        return this.data.name;
    }

    get avatar() {
        return this.data.avatar;
    }
}

let userObj = new User();

let parseArgs = function parseArgs(args, defaults) {
    let argList = {};

    argList.page = typeof args[0] === 'undefined' ? defaults[0] : args[0];
    argList.callbackSuccess = typeof args[1] === 'undefined' ? defaults[1] : args[1];
    argList.callbackError = typeof args[2] === 'undefined' ? defaults[2] : args[2];
    argList.sortBy = typeof args[3] === 'undefined' ? defaults[3] : args[3];
    argList.search = typeof args[4] === 'undefined' ? defaults[4] : args[4];

    return argList;
};

let parseQuery = function parseQuery(args) {
    let query = {};

    if(args.page !== false) {
        query['page'] = args.page;
    }

    if(args.sortBy !== false) {
        query['sortDir'] = args.sortBy[0];
        query['sortCol'] = args.sortBy[1];
    }

    if(args.search !== false) {
        query['q'] = args.search;
    }

    return query;
};

let object = function object(className) {
    return new className();
};

let modal = function modal(element) {
    $(element).modal();
};

let validateItemData = function validateItemData(data) {
    let pairs = [];

    $.each(data, function(k,v) {
        pairs.push({
            sn: v.sn,
            mac: v.mac
        });
    });

    pairs = pairs.filter((pair, index, self) =>
        index === self.findIndex((t) => (
            t.sn === pair.sn && t.mac === pair.mac
        ))
    );

    if(Object.keys(pairs).length !== Object.keys(data).length) {
        return false;
    }

    return true;
};

let trimItemData = function trimItemData(data) {
    $.each(data, function(k,v) {
        data[k].sn = $.trim(data[k].sn);
        data[k].mac = $.trim(data[k].mac);
    });

    return data;
};

let session = function session() {
    Cookies.set('apiToken', Cookies.get('apiToken'), { expires: 1/24 });
    Cookies.set('userId', Cookies.get('userId'), { expires: 1/24 });
};

let userAvatar = function userAvatar(user) {
    return `<img class="photo mr-1" src="${storage + user.avatar}" alt="">`;
};

let imageThumb = function imageThumb(image) {
    return `<img class="photo thumb mr-1" src="${storage + image}" alt="">`;
};

let avatar = () => {
    $('.photo > img').attr('src', storage + userObj.avatar).addClass('animated fadeIn').removeClass('hidden');
};

let stringToHslColor = (str, s = 40, l = 50) => {
    let hash = 0;

    for(let i = 0; i < str.length; i++) {
        hash = hash + str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let h = hash % 360;

    return `hsl(${h}, ${s}%, ${l}%)`;
};

let priority = function priority(value) {
    switch(value) {
        case 0:
            return '<span class="text-info">niski</span>';
        case 1:
            return '<span class="text-primary">normalny</span>';
        case 2:
            return '<span class="text-danger">wysoki</span>';
    }
};

let notifications = () => {
    get('profile/notifications', (data) => {
        $.each(data.reverse(), function(k,v) {
            notify.parse(v, false);
        });
    }, (data) => {
        console.log(data);
    });
};

let sort = (resource, sortBy) => {
    if(!(Object.keys(sortBy).length > 0)) {
        return;
    }

    $(`table[data-resource="${resource}"] > thead`).find('th[data-sortable]').each(function(key, value) {
        $(this).children('i').remove();

         let column = $(this).attr('data-sortable');

         if(sortBy[1] === column) {
             let item = $(this).html();

             switch(sortBy[0]) {
                 case 'asc':
                     $(this).attr('data-direction', 'asc');
                     $(this).html(`${item} <i class="fas fa-sort-up"></i>`);

                     break;
                 case 'desc':
                     $(this).attr('data-direction', 'desc');
                     $(this).html(`${item} <i class="fas fa-sort-down"></i>`);

                     break;
             }
         }
     });
};

let pagination = (resource, data) => {
    let nav = $(`nav[data-resource="${resource}"]`);

    let list = $(`ul`, nav);
    let records = $(list).closest('.animated').find('[data-type="records"]');

    $(records).html(`Rekordy od <strong>${data.from = data.from || 0}</strong> do <strong>${data.to = data.to || 0}</strong> z <strong>${data.total}</strong>`);

    $(list).empty();
    $(list).append(`<li class="${(data.current_page === 1) ? 'disabled ' : ''}page-item"><a class="page-link page-item-prev">Poprzednia</a></li>`);

    for(let i=data.current_page-5; i <= data.current_page; i++) {
        if(i > 0) {
            $(list).append(`<li class="${(i === data.current_page) ? 'active ' : ''}page-item"><a class="page-link page-item-num">${i}</a></li>`);
        }
    }

    for(let i=data.current_page+1; i <= data.current_page+5; i++) {
        if(i <= data.last_page) {
            $(list).append(`<li class="${(i === data.current_page) ? 'active ' : ''}page-item"><a class="page-link page-item-num">${i}</a></li>`);
        }
    }

    $(list).append(`<li class="${(data.current_page === data.last_page) ? 'disabled ' : ''}page-item"><a class="page-link page-item-next">Następna</a></li>`);
};

let pdf = (data, fileName) => {
    const linkSource = `data:application/pdf;base64,${data}`;
    const downloadLink = document.createElement("a");

    downloadLink.href = linkSource;
    downloadLink.download = filePrefix + fileName;
    downloadLink.click();
};

let refetch = (resource) => {
    $(`nav[data-type="pagination"][data-resource="${resource}"]`).find('.active > a').trigger('click');

    reloadRelatedData();
};

let reloadRelatedData = () => {
    if(typeof related === 'undefined' || related === null) {
        return;
    }

    if(related.length) {
        $(`.action-add[data-element="${related}"]`).trigger('click');
    }

    related = null;
};

let logout = () => {
    post('logout', {}, function(data) {
        Cookies.remove('apiToken');

        window.location.href = '/login';
    });
};

let onFirstLoad = (resource) => {
    let el = $(`[data-section="${resource}"]`);

    if (!object(Permission).has(resource + '-edit')) {
        $(el).find('.action-edit').remove();
    }

    if (!object(Permission).has(resource + '-delete')) {
        $(el).find('.action-remove').remove();
    }

    $(el).removeClass('hidden');
};

let noResults = (table) => {
    let ths = $('thead', table).find('th');
    let span = $(ths).length;

    let row = `<tr><td class="text-center" colspan="${span}">Brak wyników</td></tr>`;

    $('tbody', table).append(row);
};

let permissions = () => {
    get('profile/permissions', function(data) {
        $.each(data, function(k, v) {
            permissionsCache.push(v);
        });

        loadData();
    });
};

let role = () => {
    get('profile/role', function(data) {
        roleCache = data;
    });
};

let loadData = function loadData() {
    $('div[data-section]').each(function() {
        let resource = $(this).attr('data-section');
        let i = resource + '-list';

        if($.inArray(i, permissionsCache) !== -1) {
            setTimeout(function() {
                const regex = /\//gm;
                const str = resource;
                const subst = `_`;

                const result = str.replace(regex, subst);

                eval(result)(1);
            }, 0);
        }
    });

    $('.action-add').each(function() {
        let resource = $(this).attr('data-element');
        let element = $(this);
        let i = resource + '-create';

        if($.inArray(i, permissionsCache) !== -1) {
            setTimeout(function() {
                $(element).removeClass('hidden');
                $(element).closest('span').find('.action-import').removeClass('hidden');
            }, 0);
        }
    });

    loadMenu();
};

let loadMenu = function() {
    $(`li[data-route] > a[href="${window.location.pathname}"]`).parent().addClass('active');

    let active = $('[class="active"]', 'ul[class="nav"]');
    let sections = $('div[data-section]');

    if(Object.keys(sections).length < 4) {
        return;
    }

    $(active).append('<div class="collapse show fadeIn animated"><ul class="nav"></ul></div>');

    $.each(sections, function() {
        let section = $(this).data('section');
        let i = section + '-list';

        if(object(Permission).has(i)) {
            let name = $(this).find('h4 > span').clone().children().remove().end().text();
            let icon = $(this).find('h4').find('i').clone()[0].outerHTML;

            $('ul', active).append(`<li class="ml-1" data-section="${section}"><a><span> ${name}</span></a></li>`);
        }
    });
};

let notification = {
    info: function(message, placement = ['top', 'right']) {
        $.notify({
            icon: "tim-icons icon-bell-55",
            title: '<strong>Powiadomienie</strong>',
            message: message
        }, {
            element: 'body',
            allow_dismiss: true,
            newest_on_top: true,
            showProgressbar: false,
            type: 'info',
            timer: 1000,
            delay: 7000,
            placement: {
                from: placement[0],
                align: placement[1]
            }
        });
    },
    success: function(message, placement = ['top', 'right']) {
        $.notify({
            icon: "tim-icons icon-check-2",
            title: '<strong>Sukces</strong>',
            message: message
        }, {
            element: 'body',
            allow_dismiss: true,
            newest_on_top: true,
            showProgressbar: false,
            type: 'success',
            timer: 1000,
            delay: 7000,
            placement: {
                from: placement[0],
                align: placement[1]
            }
        });
    },
    error: function(message, placement = ['top', 'right']) {
        $.notify({
            icon: "tim-icons icon-simple-remove",
            title: '<strong>Błąd</strong>',
            message: message
        }, {
            element: 'body',
            allow_dismiss: true,
            newest_on_top: true,
            showProgressbar: false,
            type: 'danger',
            timer: 1000,
            delay: 7000,
            placement: {
                from: placement[0],
                align: placement[1]
            }
        });
    },
    warning: function(message, placement = ['top', 'right']) {
        $.notify({
            icon: "tim-icons icon-alert-circle-exc",
            title: '<strong>Ostrzeżenie</strong>',
            message: message
        }, {
            element: 'body',
            allow_dismiss: true,
            newest_on_top: true,
            showProgressbar: false,
            type: 'warning',
            timer: 1000,
            delay: 7000,
            placement: {
                from: placement[0],
                align: placement[1]
            }
        });
    }
};

$(document).ready(function() {
    userObj.init();

    session();
    notifications();

    if(window.location.pathname !== '/login' && window.location.pathname !== '/logout') {
        permissions();
        role();
    }

    $('th[data-sortable]').each(function() {
        $(this).addClass('clickable');
    });

    $('body').on('click', '[data-button-action]', function(e) {
        e.preventDefault();

        let action = $(this).data('button-action');
        let modal = $(`div[data-element="${action}"]`);

        switch(action) {
            case 'carsMove':
                user(false, function(data) {
                    let select = $('select[name="user_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $(select).selectpicker('refresh');
                });

                search(action);

                $(modal).modal();

                break;
            default:
                return;
        }
    });

    $('nav[data-type="pagination"]').on('click', '.page-item-num', function() {
        let resource = $(this).closest('nav').attr('data-resource');
        let page = parseInt($(this).html());
        let clickable = new Clickable();

        paging[resource] = page;

        clearTimeout(searchTimeout);

        switch(resource) {
            case 'warehouse-clickable':
                clickable.warehouse(clickable_params[resource].modal, clickable_params[resource].resource, clickable_params[resource].id);
                break;
            case 'car-clickable':
                clickable.car(clickable_params[resource].modal, clickable_params[resource].resource, clickable_params[resource].id);
                break;
            case 'car/stock/own':
                clickable.carStockOwn(clickable_params[resource].modal, clickable_params[resource].resource, clickable_params[resource].id);
                break;
            default:
                const regex = /\//gm;
                const str = resource;
                const subst = `_`;

                const result = str.replace(regex, subst);

                eval(result)(page, false, false, sorting[resource], searching[resource]);
        }

        $('table[data-resource="' + resource + '"]').closest('.card').find('.page-number').html(page);
    });

    $('nav[data-type="pagination"]').on('click', '.page-item-prev', function() {
        let resource = $(this).closest('nav').attr('data-resource');
        let page = parseInt($(this).closest('.pagination').find('.active').find('a').html())-1;
        let clickable = new Clickable();

        paging[resource] = page;

        clearTimeout(searchTimeout);

        switch(resource) {
            case 'warehouse-clickable':
                clickable.warehouse(clickable_params[resource].modal, clickable_params[resource].resource, clickable_params[resource].id);
                break;
            case 'car-clickable':
                clickable.car(clickable_params[resource].modal, clickable_params[resource].resource, clickable_params[resource].id);
                break;
            case 'car/stock/own':
                clickable.carStockOwn(clickable_params[resource].modal, clickable_params[resource].resource, clickable_params[resource].id);
                break;
            default:
                const regex = /\//gm;
                const str = resource;
                const subst = `_`;

                const result = str.replace(regex, subst);

                eval(result)(page, false, false, sorting[resource], searching[resource]);
        }

        $(`table[data-resource="${resource}"]`).closest('.card').find('.page-number').html(page);
    });

    $('nav[data-type="pagination"]').on('click', '.page-item-next', function() {
        let resource = $(this).closest('nav').attr('data-resource');
        let page = parseInt($(this).closest('.pagination').find('.active').find('a').html())+1;
        let clickable = new Clickable();

        paging[resource] = page;

        clearTimeout(searchTimeout);

        switch(resource) {
            case 'warehouse-clickable':
                clickable.warehouse(clickable_params[resource].modal, clickable_params[resource].resource, clickable_params[resource].id);
                break;
            case 'car-clickable':
                clickable.car(clickable_params[resource].modal, clickable_params[resource].resource, clickable_params[resource].id);
                break;
            case 'car/stock/own':
                clickable.carStockOwn(clickable_params[resource].modal, clickable_params[resource].resource, clickable_params[resource].id);
                break;
            default:
                const regex = /\//gm;
                const str = resource;
                const subst = `_`;

                const result = str.replace(regex, subst);

                eval(result)(page, false, false, sorting[resource], searching[resource]);
        }

        $('table[data-resource="' + resource + '"]').closest('.card').find('.page-number').html(page);
    });

    // data-sortable click on th
    $('th[data-sortable]').on('click', function() {
        let resource = $(this).closest('table').attr('data-resource');
        let column = $(this).attr('data-sortable');
        let direction = $(this).attr('data-direction') === 'asc' ? 'desc' : 'asc';
        let page = $('nav[data-resource="' + resource + '"] > ul').children('.active').children('a').html();
        let clickable = new Clickable();

        sorting[resource] = [ direction, column ];
        paging[resource] = page;

        switch(resource) {
            case 'warehouse-clickable':
                clickable.warehouse(clickable_params[resource].modal, clickable_params[resource].resource, clickable_params[resource].id);
                break;
            case 'car-clickable':
                clickable.car(clickable_params[resource].modal, clickable_params[resource].resource, clickable_params[resource].id);
                break;
            case 'car/stock/own':
                clickable.carStockOwn(clickable_params[resource].modal, clickable_params[resource].resource, clickable_params[resource].id);
                break;
            default:
                const regex = /\//gm;
                const str = resource;
                const subst = `_`;

                const result = str.replace(regex, subst);

                eval(result)(page, false, false, sorting[resource], searching[resource]);
        }
    });

    $('table > tbody').on('click', '.clickable td:not(:last-child)', function () {
        let element = $(this).closest('div[data-element]').attr('data-element');
        let id = $(this).closest('tr').attr('data-element-id');

        switch(element) {
            case 'car/stock/own':
                modal = $('div[data-element="data-show"]');

                $('table > tbody', modal).empty();

                get(`car/stock/${id}`, function(data) {
                    $.each(data.element, function(k, v) {
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
    });

    $(document).on('click', 'ul[class="files"] > li > span', function() {
        let filename = $(this).text();
        let id = $(this).data('file-id');
        let resource = $(this).closest('ul').data('res');

        switch(resource) {
            case 'investment':
                download(`${resource}/${clickable_id}/file/${id}`, filename);

                break;
            default:
                download(`file/${id}`, filename);

                break;
        }
    });

    $(document).on('click', '.attachments', function() {
        let resource = $(this).closest('div').find('ul').data('res');
        let filename = `${clickable_id}.zip`;

        switch(resource) {
            case 'investment':
                download(`${resource}/${clickable_id}/file/all`, filename);

                break;
        }
    });

    $(document).on('click', '.action-doc', function() {
        let resource = $(this).closest('[data-resource]').attr('data-resource');
        let id = $(this).closest('tr').attr('data-element-id');
        let icon = $(this);

        $(icon).removeClass('fa fa-file-pdf').addClass('fas fa-spinner fa-spin');

        switch(resource) {
            case 'request':
                file(`request/${id}/pdf`, function(data) {
                    pdf(data, `ZAP_${id}.pdf`);

                    $(icon).removeClass('fas fa-spinner fa-spin').addClass('fa fa-file-pdf');
                });

                break;
            case 'warehouse':
                file(`warehouse/${id}/pdf`, function(data) {
                    pdf(data, `MAG_${id}.pdf`);

                    $(icon).removeClass('fas fa-spinner fa-spin').addClass('fa fa-file-pdf');
                });

                break;
            case 'warehousesIn':
                file(`warehousesIn/${id}/pdf`, function(data) {
                    pdf(data, `PZ_${id}.pdf`);

                    $(icon).removeClass('fas fa-spinner fa-spin').addClass('fa fa-file-pdf');
                });

                break;
            case 'warehousesOutCar':
                file(`warehousesOutCar/${id}/pdf`, function(data) {
                    pdf(data, `RW_${id}.pdf`);

                    $(icon).removeClass('fas fa-spinner fa-spin').addClass('fa fa-file-pdf');
                });

                break;
            case 'warehousesMove':
                file(`warehousesMove/${id}/pdf`, function(data) {
                    pdf(data, `MM_${id}.pdf`);

                    $(icon).removeClass('fas fa-spinner fa-spin').addClass('fa fa-file-pdf');
                });

                break;
            case 'warehousesInCar':
                file(`warehousesInCar/${id}/pdf`, function(data) {
                    pdf(data, `ZW_${id}.pdf`);

                    $(icon).removeClass('fas fa-spinner fa-spin').addClass('fa fa-file-pdf');
                });

                break;
            case 'carsOut':
                file(`carsOut/${id}/pdf`, function(data) {
                    pdf(data, `WZ_${id}.pdf`);

                    $(icon).removeClass('fas fa-spinner fa-spin').addClass('fa fa-file-pdf');
                });

                break;
            case 'carsIn':
                file(`carsIn/${id}/pdf`, function(data) {
                    pdf(data, `ZWROT_${id}.pdf`);

                    $(icon).removeClass('fas fa-spinner fa-spin').addClass('fa fa-file-pdf');
                });

                break;
            case 'bhpOut':
                file(`bhpOut/${id}/pdf`, function(data) {
                    pdf(data, `RW_B_${id}.pdf`);

                    $(icon).removeClass('fas fa-spinner fa-spin').addClass('fa fa-file-pdf');
                });

                break;
            case 'bhpUsersStocksItem':
                file(`bhpUsersStocksItem/${id}/pdf`, function(data) {
                    pdf(data, `BHP_STOCK_${id}.pdf`);

                    $(icon).removeClass('fas fa-spinner fa-spin').addClass('fa fa-file-pdf');
                });

                break;
        }
    });

    $('a[data-nav]').on('click', function() {
        let resource = $(this).attr('data-nav');
        let modal = $('div[data-element="' + resource + '"]');
        let clickable = new Clickable();

        switch(resource) {
            case 'car/stock/own':
                paging[resource] = 1;

                clickable.carStockOwn(modal, resource, null);

                break;
        }
    });

    $('#search-button').on('click', function() {
        $('#inlineFormInputGroup').focus();
    });

    // scroll to resource
    $('.nav-submenu-link').click(function() {
        var section = $(this).data('section');

        $('html, body').animate({
            scrollTop: $('div[data-section="' + section + '"]').offset().top
        }, 1000);
    });

    // logout click
    $('.logout').on('click', function() {
        logout();
    });

    $(document).on('show.bs.modal', '.modal', function() {
        let val = 1059 + (10 * $('.modal:visible').length);
        $(this).css('z-index', val);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', val - 1).addClass('modal-stack');
        }, 0);
    });

    $(document).on('keyup change', 'input[class*="form-control-search"]', function() {
        let resource = $(this).attr('data-search');

        if(resource === undefined) {
            return;
        }

        let str = $(this).val();

        searching[resource] = str;

        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(function() {
            switch(resource) {
                case 'event':
                    /* if(str.length > 0) {
                        calendar.changeView('list');
                    } else {
                        calendar.changeView('timeGridWeek');
                    } */

                    calendar.changeView('listYear', new Date().getFullYear() + '-01-01');
                    calendar.refetchEvents();

                    break;
                default:
                    const regex = /\//gm;
                    const string = resource;
                    const subst = `_`;

                    const result = string.replace(regex, subst);

                    eval(result)(1, false, false, sorting[resource], str);
            }
        }, 400);
    });

    $(document).on('keyup change', 'input[class*="form-control-search-modal"]', function() {
        let resource = $(this).attr('data-search');
        let modal = $(this).closest('.modal');
        let str = $(this).val();
        let clickable = new Clickable();

        searching[resource] = str;

        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(function() {
            switch(resource) {
                case 'car':
                    paging[resource + '-clickable'] = 1;
                    searching[resource + '-clickable'] = str;
                    clickable.car(modal, resource + '-clickable', clickable_id);
                    break;
                case 'car/stock/own':
                    paging[resource] = 1;
                    clickable.carStockOwn(modal, resource, null);
                    break;
                case 'warehouse-clickable':
                    paging[resource] = 1;
                    searching[resource] = str;
                    clickable.warehouse(modal, resource, clickable_id);
                    break;
            }
        }, 400);
    });

    if($('.chosen-select').length) {
        $('.chosen-select').chosen({width: "100%"});
    }

    $('.main-panel').scroll(function() {
        if($(this).scrollTop() > 100) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });

    $('#back-to-top').click(function() {
        $('.main-panel').animate({
            scrollTop: 0
        }, 700, function() {
            $('#back-to-top').tooltip('hide');
        });

        return false;
    });

    $('body').on('mouseenter', '.thumb', function(e) {
        let img = $(this).attr('src');

        $(this).tooltip({
            trigger: 'manual',
            html: true,
            title: `<img class="photo-preview" src="${img}">`,
            placement: 'auto'
        }).tooltip('show');
    });

    $('body').on('mouseleave', '.thumb', function(e) {
        let img = $(this).attr('src');

        $(this).tooltip('dispose');
    });

    $('ul').on('click', 'li[data-section]', function(e) {
        e.preventDefault();

        let section = $(this).data('section');
        let isWindows = /^.*Windows.*/i.test(navigator.userAgent);

        /*
        if(isSafari) {
            console.log('safari true');

            $('body').stop().animate({
                scrollTop: $(`div[data-section="${section}"]`).offset().top - 80
            }, 600);
        } else {
            let element = $('.main-panel');

            $(element).stop().animate({
                scrollTop: $(`div[data-section="${section}"]`).offset().top + $(element).scrollTop() - 80
            }, 600);
        }
        */

        if('scrollingElement' in document) {
            if(isWindows) {
                let element = $('.main-panel');

                $(element).stop().animate({
                    scrollTop: $(`div[data-section="${section}"]`).offset().top + $(element).scrollTop() - 80
                }, 600);
            } else {
                document.scrollingElement.scrollTop = $(`div[data-section="${section}"]`).offset().top - 80;
            }
        }

        if(isWindows) {
            document.documentElement.scrollTop = $(`div[data-section="${section}"]`).offset().top - 80;
        } else {
            document.body.scrollTop = $(`div[data-section="${section}"]`).offset().top - 80;
        }
    });

    // row actions
    $(document).on('click', '.action-remove-row', function() {
        $(this).closest('.form-row').remove();
    });

    // new row actions
    $(document).on('click', '.action-remove-row', function() {
        $(this).closest('tr').remove();
    });

    $('[data-toggle="tooltip"]').tooltip();

    $(document).on('show.bs.select', function(e) {
        new PerfectScrollbar($(e.target).parent().find('div.inner.show').get(0));
    });

    setInterval(session, 60000);
});
