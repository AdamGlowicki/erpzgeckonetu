let dataAddElement;
let dataAddItemId;

let unms = function unms(page = false, callbackSuccess = false, callbackError = false, sortBy = ['desc', 'id'], search = false) {
    let resource = 'unms';
    let params;

    params = `/search/${search}`;

    let table = $(`table[data-resource="${resource}"]`);

    if(!search) {
        noResults(table);
    }

    let url = resource + params;

    get(url, function(data) {
        if(callbackSuccess !== false) {
            callbackSuccess(data);
            return;
        }

        $('tbody', table).empty();

        if(!(Object.keys(data).length > 0)) {
            noResults(table);
        } else {
            $.each(data, function(key, value) {
                if(value.type !== 'device') {
                    return;
                }

                let row = `<tr data-element-id="${value.data.id}">
                    <td>${value.data.identification.mac}</td>
                    <td>${value.data.identification.name}</td>
                    <td>${value.data.identification.hostname}</td>
                    <td>${value.data.identification.modelName}</td>
                    <td>${value.data.ipAddress}</td>
                    <td>${moment(value.data.identification.started).utc().format('YYYY-MM-DD HH:mm:ss')}</td>
                </tr>`;

                $('tbody', table).append(row);
            });
        }

        // sort(resource, sortBy);
        // pagination(resource, data);
    }, function(error) {
        $('tbody', table).empty();

        noResults(table);
    });

    onFirstLoad(resource);
};

let items_low = function items_low(page = false, callbackSuccess = false, callbackError = false, sortBy = [], search = false) {
    let resource = 'items_low';
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

        let tbody = $('table[data-resource="' + resource + '"] > tbody');

        $(tbody).empty();

        if(!(Object.keys(data.data).length > 0)) {
            let ths = $('table[data-resource="' + resource + '"] > thead').find('th');
            let span = Object.keys(ths).length;

            let row = `<tr><td class="text-center" colspan="${span}">Brak wyników</td></tr>`;

            $(tbody).append(row);
        } else {
            $.each(data.data, function(key, value) {
                let quantity = 0;

                $.each(value.quantity, function(k, v) {
                    quantity = parseInt(v.quantity);
                });

                let row = `<tr class="clickable" data-element-id="${value.id}">
                    <td><span class="font-weight-bold">${value.id}</span></td>
                    <td>${value.photo ? imageThumb(value.photo) : ''} ${value.model_name}</td>
                    <td>${value.items_manufacturer.name}</td>
                    <td>${value.items_category.name}</td>
                    <td><span class="font-weight-bold text-${quantity >= value.low_quant ? 'primary' : 'danger'}">${quantity}</span></td>
                    <td>${value.low_quant}</td>
                    <td>${value.unit.short_name}</td>
                </tr>`;

                $(tbody).append(row);
            });
        }

        sort(resource, sortBy);
        pagination(resource, data);
        onFirstLoad(resource);
    });
};

let items_usage = function items_usage(page = false, callbackSuccess = false, callbackError = false, sortBy = [], search = false) {
    let resource = 'items_usage';
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

        $('table[data-resource="' + resource + '"] > tbody').empty();

        if(!(Object.keys(data.data).length > 0)) {
            let ths = $('table[data-resource="' + resource + '"] > thead').find('th');
            let span = Object.keys(ths).length;

            let tbody = `<tr><td class="text-center" colspan="${span}">Brak wyników</td></tr>`;

            $('table[data-resource="' + resource + '"] > tbody').append(tbody);
        } else {
            $.each(data.data, function(key, value) {
                let tbody = `<tr class="clickable" data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.photo ? imageThumb(value.photo) : ''} ${value.model_name}</td>
                    <td>${value.items_manufacturer.name}</td>
                    <td>${value.q}</td>
                    <td>${value.unit.short_name}</td>
                </tr>`;

                $('table[data-resource="' + resource + '"] > tbody').append(tbody);
            });
        }

        sort(resource, sortBy);
        pagination(resource, data);
        onFirstLoad(resource);
    });
};

let users_items_usage = function users_items_usage(page = false, callbackSuccess = false, callbackError = false, sortBy = [], search = false) {
    let resource = 'users_items_usage';
    let sortable = Object.keys(sortBy).length > 0;
    let params;

    let table = $(`table[data-resource="${resource}"]`);
    let section = $(`div[data-section="${resource}"]`);

    search = $('[name="user_id"]', section).val();
    date = $('[name="date"]', section).val();

    if(page !== false) {
        params = '?page=' + page + (search !== false ? '&user_id=' + search : '') + (date ? `&date=${date}` : '');
    } else {
        params = '?user_id=' + search + (date ? `&date=${date}` : '');
    }

    let url = resource + (sortable ? '/sort/' + sortBy[0] + '/' + sortBy[1] : '') + params;

    get(url, function(data) {
        if(callbackSuccess !== false) {
            callbackSuccess(data);
            return;
        }

        $('tbody', table).empty();

        if(!(Object.keys(data.data).length > 0)) {
            let ths = $('table[data-resource="' + resource + '"] > thead').find('th');
            let span = Object.keys(ths).length;

            let tbody = `<tr><td class="text-center" colspan="${span}">Brak wyników</td></tr>`;

            $('table[data-resource="' + resource + '"] > tbody').append(tbody);
        } else {
            $.each(data.data, function(key, value) {
                let tbody = `<tr class="clickable" data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.photo ? imageThumb(value.photo) : ''} ${value.model_name}</td>
                    <td>${value.items_manufacturer.name}</td>
                    <td><span>${value.q}</span></td>
                    <td>${value.unit.short_name}</td>
                </tr>`;

                $('table[data-resource="' + resource + '"] > tbody').append(tbody);
            });
        }

        sort(resource, sortBy);
        pagination(resource, data);
        onFirstLoad(resource);
    });
};

let cars_items_usage = function cars_items_usage(page = false, callbackSuccess = false, callbackError = false, sortBy = [], search = false) {
    let resource = 'cars_items_usage';
    let sortable = Object.keys(sortBy).length > 0;
    let params;

    let table = $(`table[data-resource="${resource}"]`);
    let section = $(`div[data-section="${resource}"]`);

    search = $('[name="car_id"]', section).val();
    date = $('[name="date"]', section).val();

    if(page !== false) {
        params = '?page=' + page + (search !== false ? '&car_id=' + search : '') + (date ? `&date=${date}` : '');
    } else {
        params = '?car_id=' + search + (date ? `&date=${date}` : '');
    }

    let url = resource + (sortable ? '/sort/' + sortBy[0] + '/' + sortBy[1] : '') + params;

    get(url, function(data) {
        if(callbackSuccess !== false) {
            callbackSuccess(data);
            return;
        }

        $('tbody', table).empty();

        if(!(Object.keys(data.data).length > 0)) {
            let ths = $('table[data-resource="' + resource + '"] > thead').find('th');
            let span = Object.keys(ths).length;

            let tbody = `<tr><td class="text-center" colspan="${span}">Brak wyników</td></tr>`;

            $('table[data-resource="' + resource + '"] > tbody').append(tbody);
        } else {
            $.each(data.data, function(key, value) {
                let tbody = `<tr class="clickable" data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.photo ? imageThumb(value.photo) : ''} ${value.model_name}</td>
                    <td>${value.items_manufacturer.name}</td>
                    <td><span>${value.q}</span></td>
                    <td>${value.unit.short_name}</td>
                </tr>`;

                $('table[data-resource="' + resource + '"] > tbody').append(tbody);
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

    get(url, function(data) {
        if(callbackSuccess !== false) {
            callbackSuccess(data);
            return;
        }
    }, function(data) {
        notification.error('Nie udało się pobrać danych: ' + resource);
    });
};

let car = function car(page = false, callbackSuccess = false, callbackError = false) {
    let resource = 'car';
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

$(document).ready(function() {
    $('li[data-route="dashboard"]').addClass('active');

    $('[name="user_id"]', 'div[data-section]').on('change', function() {
        let section = $(this).closest('div[data-section]').attr('data-section');

        eval(section)(false, false, false, sorting[section], searching[section]);
    });

    $('[name="car_id"]', 'div[data-section]').on('change', function() {
        let section = $(this).closest('div[data-section]').attr('data-section');

        eval(section)(false, false, false, sorting[section], searching[section]);
    });

    $('[name="date"]', 'div[data-section]').on('change', function() {
        let section = $(this).closest('div[data-section]').attr('data-section');

        eval(section)(false, false, false, sorting[section], searching[section]);
    });

    user(false, function(data) {
        $('[name="user_id"]', 'div[data-section="users_items_usage"]').append(`<option value="0">- wybierz użytkownika -</option>`);

        $.each(data, function(k,v) {
            $('[name="user_id"]', 'div[data-section="users_items_usage"]').append(`<option value="${v.id}">${v.name}</option>`);
        });

        $('[name="date"]', 'div[data-section="users_items_usage"]').val(moment().format('YYYY-MM'));
    });

    car(false, function(data) {
        $('[name="car_id"]', 'div[data-section="cars_items_usage"]').append(`<option value="0">- wybierz pojazd -</option>`);

        $.each(data, function(k,v) {
            $('[name="car_id"]', 'div[data-section="cars_items_usage"]').append(`<option value="${v.id}">${v.name} (${v.registration})</option>`);
        });

        $('[name="date"]', 'div[data-section="cars_items_usage"]').val(moment().format('YYYY-MM'));
    });
});
