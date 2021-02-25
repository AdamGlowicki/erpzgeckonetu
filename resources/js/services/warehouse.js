let dataAddElement;
let dataAddItemId;

let carsMove = function carsMove(page = false, callbackSuccess = false, callbackError = false, sortBy = ['desc', 'id'], search = false) {
    let resource = 'carsMove';
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
                let row = `<tr class="clickable${value.approved !== 0 ? ' table-success' : ' table-danger'}" data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${userAvatar(value.user_in)} ${value.user_in.name}</td>
                    <td>${userAvatar(value.user_out)} ${value.user_out.name}</td>
                    <td>${value.car_in.name} (${value.car_in.registration})</td>
                    <td>${value.car_out.name} (${value.car_out.registration})</td>
                    <td>${value.document_name}</td>
                    <td>${value.created_at}</td>
                    <td>
                        ${!value.approved ? '<i class="tim-icons icon-simple-remove action-remove font-weight-bold"></i>' : ''}
                        <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
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

let item = function item(page = false, callbackSuccess = false, callbackError = false, sortBy = [], search = false) {
    let resource = 'item';
    let sortable = Object.keys(sortBy).length > 0;
    let params;

    let hidden = $('[name="hidden"]').prop('checked');

    if(page !== false) {
        params = '?page=' + page + (search !== false ? '&q=' + search : '') + '&hidden=' + (hidden ? '1' : '0');
    } else {
        params = '/all' + (search !== false ? '?q=' + search : '') + '&hidden=' + (hidden ? '1' : '0');
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
            let addRow = function addRow(value, gid) {
                let row = null;

                let quantity = 0;

                $.each(value.quantity, function(k, v) {
                    quantity = parseInt(v.quantity);
                });

                let quantity_cars = 0;

                $.each(value.quantity_cars, function(k, v) {
                    quantity_cars = parseInt(v.quantity);
                });

                let avgPrice = 0.00;

                $.each(value.avg_price, function(k, v) {
                    avgPrice = parseFloat(v.avg);
                });

                avgPrice = avgPrice.toFixed(2);

                if(value.parent_id) {
                    row = $(`<tr class="clickable hidden" data-parent-id="${value.parent_id}" data-element-id="${value.id}">
                        <td class="expand-table">${value.children.length ? '< class="fa fa-chevron-right mr-2" />' : ''} <span class="font-italic">${value.id}</span></td>
                        <td>${value.photo ? imageThumb(value.photo) : ''} ${value.model_name} ${value.descr ? `<i class="ml-1 fa fa-info-circle" data-toggle="tooltip" data-placement="top" title="${value.descr}"></i>` : ''}</td>
                        <td>${value.items_manufacturer.name}</td>
                        <td>${value.items_category.name}</td>
                        <td><span class="font-weight-bold text-${quantity >= value.low_quant ? 'primary' : 'danger'}">${quantity}</span></td>
                        <td><span class="font-weight-bold text-${quantity >= value.low_quant ? 'primary' : 'danger'}">${value.low_quant}</span></td>
                        <td>${quantity_cars}</td>
                        <td>${value.unit.short_name}</td>
                        <td>${avgPrice}</td>
                        <td>
                            <i class="tim-icons icon-pencil action-edit font-weight-bold" />
                            <i class="tim-icons icon-simple-remove action-remove font-weight-bold" />
                        </td>
                    </tr>`);

                    for(let i = 0; i < gid.length; i++) {
                        $(row).addClass(`gid-${gid[i]}`);
                    }

                    $('tbody', table).find(`[data-element-id="${value.parent_id}"]`).after(row);
                } else {
                    row = `<tr class="clickable" data-element-id="${value.id}">
                        <td class="expand-table">${value.children.length ? '<i class="fa fa-chevron-right mr-2"></i>' : ''} <span class="font-italic">${value.id}</span></td>
                        <td>${value.photo ? imageThumb(value.photo) : ''} ${value.model_name} ${value.descr ? `<i class="ml-1 fa fa-info-circle" data-toggle="tooltip" data-placement="top" title="${value.descr}"></i>` : ''}</td>
                        <td>${value.items_manufacturer.name}</td>
                        <td>${value.items_category.name}</td>
                        <td><span class="font-weight-bold text-${quantity >= value.low_quant ? 'primary' : 'danger'}">${quantity}</span></td>
                        <td><span class="font-weight-bold text-${quantity >= value.low_quant ? 'primary' : 'danger'}">${value.low_quant}</span></td>
                        <td>${quantity_cars}</td>
                        <td>${value.unit.short_name}</td>
                        <td>${avgPrice}</td>
                        <td>
                            <i class="tim-icons icon-pencil action-edit font-weight-bold" />
                            <i class="tim-icons icon-simple-remove action-remove font-weight-bold" />
                        </td>
                    </tr>`;

                    $('tbody', table).append(row);
                }
            };

            $.each(data.data, function(key, value) {
                let gid = [];

                addRow(value, gid);

                let recurse = function recurse(node) {
                    if(node.children.length > 0) {
                        gid.push(node.id);
                    }

                    for(let i = 0, count = node.children.length; i < count; i++) {
                        addRow(node.children[i], gid);
                        recurse(node.children[i]);
                    }
                };

                recurse(value);
            });
        }

        $('[data-toggle="tooltip"]').tooltip({
            container: 'body',
        });

        sort(resource, sortBy);
        pagination(resource, data);
        onFirstLoad(resource);
    });
};

let itemsManufacturer = function itemsManufacturer(page = false, callbackSuccess = false, callbackError = false, sortBy = []) {
    let resource = 'itemsManufacturer';
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
                let row = `<tr data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.name}</td>
                    <td>${value.item_count}</td>
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
    });
};

let itemsCategory = function itemsCategory(page = false, callbackSuccess = false, callbackError = false, sortBy = []) {
    let resource = 'itemsCategory';
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
                let row = `<tr data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.name}</td>
                    <td>${value.item_count}</td>
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
    });
};

let unit = function unit(page = false, callbackSuccess = false, callbackError = false, sortBy = []) {
    let resource = 'unit';
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
                let row = `<tr data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.name}</td>
                    <td>${value.short_name}</td>
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
    });
};

let warehousesPlace = function warehousesPlace(page = false, callbackSuccess = false, callbackError = false, sortBy = []) {
    let resource = 'warehousesPlace';
    let sortable = Object.keys(sortBy).length > 0;
    let url = 'warehousesPlace' + (sortable ? '/sort/' + sortBy[0] + '/' + sortBy[1] : '') + (page !== false ? '?page=' + page : '/all');

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
                    <td>${value.warehouse.name}</td>
                    <td>${value.name}</td>
                    <td>${value.item ? value.item.model_name : ''} ${value.item ? '(' + value.item.id + ')' : ''}</td>
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
    });
};

let warehouse = function warehouse(page = false, callbackSuccess = false, callbackError = false, sortBy = []) {
    let resource = 'warehouse';
    let sortable = Object.keys(sortBy).length > 0;
    let url = 'warehouse' + (sortable ? '/sort/' + sortBy[0] + '/' + sortBy[1] : '') + (page !== false ? '?page=' + page : '/all');

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
                    <td>${value.descr ? value.descr : ''}</td>
                    <td>${value.postcode} ${value.city}, ${value.street}, ${value.country.name}</td>
                    <td>
                        <i class="tim-icons icon-pencil action-edit font-weight-bold"></i>
                        <i class="tim-icons icon-simple-remove action-remove font-weight-bold"></i>
                        <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
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

let warehousesMove = function warehousesMove(page = false, callbackSuccess = false, callbackError = false, sortBy = ['desc', 'id']) {
    let resource = 'warehousesMove';
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
                    <td>${value.warehouse_in.name}</td>
                    <td>${value.warehouse_out.name}</td>
                    <td>${userAvatar(value.user)} ${value.user.name}</td>
                    <td>${value.document_name}</td>
                    <td>${value.created_at}</td>
                    <td>
                        <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
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

let warehousesImport = (page = false, callbackSuccess = false, callbackError = false, sortBy = ['desc', 'id'], search = false) => {
    let resource = 'warehousesImport';
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
                let row = `<tr class="clickable" data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.warehouse.name}</td>
                    <td>${userAvatar(value.user)} ${value.user.name}</td>
                    <td>${value.created_at}</td>
                    <td>
                        <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
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

let warehousesIn = function warehousesIn(page = false, callbackSuccess = false, callbackError = false, sortBy = ['desc', 'id'], search = false) {
    let resource = 'warehousesIn';
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
                let targetDate = moment(value.created_at, 'YYYY-MM-DD HH:mm:ss').add(7, 'days');

                let row = `<tr class="clickable" data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.warehouse.name}</td>
                    <td>${value.contractor.name}</td>
                    <td>${userAvatar(value.user)} ${value.user.name}</td>
                    <td>${value.created_at}</td>
                    <td>${value.invoice_date}</td>
                    <td>${value.document_name}</td>
                    <td>${value.invoice_name}</td>
                    <td>${value.price[0].price}</td>
                    <td>
                        ${moment().isBefore(targetDate) || object(Permission).has('root') ? '<i class="tim-icons icon-pencil action-edit font-weight-bold"></i>' : ''}
                        <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
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

let client = function client(page = false, callbackSuccess = false, callbackError = false, sortBy = ['desc', 'id'], search = false) {
    let resource = 'client';
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
                let row = `<tr class="clickable" data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.client_id}</td>
                    <td>${value.name}</td>
                    <td>${value.address}</td>
                    <td>${value.created_at}</td>
                    <td>
                        <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
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

let investment = function investment(page = false, callbackSuccess = false, callbackError = false, sortBy = ['desc', 'id'], search = false) {
    let resource = 'investment';
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
            let addRow = function addRow(value, gid) {
                let row = null;

                if(value.parent_id) {
                    row = $(`<tr class="clickable hidden" data-parent-id="${value.parent_id}" data-element-id="${value.id}">
                        <td>${value.id}</td>
                        <td class="expand-table">${value.children.length ? '<i class="fa fa-chevron-right mr-2"></i>' : ''} <span class="font-italic">${value.name}</span></td>
                        <td>${value.investment_name}</td>
                        <td>${userAvatar(value.user)} ${value.user.name}</td>
                        <td>${value.date_start ? value.date_start : 'n/a'}</td>
                        <td>${value.date_end ? value.date_end : 'n/a'}</td>
                        <td>${value.created_at}</td>
                        <td>
                            <i class="tim-icons icon-pencil action-edit font-weight-bold"></i>
                            <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
                        </td>
                    </tr>`);

                    for(let i = 0; i < gid.length; i++) {
                        $(row).addClass(`gid-${gid[i]}`);
                    }

                    $('tbody', table).find(`[data-element-id="${value.parent_id}"]`).after(row);
                } else {
                    row = `<tr class="clickable" data-element-id="${value.id}">
                        <td>${value.id}</td>
                        <td class="expand-table">${value.children.length ? '<i class="fa fa-chevron-right mr-2"></i>' : ''} <span class="font-italic">${value.name}</span></td>
                        <td>${value.investment_name}</td>
                        <td>${userAvatar(value.user)} ${value.user.name}</td>
                        <td>${value.date_start ? value.date_start : 'n/a'}</td>
                        <td>${value.date_end ? value.date_end : 'n/a'}</td>
                        <td>${value.created_at}</td>
                        <td>
                            <i class="tim-icons icon-pencil action-edit font-weight-bold"></i>
                            <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
                        </td>
                    </tr>`;

                    $('tbody', table).append(row);
                }
            };

            $.each(data.data, function(key, value) {
                let gid = [];

                addRow(value, gid);

                let recurse = function recurse(node) {
                    if(node.children.length > 0) {
                        gid.push(node.id);
                    }

                    for(let i = 0, count = node.children.length; i < count; i++) {
                        addRow(node.children[i], gid);
                        recurse(node.children[i]);
                    }
                };

                recurse(value);
            });
        }

        sort(resource, sortBy);
        pagination(resource, data);
        onFirstLoad(resource);
    });
};

let warehousesOutCar = function warehousesOutCar(page = false, callbackSuccess = false, callbackError = false, sortBy = ['desc', 'id'], search = false) {
    let resource = 'warehousesOutCar';
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
                let row = `<tr class="clickable" data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.warehouse.name}</td>
                    <td>${value.car.registration} (${value.car.name})</td>
                    <td>${userAvatar(value.user_approved)} ${value.user_approved.name}</td>
                    <td>${userAvatar(value.user_get)} ${value.user_get.name}</td>
                    <td>${value.created_at}</td>
                    <td>${value.document_name}</td>
                    <td>${value.warehouses_out_cars_item_count}</td>
                    <td>
                        <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
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

let warehousesInCar = function warehousesInCar(page = false, callbackSuccess = false, callbackError = false, sortBy = ['desc', 'id'], search = false) {
    let resource = 'warehousesInCar';
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
                let row = `<tr class="clickable" data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.car.registration} (${value.car.name})</td>
                    <td>${value.warehouse.name}</td>
                    <td>${userAvatar(value.user_get)} ${value.user_get.name}</td>
                    <td>${userAvatar(value.user_approved)} ${value.user_approved.name}</td>
                    <td>${value.created_at}</td>
                    <td>${value.document_name}</td>
                    <td>${value.warehouses_in_cars_item_count}</td>
                    <td>
                        <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
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

let carsOut = function carsOut(page = false, callbackSuccess = false, callbackError = false, sortBy = ['desc', 'id'], search = false) {
    let resource = 'carsOut';
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
                let row = `<tr class="clickable" data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.document_name}</td>
                    <td>${value.car.registration} (${value.car.name})</td>
                    <td>${value.client !== null ? value.client.name + ' (LMS ID <strong>' + value.client.client_id + '</strong>)': 'n/a'}</td>
                    <td>${value.investment !== null ? value.investment.investment_name + ' (' + value.investment.name + ')' : 'n/a'}</td>
                    <td>${userAvatar(value.user)} ${value.user.name}</td>
                    <td>${value.created_at}</td>
                    <td>
                        <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
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

let carsIn = function carsIn(page = false, callbackSuccess = false, callbackError = false, sortBy = ['desc', 'id'], search = false) {
    let resource = 'carsIn';
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
                let row = `<tr class="clickable" data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.document_name}</td>
                    <td>${value.client !== null ? value.client.name + ' (LMS ID <strong>' + value.client.client_id + '</strong>)': 'n/a'}</td>
                    <td>${value.investment !== null ? value.investment.investment_name + ' (' + value.investment.name + ')' : 'n/a'}</td>
                    <td>${value.car.registration} (${value.car.name})</td>
                    <td>${userAvatar(value.user)} ${value.user.name}</td>
                    <td>${value.created_at}</td>
                    <td>
                        <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
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

let request = function request(page = false, callbackSuccess = false, callbackError = false, sortBy = ['desc', 'date']) {
    let resource = 'request';
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
                let row = `<tr class="clickable${value.approved !== 0 ? ' table-success' : ' table-danger'}" data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${userAvatar(value.user)} ${value.user.name}</td>
                    <td>${value.document_name}</td>
                    <td>${value.date}</td>
                    <td>${value.created_at}</td>
                    <td>
                        <i class="fa fa-file-pdf action-doc font-weight-bold"></i>
                        ${userObj.id === value.user.id && !value.approved ? '<i class="tim-icons icon-pencil action-edit font-weight-bold"></i>' : ''}
                        ${userObj.id === value.user.id && !value.approved ? '<i class="tim-icons icon-simple-remove action-remove font-weight-bold"></i>' : ''}
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

let car = function car(page = false, callbackSuccess = false, callbackError = false) {
    let resource = 'car';
    let url = resource + (page !== false ? '?page=' + page : '/all');

    get(url, function(data) {
        if(callbackSuccess !== false) {
            callbackSuccess(data);
        }
    }, function(data) {
        notification.error('Nie udało się pobrać danych: ' + resource);
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

let user = function user(page = false, callbackSuccess = false, callbackError = false) {
    let resource = 'user';
    let url = resource + (page !== false ? '?page=' + page : '/all');

    get(url, function(data) {
        if(callbackSuccess !== false) {
            callbackSuccess(data);
        }
    }, function(data) {
        notification.error('Nie udało się pobrać danych: ' + resource);
    });
};

let tax = function tax(page = false, callbackSuccess = false, callbackError = false) {
    let resource = 'tax';
    let url = resource + (page !== false ? '?page=' + page : '/all');

    get(url, function(data) {
        if(callbackSuccess !== false) {
            callbackSuccess(data);
        }
    }, function(data) {
        notification.error('Nie udało się pobrać danych: ' + resource);
    });
};

let contractor = function contractor(page = false, callbackSuccess = false, callbackError = false) {
    let resource = 'contractor';
    let url = resource + (page !== false ? '?page=' + page : '/all');

    get(url, function(data) {
        if(callbackSuccess !== false) {
            callbackSuccess(data);
        }
    }, function(data) {
        notification.error('Nie udało się pobrać danych: ' + resource);
    });
};

let search = function(resource) {
    let modal = $(`div[data-element="${resource}"]`);

    $(modal).find('.resource-search').each(function() {
        let res = $(this).closest('div[data-resource]').attr('data-resource');
        let url;

        switch(res) {
            case 'client':
                url = api + 'client/search/{query}';
                break;
            case 'clientNodes':
                url = api + 'client/search/{query}/nodes';
                break;
            case 'investment':
                url = api + 'investment/search/{query}';
                break;
            case 'item':
                url = api + 'item/search/{query}';
                break;
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
                    switch(res) {
                        case 'client':
                            break;
                        case 'investment':
                            break;
                        case 'item':
                            break;
                    }

                    return settings;
                },
                onError: function(response) {
                    console.log(response);
                },
                onResponse: function(response) {
                    let convertedResponse = {
                        results : []
                    };

                    switch(res) {
                        case 'client':
                            $.each(response.data, function(index, item) {
                                let address;

                                if(item.hasOwnProperty('addresses')) {
                                    if(0 in item.addresses) {
                                        address = item.addresses[0].city;
                                    }
                                } else {
                                    address = '';
                                }

                                convertedResponse.results.push({
                                    title       : '<b>' + item.id + '</b> ' + item.name + ' ' + item.lastname,
                                    description : address,
                                    client_id   : item.id,
                                    nodes       : item.nodes,
                                    addr        : item.addresses
                                });
                            });

                            break;
                        case 'clientNodes':
                            $.each(response.data, function(index, item) {
                                let address;

                                if(item.hasOwnProperty('addresses')) {
                                    if(0 in item.addresses) {
                                        address = item.addresses[0].city;
                                    }
                                } else {
                                    address = '';
                                }

                                convertedResponse.results.push({
                                    title       : '<b>' + item.id + '</b> ' + item.name + ' ' + item.lastname,
                                    description : address,
                                    client_id   : item.id,
                                    nodes       : item.nodes,
                                    addr        : item.addresses
                                });
                            });

                            break;
                        case 'investment':
                            $.each(response, function(index, item) {
                                convertedResponse.results.push({
                                    title           : '<b>' + item.id + '</b> ' + item.name,
                                    description     : item.investment_name,
                                    investment_id   : item.id
                                });
                            });

                            break;
                        case 'item':
                            $.each(response.data, function(index, item) {
                                convertedResponse.results.push({
                                    title       : '<i>' + item.id + '</i> ' + item.model_name,
                                    description : item.items_manufacturer.name,
                                    image       : item.photo !== null ? `storage/${item.photo}` : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                                    item_id     : item.id,
                                    unit_id     : item.unit.id,
                                    unit        : item.unit.short_name,
                                    has_data    : item.has_data
                                });
                            });

                            break;
                    }

                    return convertedResponse;
                }
            },
            cache: false,
            minCharacters: 1,
            maxResults: 8,
            onSelect: function(result) {
                switch(res) {
                    case 'client':
                        $('input[name="client_id"]', modal).val(result.client_id);
                        $('input[name="client_id"]', modal).trigger('change');
                        $('button[name="client-stock"]', modal).prop('disabled', false);

                        break;
                    case 'clientNodes':
                        $('input[name="client_id"]', modal).val(result.client_id);
                        $('input[name="client_id"]', modal).trigger('change');
                        $('button[name="client-stock"]', modal).prop('disabled', false);

                        let nodes = $('table[data-data="nodes"] > tbody');

                        if(typeof result.nodes === 'object' && result.nodes !== null) {
                            if(Object.keys(result.nodes).length > 0) {
                                $(nodes).empty();

                                $.each(result.nodes, function(k,v) {
                                    let address = result.addr.find(x => x.id === v.address_id);
                                    let addressStr;

                                    if(address) {
                                        addressStr = (address.street ? address.street : address.city) + (address.house ? ` ${address.house}` : '') + (address.flat ? ` m. ${address.flat}` : '') + ', ' + address.city;
                                    } else {
                                        addressStr = 'n/a';
                                    }

                                    $(nodes).append(`<tr><td>${v.name}</td><td>${addressStr}</td><td>${v.ipaddr}</td><td>${v.passwd}</td></tr>`);
                                });

                                $(nodes).closest('table').removeClass('hidden');
                                $(nodes).closest('div').find('[name="pin"]').closest('div').addClass('hidden');
                                $(nodes).closest('.card').removeClass('hidden');
                                $(nodes).closest('div').find('[data-action="checkPin"]').addClass('hidden');
                            } else {
                                $(nodes).closest('table').addClass('hidden');
                                $(nodes).closest('div').find('[name="pin"]').closest('div').removeClass('hidden');
                                $(nodes).closest('.card').removeClass('hidden');
                                $(nodes).closest('div').find('[data-action="checkPin"]').removeClass('hidden');
                                $(nodes).closest('div').find('[data-action="checkPin"]').data('client-id', result.client_id);
                            }
                        } else {
                            $(nodes).closest('table').addClass('hidden');
                            $(nodes).closest('div').find('[name="pin"]').closest('div').removeClass('hidden');
                            $(nodes).closest('.card').removeClass('hidden');
                            $(nodes).closest('div').find('[data-action="checkPin"]').removeClass('hidden');
                            $(nodes).closest('div').find('[data-action="checkPin"]').data('client-id', result.client_id);
                        }

                        break;
                    case 'investment':
                        $('input[name="investment_id"]', modal).val(result.investment_id);
                        $('input[name="investment_id"]', modal).trigger('change');
                        $('button[name="investment-stock"]', modal).prop('disabled', false);

                        break;
                    case 'item':
                        if($(this).closest('form').data('element') === 'warehousesPlace-import') {
                            $('input[name="item_id"]', $(this).closest('tr')).val(result.item_id);
                        } else {
                            $('input[name="item_id"]', modal).val(result.item_id);
                        }

                        break;
                }
            }
        });
    });

    // resource-item
    let section = $(`section[data-element="${resource}"]`);

    $(section).find('.resource-item').each(function(key, value) {
        let row = $(this).closest('.form-row');
        let tr = $(this).closest('tr');
        let url;

        switch(resource) {
            case 'carsOut':
                url = api + 'car/search/{query}';
                break;
            case 'carsIn':
                url = api + 'client/search/{query}';
                break;
            case 'carsMove':
                url = api + 'car/search/{query}';
                break;
            case 'warehousesIn':
                url = api + 'item/search/{query}';
                break;
            case 'warehousesInCar':
                url = api + 'car/search/{query}';
                break;
            case 'warehousesOutCar':
                url = api + 'stock/search/{query}';
                break;
            case 'warehousesMove':
                url = api + 'stock/search/{query}';
                break;
            case 'request':
                url = api + 'item/search/{query}';
                break;
            case 'investment':
                url = api + 'item/search/{query}';
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
                        case 'warehousesInCar':
                            settings.url = settings.url + '/' + $(this).closest('form').find('[name="user_get_id"] option:selected').val();

                            break;
                        case 'warehousesOutCar':
                            settings.url = settings.url + '/' + $(this).closest('form').find('[name="warehouse_id"] option:selected').val();

                            break;
                        case 'warehousesMove':
                            settings.url = settings.url + '/' + $(this).closest('form').find('[name="warehouse_in_id"] option:selected').val();

                            break;
                        case 'carsIn':
                            let type = $(this).closest('form').find('[name="type"] option:selected').val();
                            let item_new = $(row).find('[name="new"]').prop('checked') ? 1 : 0;

                            if(item_new) {
                                settings.url = api + 'item/search/{query}';

                                break;
                            }

                            switch(parseInt(type)) {
                                case 0:
                                    if($(section).closest('form').find('[name="client_id"]').val().length < 1) {
                                        notification.warning('Najpierw wyszukaj źródło zwrotu');
                                        return false;
                                    }

                                    settings.url = api + 'client/search/{query}/' + $(this).closest('form').find('[name="client_id"]').val();

                                    break;
                                case 1:
                                    if($(section).closest('form').find('[name="investment_id"]').val().length < 1) {
                                        notification.warning('Najpierw wyszukaj źródło zwrotu');
                                        return false;
                                    }

                                    settings.url = api + 'investment/search/{query}/' + $(this).closest('form').find('[name="investment_id"]').val();

                                    break;
                            }

                            break;
                    }

                    return settings;
                },
                onResponse: function(response) {
                    let convertedResponse = {
                        results : []
                    };

                    switch(resource) {
                        case 'warehousesIn':
                            $.each(response.data, function(index, item) {
                                convertedResponse.results.push({
                                    title       : '<i>' + item.id + '</i> ' + item.model_name,
                                    description : item.items_manufacturer.name,
                                    image       : item.photo !== null ? `storage/${item.photo}` : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                                    item_id     : item.id,
                                    unit_id     : item.unit.id,
                                    unit        : item.unit.short_name,
                                    has_data    : item.has_data
                                });
                            });

                            break;
                        case 'warehousesInCar':
                            $.each(response.data, function(index, stock) {
                                let descr;

                                if(Object.keys(stock.element).length > 0) {
                                    descr = stock.item.items_manufacturer.name + '<br><small>(S/N: ' + stock.element[0].sn + ' / MAC: ' + stock.element[0].mac + ')</small>';
                                } else {
                                    descr = stock.item.items_manufacturer.name + '<br><small>(' + stock.quantity + ' ' + stock.item.unit.short_name + ')</small>';
                                }

                                convertedResponse.results.push({
                                    title       : stock.item_id + ' <i>' + stock.item.model_name + '</i>',
                                    description : descr,
                                    image       : stock.item.photo !== null ? `storage/${stock.item.photo}` : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                                    item_id     : stock.item_id,
                                    unit_id     : stock.item.unit.id,
                                    unit        : stock.item.unit.short_name,
                                    has_data    : stock.item.has_data,
                                    quantity    : stock.quantity,
                                    element     : stock.element
                                });
                            });

                            break;
                        case 'warehousesOutCar':
                            $.each(response.data, function(index, stock) {
                                let descr;

                                if(Object.keys(stock.element).length > 0) {
                                    descr = stock.item.items_manufacturer.name + '<br><small>(S/N: ' + stock.element[0].sn + ' / MAC: ' + stock.element[0].mac + ')</small>';
                                } else {
                                    descr = stock.item.items_manufacturer.name + '<br><small>(' + stock.quantity + ' ' + stock.item.unit.short_name + ')</small>';
                                }

                                convertedResponse.results.push({
                                    title       : stock.item_id + ' <i>' + stock.item.model_name + '</i>',
                                    description : descr,
                                    image       : stock.item.photo !== null ? `storage/${stock.item.photo}` : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                                    item_id     : stock.item_id,
                                    unit_id     : stock.item.unit.id,
                                    unit        : stock.item.unit.short_name,
                                    has_data    : stock.item.has_data,
                                    quantity    : stock.quantity,
                                    element     : stock.element
                                });
                            });

                            break;
                        case 'warehousesMove':
                            $.each(response.data, function(index, stock) {
                                let descr;

                                if(Object.keys(stock.element).length > 0) {
                                    descr = stock.item.items_manufacturer.name + '<br><small>(S/N: ' + stock.element[0].sn + ' / MAC: ' + stock.element[0].mac + ')</small>';
                                } else {
                                    descr = stock.item.items_manufacturer.name + '<br><small>(' + stock.quantity + ' ' + stock.item.unit.short_name + ')</small>';
                                }

                                convertedResponse.results.push({
                                    title       : stock.item_id + ' <i>' + stock.item.model_name + '</i>',
                                    description : descr,
                                    image       : stock.item.photo !== null ? `storage/${stock.item.photo}` : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                                    item_id     : stock.item_id,
                                    unit_id     : stock.item.unit.id,
                                    unit        : stock.item.unit.short_name,
                                    has_data    : stock.item.has_data,
                                    quantity    : stock.quantity,
                                    element     : stock.element
                                });
                            });

                            break;
                        case 'carsOut':
                            $.each(response.data, function(index, stock) {
                                let descr;

                                if(Object.keys(stock.element).length > 0) {
                                    descr = stock.item.items_manufacturer.name + '<br><small>(S/N: ' + stock.element[0].sn + ' / MAC: ' + stock.element[0].mac + ')</small>';
                                } else {
                                    descr = stock.item.items_manufacturer.name + '<br><small>(' + stock.quantity + ' ' + stock.item.unit.short_name + ')</small>';
                                }

                                convertedResponse.results.push({
                                    title       : stock.item_id + ' <i>' + stock.item.model_name + '</i>',
                                    description : descr,
                                    image       : stock.item.photo !== null ? `storage/${stock.item.photo}` : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                                    item_id     : stock.item_id,
                                    unit_id     : stock.item.unit.id,
                                    unit        : stock.item.unit.short_name,
                                    has_data    : stock.item.has_data,
                                    quantity    : stock.quantity,
                                    element     : stock.element
                                });
                            });

                            break;
                        case 'carsIn':
                            $.each(response.data, function(index, stock) {
                                let descr;

                                if(typeof stock.element !== 'undefined' && typeof stock.element !== 'null') {
                                    if(Object.keys(stock.element).length > 0) {
                                        descr = stock.item.items_manufacturer.name + '<br><small>(S/N: ' + stock.element[0].sn + ' / MAC: ' + stock.element[0].mac + ')</small>';
                                    } else {
                                        descr = stock.item.items_manufacturer.name + '<br><small>(' + stock.quantity + ' ' + stock.item.unit.short_name + ')</small>';
                                    }
                                } else {
                                    if($(row).find('[name="new"]').prop('checked')) {
                                        descr = stock.items_manufacturer.name;
                                    } else {
                                        descr = stock.item.items_manufacturer.name + '<br><small>(' + stock.quantity + ' ' + stock.item.unit.short_name + ')</small>';
                                    }
                                }

                                if($(row).find('[name="new"]').prop('checked')) {
                                    convertedResponse.results.push({
                                        title       : stock.id + ' <i>' + stock.model_name + '</i>',
                                        description : descr,
                                        image       : stock.photo !== null ? `storage/${stock.photo}` : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                                        item_id     : stock.id,
                                        unit_id     : stock.unit.id,
                                        unit        : stock.unit.short_name,
                                        has_data    : stock.has_data,
                                        quantity    : 1,
                                        element     : []
                                    });
                                } else {
                                    convertedResponse.results.push({
                                        title       : stock.item_id + ' <i>' + stock.item.model_name + '</i>',
                                        description : descr,
                                        image       : stock.item.photo !== null ? `storage/${stock.item.photo}` : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                                        item_id     : stock.item_id,
                                        unit_id     : stock.item.unit.id,
                                        unit        : stock.item.unit.short_name,
                                        has_data    : stock.item.has_data,
                                        quantity    : stock.quantity,
                                        element     : stock.element
                                    });
                                }
                            });

                            break;
                        case 'carsMove':
                            $.each(response.data, function(index, stock) {
                                let descr;

                                if(Object.keys(stock.element).length > 0) {
                                    descr = stock.item.items_manufacturer.name + '<br><small>(S/N: ' + stock.element[0].sn + ' / MAC: ' + stock.element[0].mac + ')</small>';
                                } else {
                                    descr = stock.item.items_manufacturer.name + '<br><small>(' + stock.quantity + ' ' + stock.item.unit.short_name + ')</small>';
                                }

                                convertedResponse.results.push({
                                    title       : stock.item_id + ' <i>' + stock.item.model_name + '</i>',
                                    description : descr,
                                    image       : stock.item.photo !== null ? `storage/${stock.item.photo}` : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                                    item_id     : stock.item_id,
                                    unit_id     : stock.item.unit.id,
                                    unit        : stock.item.unit.short_name,
                                    has_data    : stock.item.has_data,
                                    quantity    : stock.quantity,
                                    element     : stock.element
                                });
                            });

                            break;
                        case 'request':
                            $.each(response.data, function(index, item) {
                                convertedResponse.results.push({
                                    title       : '<i>' + item.id + '</i> ' + item.model_name,
                                    description : item.items_manufacturer.name + (typeof item.quantity[0] !== 'undefined' ? '<br>(aktualny stan: <b>' + item.quantity[0].quantity + ' ' + item.unit.short_name + '</b>)' : ''),
                                    image       : item.photo !== null ? `storage/${item.photo}` : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                                    item_id     : item.id,
                                    unit_id     : item.unit.id,
                                    unit        : item.unit.short_name
                                });
                            });

                            break;
                        case 'investment':
                            $.each(response.data, function(index, item) {
                                convertedResponse.results.push({
                                    title       : '<i>' + item.id + '</i> ' + item.model_name,
                                    description : item.items_manufacturer.name + (typeof item.quantity[0] !== 'undefined' ? '<br>(aktualny stan: <b>' + item.quantity[0].quantity + ' ' + item.unit.short_name + '</b>)' : ''),
                                    image       : item.photo !== null ? `storage/${item.photo}` : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                                    item_id     : item.id,
                                    unit_id     : item.unit.id,
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
                let quantity;

                switch(resource) {
                    case 'warehousesIn':
                        $('input[name="item_id"]', tr).val(result.item_id);
                        $('input[name="unit_id"]', tr).val(result.unit_id);
                        $('input[name="unit"]', tr).val(result.unit);
                        $('input[name="has_data"]', tr).val(result.has_data);

                        if(result.has_data) {
                            $('[name="data-add"]', tr).prop('disabled', false);
                            $('[name="quantity"]', tr).prop('disabled', true);
                        } else {
                            $('[name="data-add"]', tr).prop('disabled', true);
                            $('[name="quantity"]', tr).prop('disabled', false);
                        }

                        break;
                    case 'warehousesInCar':
                        $('input[name="item_id"]', row).val(result.item_id);
                        $('input[name="has_data"]', row).val(result.has_data);
                        $('input[name="unit"]', row).val(result.unit);

                        if(result.has_data) {
                            $('[name="data-add"]', row).prop('disabled', false);
                            $('[name="quantity"]', row).prop('disabled', true);
                        } else {
                            $('[name="data-add"]', row).prop('disabled', true);
                            $('[name="quantity"]', row).prop('disabled', false);
                        }

                        quantity = $('input[name="quantity"]', row);
                        item_data = $('input[name="item_data"]', row);

                        $(quantity).unbind('change');
                        $(quantity).val(1);
                        $(quantity).on('change', function() {
                            var min = 1;
                            var max = parseInt(result.quantity);

                            if ($(this).val() > max) {
                                $(this).val(max);
                            } else if($(this).val() < min) {
                                $(this).val(min);
                            }
                        });

                        if(typeof result.element !== 'undefined') {
                            if(Object.keys(result.element).length > 0) {
                                let json = JSON.parse($(item_data).val());

                                json.push({
                                    sn: result.element[0].sn,
                                    mac: result.element[0].mac
                                });

                                $(quantity).val(Object.keys(json).length);

                                $(item_data).val(JSON.stringify(json));
                            }
                        }

                        break;
                    case 'warehousesMove':
                        $('input[name="item_id"]', tr).val(result.item_id);
                        $('input[name="has_data"]', tr).val(result.has_data);
                        $('input[name="unit"]', tr).val(result.unit);

                        if(result.has_data) {
                            $('[name="data-add"]', tr).prop('disabled', false);
                            $('[name="quantity"]', tr).prop('disabled', true);
                        } else {
                            $('[name="data-add"]', tr).prop('disabled', true);
                            $('[name="quantity"]', tr).prop('disabled', false);
                        }

                        quantity = $('input[name="quantity"]', tr);
                        item_data = $('input[name="item_data"]', tr);

                        $(quantity).unbind('change');
                        $(quantity).val(1);
                        $(quantity).on('change', function() {
                            var min = 1;
                            var max = parseInt(result.quantity);

                            if ($(this).val() > max) {
                                $(this).val(max);
                            } else if($(this).val() < min) {
                                $(this).val(min);
                            }
                        });

                        if(Object.keys(result.element).length > 0) {
                            let json = JSON.parse($(item_data).val());

                            json.push({
                                sn: result.element[0].sn,
                                mac: result.element[0].mac
                            });

                            $(quantity).val(Object.keys(json).length);

                            $(item_data).val(JSON.stringify(json));
                        }

                        break;
                    case 'warehousesOutCar':
                        $('input[name="item_id"]', tr).val(result.item_id);
                        $('input[name="has_data"]', tr).val(result.has_data);
                        $('input[name="unit"]', tr).val(result.unit);

                        if(result.has_data) {
                            $('[name="data-add"]', tr).prop('disabled', false);
                            $('[name="quantity"]', tr).prop('disabled', true);
                        } else {
                            $('[name="data-add"]', tr).prop('disabled', true);
                            $('[name="quantity"]', tr).prop('disabled', false);
                        }

                        quantity = $('input[name="quantity"]', tr);
                        item_data = $('input[name="item_data"]', tr);

                        $(quantity).unbind('change');
                        $(quantity).val(1);
                        $(quantity).on('change', function() {
                            var min = 1;
                            var max = parseInt(result.quantity);

                            if ($(this).val() > max) {
                                $(this).val(max);
                            } else if($(this).val() < min) {
                                $(this).val(min);
                            }
                        });

                        if(Object.keys(result.element).length > 0) {
                            let json = JSON.parse($(item_data).val());

                            json.push({
                                sn: result.element[0].sn,
                                mac: result.element[0].mac
                            });

                            $(quantity).val(Object.keys(json).length);

                            $(item_data).val(JSON.stringify(json));
                        }

                        break;
                    case 'carsOut':
                        $('input[name="item_id"]', row).val(result.item_id);
                        $('input[name="has_data"]', row).val(result.has_data);
                        $('input[name="unit"]', row).val(result.unit);

                        quantity = $('input[name="quantity"]', row);
                        item_data = $('input[name="item_data"]', row);

                        if(result.has_data) {
                            $('[name="data-add"]', row).prop('disabled', false);
                            $('[name="quantity"]', row).prop('disabled', true);
                        } else {
                            $('[name="data-add"]', row).prop('disabled', true);
                            $('[name="quantity"]', row).prop('disabled', false);
                        }

                        $(quantity).unbind('change');
                        $(quantity).val(1);
                        $(quantity).on('change', function() {
                            var min = 1;
                            var max = parseInt(result.quantity);

                            if($(this).val() > max) {
                                $(this).val(max);
                            } else if($(this).val() < min) {
                                $(this).val(min);
                            }
                        });

                        if(Object.keys(result.element).length > 0) {
                            let json = JSON.parse($(item_data).val());

                            json.push({
                                sn: result.element[0].sn,
                                mac: result.element[0].mac
                            });

                            $(quantity).val(Object.keys(json).length);

                            $(item_data).val(JSON.stringify(json));
                        }

                        break;
                    case 'carsIn':
                        $('input[name="item_id"]', row).val(result.item_id);
                        $('input[name="has_data"]', row).val(result.has_data);
                        $('input[name="unit"]', row).val(result.unit);

                        quantity = $('input[name="quantity"]', row);
                        item_data = $('input[name="item_data"]', row);

                        if(result.has_data) {
                            $('[name="data-add"]', row).prop('disabled', false);
                            $('[name="quantity"]', row).prop('disabled', true);
                        } else {
                            $('[name="data-add"]', row).prop('disabled', true);
                            $('[name="quantity"]', row).prop('disabled', false);
                        }

                        $(quantity).unbind('change');
                        $(quantity).val(1);

                        if(!$('[name="new"]').prop('checked')) {
                            $(quantity).on('change', function() {
                                var min = 1;
                                var max = parseInt(result.quantity);

                                if ($(this).val() > max) {
                                    $(this).val(max);
                                } else if($(this).val() < min) {
                                    $(this).val(min);
                                }
                            });
                        }

                        if(Object.keys(result.element).length > 0) {
                            let json = JSON.parse($(item_data).val());

                            json.push({
                                sn: result.element[0].sn,
                                mac: result.element[0].mac
                            });

                            $(quantity).val(Object.keys(json).length);

                            $(item_data).val(JSON.stringify(json));
                        }

                        break;
                    case 'carsMove':
                        $('input[name="item_id"]', row).val(result.item_id);
                        $('input[name="has_data"]', row).val(result.has_data);
                        $('input[name="unit"]', row).val(result.unit);

                        quantity = $('input[name="quantity"]', row);
                        item_data = $('input[name="item_data"]', row);

                        if(result.has_data) {
                            $('[name="data-add"]', row).prop('disabled', false);
                            $('[name="quantity"]', row).prop('disabled', true);
                        } else {
                            $('[name="data-add"]', row).prop('disabled', true);
                            $('[name="quantity"]', row).prop('disabled', false);
                        }

                        $(quantity).unbind('change');
                        $(quantity).val(1);
                        $(quantity).on('change', function() {
                            var min = 1;
                            var max = parseInt(result.quantity);

                            if($(this).val() > max) {
                                $(this).val(max);
                            } else if($(this).val() < min) {
                                $(this).val(min);
                            }
                        });

                        if(Object.keys(result.element).length > 0) {
                            let json = JSON.parse($(item_data).val());

                            json.push({
                                sn: result.element[0].sn,
                                mac: result.element[0].mac
                            });

                            $(quantity).val(Object.keys(json).length);

                            $(item_data).val(JSON.stringify(json));
                        }

                        break;
                    case 'request':
                        $('input[name="item_id"]', tr).val(result.item_id);
                        $('input[name="unit"]', tr).val(result.unit);

                        break;
                    case 'investment':
                        $('input[name="item_id"]', tr).val(result.item_id);
                        $('input[name="unit"]', tr).val(result.unit);

                        break;
                }
            }
        });
    });
};

$(document).ready(function() {
    // print action
    $('.action-print').on('click', function() {
        let title = $(this).closest('.modal').find('.doc-name').text();

        $(this).closest('.modal').printThis({
            debug: false,
            pageTitle: title,
            header: '<style>table, td, th, tr, thead, tbody { color: #7c7c7c !important; }</style>'
        });
    });

    // approve action
    $('.action-approve').on('click', function() {
        let resource = $(this).attr('data-element');
        let btn = $(this);

        switch(resource) {
            case 'request':
                put(`${resource}/${clickable_id}`, {
                    approved: 1
                }, function(data) {
                    notification.success('Zapotrebowanie zostało oznaczone jako zrealizowane!');

                    $(btn).addClass('hidden');

                    refetch(resource);
                });

                break;
        }
    });

    $('.action-own-stock').on('click', function() {
       let clickableObj = new Clickable();
       let resource = 'car/stock/own';
       let modal = $(`[data-element="${resource}"]`);

        paging[resource] = 1;
        clickableObj.carStockOwn(modal, resource, null);

        $(modal).modal();
    });

    $('.action-warehouse').on('click', function() {
        let warehouseId = $(this).closest('form').find('[name="warehouse_id"]').val();
        let clickableObj = new Clickable();
        let resource = 'warehouse-clickable';
        let modal = $(`[data-element="${resource}"]`);

        if(parseInt(warehouseId)) {
            paging[resource] = 1;
            clickable_id = warehouseId;
            clickableObj.warehouse(modal, resource, warehouseId);
        } else {
            notification.info('Nie odnaleziono magazynu');
        }

        $(modal).modal();
    });

    $('.action-client-stock').on('click', function() {
       let clientId = $(this).closest('form').find('[name="client_id"]').val();
       let clientObj = new Client();

       if(parseInt(clientId)) {
           clientObj.show(clientId);
       } else {
           notification.info('Wyszukaj klienta, aby zobaczyć jego stan');
       }
    });

    $('.action-investment-stock').on('click', function() {
       let invId = $(this).closest('form').find('[name="investment_id"]').val();
       let invObj = new Investment();

       if(parseInt(invId)) {
           invObj.show(invId);
       } else {
           notification.info('Wyszukaj inwestycję, aby zobaczyć jej stan');
       }
    });

    // import element
    $('.action-import').on('click', function() {
        let resource = $(this).attr('data-element');
        let modal = $(`div[data-element="${resource}-import"]`);

        related = $(this).closest('.modal').attr('data-element');

        switch(resource) {
            case 'warehouse':
                warehouse(false, function(data) {
                    let select = $('select[name="warehouse_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $(select).selectpicker('refresh');
                });

                break;
            case 'warehousesPlace':
                warehouse(false, function(data) {
                    let select = $('select[name="warehouse_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $(select).selectpicker('refresh');
                });

                break;
        }

        search(resource);

        if(!($(modal).data('bs.modal') || {})._isShown) {
            $(modal).modal({
                backdrop: 'static'
            });

            $(modal).find('input[type="text"]')[0].focus();
        }
    });

    // add element
    $('.action-add').on('click', function() {
        let resource = $(this).attr('data-element');
        let modal = $(`div[data-element="${resource}"]`);

        let title = $('.modal-title', modal);
        let submitBtn = $('.modal-footer > button[data-type]', modal);

        related = $(this).closest('.modal').attr('data-element');

        $(modal).find('.has-danger').each(function() {
            $(this).removeClass('has-danger');
        });

        switch(resource) {
            case 'carsMove':
                user(false, function(data) {
                    let select = $('select[name="user_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $(select).selectpicker('refresh');
                });

                break;
            case 'item':
                $(title).html('Dodawanie produktu');

                $('[data-type="thumb"]', modal).empty();
                $('[name="descr"]', modal).empty();

                itemsManufacturer(false, function(data) {
                    let select = $('select[name="items_manufacturer_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $(select).find('option[value="9"]').prop('selected', true);
                    $(select).selectpicker('refresh');
                });

                itemsCategory(false, function(data) {
                    let select = $('select[name="items_category_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $(select).find('option[value="26"]').prop('selected', true);
                    $(select).selectpicker('refresh');
                });

                unit(false, function(data) {
                    let select = $('select[name="unit_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name} (${value.short_name})</option>`);
                    });

                    $(select).find('option[value="2"]').prop('selected', true);
                    $(select).selectpicker('refresh');
                });

                $('[name="has_data"]', modal).prop('disabled', false);
                $('[name="has_data"]', modal).selectpicker('refresh');

                $('[name="hidden"]', modal).find('option[value="0"]').prop('selected', true);
                $('[name="hidden"]', modal).selectpicker('refresh');

                break;
            case 'warehousesPlace':
                $(title).find('span').html('Dodawanie miejsca magazynowania');

                warehouse(false, function(data) {
                    let select = $('select[name="warehouse_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name} (${value.descr})</option>`);
                    });

                    $('option[value="8"]', select).prop('selected', true);

                    $(select).selectpicker('refresh');
                });

                break;
            case 'warehouse':
                $(title).html('Dodawanie magazynu');

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
            case 'warehousesIn':
                $(title).html('<i class="fa fa-dolly"></i>&nbsp; Nowe przyjęcie zewnętrzne');

                warehouse(false, function(data) {
                    let select = $('select[name="warehouse_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}, ${value.street}, ${value.postcode} ${value.city}</option>`);
                    });

                    $(select).selectpicker('refresh');
                });

                contractor(false, function(data) {
                    let select = $('select[name="contractor_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}, ${value.street}, ${value.postcode} ${value.city}</option>`);
                    });

                    $(select).selectpicker('refresh');
                });

                $('[name="invoice_date"]', modal).val(moment().format('YYYY-MM-DD'));
                $('[name="document_name"]', modal).val('');

                $('[name="warehouse_id"]', modal).prop('disabled', false);
                $('[name="import_only"]', modal).prop('disabled', false);
                $('.action-add-row', modal).prop('disabled', false);

                let table = $('table[data-element]', modal);

                $('tbody', table).empty();

                if(roleCache === 1) {
                    $('[name="import_only"]', modal).parent().removeClass('hidden');
                }

                break;
            case 'warehousesOutCar':
                warehouse(false, function(data) {
                    let select = $('select[name="warehouse_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $(select).selectpicker('refresh');
                });

                user(false, function(data) {
                    let select = $('select[name="user_get_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $(select).selectpicker('refresh');
                });

                break;
            case 'warehousesInCar':
                warehouse(false, function(data) {
                    let select = $('select[name="warehouse_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $(select).selectpicker('refresh');
                });

                user(false, function(data) {
                    let select = $('select[name="user_get_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $(select).selectpicker('refresh');
                });

                break;
            case 'carsOut':
                $('[name="type"]', modal).selectpicker('refresh');
                $('[name="type"]').trigger('change');

                break;
            case 'carsIn':
                $('[name="type"]', modal).selectpicker('refresh');
                $('[name="type"]').trigger('change');
                $('[name="client-stock"]').prop('disabled', true);
                $('[name="investment-stock"]').prop('disabled', true);

                break;
            case 'request':
                $('.modal-title', modal).html(`<i class="fa fa-file-import mr-2"></i>Dodaj zapotrzebowanie`);

                $('[name="warehouse_id"]', modal).prop('disabled', false);
                $('[name="notes"]', modal).val('');

                $('tbody', $('table[data-element="request"]', modal)).empty();

                warehouse(false, function(data) {
                    let select = $('select[name="warehouse_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $(select).selectpicker('refresh');
                });

                if(object(Permission).has('investment-create')) {
                    $('select[name="car_id"]', modal).closest('.form-group').removeClass('invisible');

                    car(false, function(data) {
                        let select = $('select[name="car_id"]', modal);

                        $(select).removeClass('hidden');

                        $(select).empty();

                        $.each(data, function(key, value) {
                            $(select).append(`<option value="${value.id}">${value.name} (${value.registration})</option>`);
                        });

                        $(select).selectpicker('refresh');
                    });
                } else {
                    $('select[name="car_id"]', modal).closest('.form-group').addClass('invisible');
                }

                break;
            case 'contractor':
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
            case 'itemsManufacturer':
                $(title).html('Dodawanie producenta');

                break;
            case 'itemsCategory':
                $(title).html('Dodawanie kategorii');

                break;
            case 'investment':
                $('.modal-title', modal).html('<i class="fa fa-project-diagram mr-2"></i>Dodawanie inwestycji');

                $('form', modal)[0].reset();
                $('table', modal).find('tbody > tr').remove();

                $('[name="investment_id"]', modal).val('');

                $('[name="num_city"]', modal).prop('disabled', false);
                $('[name="num_type"]', modal).prop('disabled', false);

                car(false, function(data) {
                    let select = $('[name="car_id"]', modal);

                    $(select).empty();
                    $(select).append(`<option>--- wybierz pojazd ---</option>`);

                    $.each(data, function(k,v) {
                        $(select).append(`<option value="${v.id}">${v.name} (${v.registration})</option>`);
                    });
                });

                warehouse(false, function(data) {
                    let select = $('[name="warehouse_id"]', modal);

                    $(select).empty();
                    $(select).append(`<option>--- wybierz magazyn ---</option>`);

                    $.each(data, function(k,v) {
                        $(select).append(`<option value="${v.id}">${v.name}</option>`);
                    });
                });

                break;
            case 'warehousesMove':
                warehouse(false, function(data) {
                    let select = $('select[name="warehouse_in_id"], select[name="warehouse_out_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $(select).selectpicker('refresh');
                });

                break;
        }

        search(resource);

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
            case 'request':
                get(`request/${id}/edit`, function(data) {
                    let parent = data;

                    $(title).html(`<i class="fa fa-file-import mr-2"></i>Edycja zapotrzebowania (<strong>${id}</strong>)`);

                    $('[name="warehouse_id"]', modal).find(`option[value="${data.warehouse_id}"]`).prop('selected', true);
                    $('[name="warehouse_id"]', modal).prop('disabled', true);
                    $('[name="date"]', modal).val(data.date);
                    $('[name="notes"]', modal).val(data.notes);

                    let table = $('table[data-element="request"]', modal);

                    $('tbody', table).empty();

                    warehouse(false, function(response) {
                        let select = $('select[name="warehouse_id"]', modal);

                        $(select).empty();

                        $.each(response, function(key, value) {
                            $(select).append(`<option value="${value.id}">${value.name}, ${value.street}, ${value.postcode} ${value.city}</option>`);
                        });


                        $(select).find(`[value="${parent.warehouse_id}"]`).prop('selected', true);
                        $(select).selectpicker('refresh');
                    });

                    let carSel = $('select[name="car_id"]', modal);

                    if(object(Permission).has('investment-create')) {
                        $('select[name="car_id"]', modal).removeClass('hidden');

                        car(false, function(response) {
                            $(carSel).empty();

                            $.each(response, function(k, v) {
                                $(carSel).append(`<option value="${v.id}">${v.name} (${v.registration})</option>`);
                            });

                            $(carSel).find(`[value="${parent.car_id}"]`).prop('selected', true);
                            $(carSel).selectpicker('refresh');

                            $(carSel).closest('.form-group').removeClass('invisible');
                        });
                    } else {
                        $(carSel).closest('.form-group').addClass('invisible');
                    }

                    $('.selectpicker', modal).selectpicker('refresh');

                    $.each(data.requests_item, function(k, v) {
                        let row = $('tbody', table).append(`<tr data-id="${v.id}">
                            <td>
                                <i class="tim-icons icon-simple-remove action-remove-row btn-link btn-icon btn-sm"></i>
                            </td>
                            <td>
                                <div class="ui search resource-item">
                                    <input class="form-control prompt" type="text" placeholder="Wyszukaj produkt" autocomplete="off" value="${v.item.id} ${v.item.model_name}">
                                </div>
                            </td>
                            <td>
                                <input class="form-control" name="quantity" type="number" step="1" min="1" value="${v.quantity}" required>
                            </td>
                            <td>
                                <input class="form-control" name="unit" type="text" value="${v.item.unit.short_name}" disabled>
                            </td>
                            <input type="hidden" name="item_id" value="${v.item.id}">
                        </tr>`);
                    });

                    search(element);
                });

                break;
            case 'investment':
                get(`investment/${id}/edit`, function(data) {
                    let parent = data;

                    $(title).html(`<i class="fa fa-project-diagram mr-2"></i>Edycja inwestycji (<strong>${id}</strong>) <strong>${data.name} (${data.investment_name})</strong>`);

                    $('[name="investment_name"]', modal).val(data.investment_name);

                    $('[name="investment_id"]', modal).val(data.parent_id ? data.parent_id : '');
                    $('.prompt', modal).val(data.parent_id ? data.parent.name : '');

                    $('[name="name"]', modal).val(data.name);
                    $('[name="date_start"', modal).val(data.date_start);
                    $('[name="date_end"', modal).val(data.date_end);
                    $('[name="descr"]', modal).val(data.descr);
                    $('[name="num_city"]', modal).val(data.num_city);
                    $('[name="num_type"]', modal).find(`[value="${data.num_type}"]`).prop('selected', true);

                    let table = $('table[data-element="investment"]', modal);

                    $('tbody', table).empty();

                    car(false, function(data) {
                        let select = $('[name="car_id"]', modal);

                        $(select).empty();
                        $(select).append(`<option>--- wybierz pojazd ---</option>`);

                        $.each(data, function(k,v) {
                            $(select).append(`<option value="${v.id}">${v.name} (${v.registration})</option>`);
                        });

                        $(select).find(`option[value="${parent.car_id}"]`).prop('selected', true);
                    });

                    warehouse(false, function(data) {
                        let select = $('[name="warehouse_id"]', modal);

                        $(select).empty();
                        $(select).append(`<option>--- wybierz magazyn ---</option>`);

                        $.each(data, function(k,v) {
                            $(select).append(`<option value="${v.id}">${v.name}</option>`);
                        });

                        $(select).find(`option[value="${parent.warehouse_id}"]`).prop('selected', true);
                    });

                    $('ul[class="files"]', modal).empty();

                    $.each(data.file, function(k, v) {
                        $('ul[class="files"]', modal).append(`<li>
                            <span data-file-id="${v.id}" class="clickable font-weight-600">${v.name}</span>
                            <i class="ml-2 clickable tim-icons icon-simple-remove action-remove"></i>
                        </li>`);
                    });

                    $.each(data.investments_queue_item, function(k, v) {
                        $('tbody', table).append(`<tr data-id="${v.id}">
                            <td>
                            </td>
                            <td>
                            </td>
                            <td>
                                ${v.item.model_name}
                            </td>
                            <td>
                                <input class="form-control" name="quantity" type="number" step="1" min="1" value="${v.quantity}" required>
                            </td>
                            <td>
                                <input class="form-control" name="quantity_used" type="number" step="1" min="1" value="${v.quantity_used}" required>
                            </td>
                            <td>
                                <input class="form-control" name="unit" type="text" value="${v.item.unit.short_name}" disabled>
                            </td>
                            <td>
                                <input class="form-control" type="text" name="comment" placeholder="komentarz powykonawczy" autocomplete="off" value="${v.comment ? v.comment : ''}">
                            </td>
                            <input type="hidden" name="item_id" value="${v.item.id}">
                        </tr>`);
                    });

                    if(object(Role).has(4)) {
                        $('[name="quantity"]', table).prop('disabled', true);
                        $('[name="quantity_used"]', table).prop('disabled', false);
                        $('[name="comment"]', table).prop('disabled', false);
                        $('.action-add-row', table).prop('disabled', true);
                        $('.col-lg-3', modal).find('[name]').prop('disabled', true);
                    } else {
                        $('[name="quantity"]', table).prop('disabled', false);
                        $('[name="quantity_used"]', table).prop('disabled', true);
                        $('[name="comment"]', table).prop('disabled', true);
                        $('.action-add-row', table).prop('disabled', false);
                        $('.col-lg-3', modal).find('[name]').prop('disabled', false);
                    }

                    $('[name="num_city"]', modal).prop('disabled', true);
                    $('[name="num_type"]', modal).prop('disabled', true);

                    search(element);
                });

                break;
            case 'warehousesPlace':
                $(title).find('span').html('Edycja miejsca magazynowania');

                get(`warehousesPlace/edit/${id}`, function(data) {
                    let parent = data;

                    warehouse(false, function(data) {
                        let select = $('select[name="warehouse_id"]', modal);

                        $(select).empty();

                        $.each(data, function(key, value) {
                            $(select).append(`<option value="${value.id}">${value.name} (${value.descr})</option>`);
                        });

                        $(select).find(`option[value="${parent.warehouse.id}"]`).prop('selected', true);
                        $(select).selectpicker('refresh');
                    });

                    $('[name="name"]', modal).val(data.name);

                    if(data.item_id) {
                        $('[data-resource="item"]').find('.prompt').val(data.item_id);
                        $('[name="item_id"]', modal).val(data.item_id);
                    }

                    search(element);
                });

                break;
            case 'item':
                $(title).html('Edycja produktu');

                $('[name="has_data"]', modal).prop('disabled', true);
                $('[name="unit_id"]', modal).prop('disabled', true);
                $('[data-type="thumb"]', modal).empty();

                get(`item/edit/${id}`, function(data) {
                    let parent = data;

                    itemsManufacturer(false, function(data) {
                        let select = $('select[name="items_manufacturer_id"]', modal);

                        $(select).empty();

                        $.each(data, function(key, value) {
                            $(select).append(`<option value="${value.id}">${value.name}</option>`);
                        });

                        $(select).find(`option[value="${parent.items_manufacturer_id}"]`).prop('selected', true);
                        $(select).selectpicker('refresh');
                    });

                    itemsCategory(false, function(data) {
                        let select = $('select[name="items_category_id"]', modal);

                        $(select).empty();

                        $.each(data, function(key, value) {
                            $(select).append(`<option value="${value.id}">${value.name}</option>`);
                        });

                        $(select).find(`option[value="${parent.items_category_id}"]`).prop('selected', true);
                        $(select).selectpicker('refresh');
                    });

                    unit(false, function(data) {
                        let select = $('select[name="unit_id"]', modal);

                        $(select).empty();

                        $.each(data, function(key, value) {
                            $('select[name="unit_id"]').append(`<option value="${value.id}">${value.name} (${value.short_name})</option>`);
                        });

                        $(select).find('option[value="' + parent.unit_id + '"]').prop('selected', true);
                        $(select).selectpicker('refresh');
                    });

                    $('[name="model_name"]', modal).val(data.model_name);
                    $('[name="low_quant"]', modal).val(data.low_quant);
                    $('[name="descr"]', modal).val(data.descr ? data.descr : '');
                    $('[name="parent_id"]', modal).val(data.parent_id ? data.parent_id : '');

                    $('[name="has_data"]', modal).find('option[value="' + data.has_data + '"]').prop('selected', true);
                    $('[name="has_data"]', modal).selectpicker('refresh');

                    $('[name="hidden"]', modal).find(`option[value="${data.hidden}"]`).prop('selected', true);
                    $('[name="hidden"]', modal).selectpicker('refresh');

                    if(data.photo) {
                        $('[data-type="thumb"]', modal).append(`<img src="storage/${data.photo}" alt="" style="max-height: 114px;">`);
                    }
                });

                break;
            case 'itemsManufacturer':
                $(title).html('Edycja producenta');

                get(`itemsManufacturer/edit/${id}`, function(data) {
                    $('[name="name"]', modal).val(data.name);
                });

                break;
            case 'itemsCategory':
                $(title).html('Edycja kategorii');

                get(`itemsCategory/edit/${id}`, function(data) {
                    $('[name="name"]', modal).val(data.name);
                });

                break;
            case 'unit':
                $(title).html('Edycja jedn. miary');

                get(`unit/edit/${id}`, function(data) {
                    $('[name="name"]', modal).val(data.name);
                    $('[name="short_name"]', modal).val(data.short_name);
                    $('[name="type"]', modal).find('option[value="' + data.type + '"]').prop('selected', true);

                    $('.selectpicker', modal).selectpicker('refresh');
                });

                break;
            case 'warehouse':
                $(title).html('Edycja magazynu');

                countries(false, function(data) {
                    let select = $('select[name="country_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $('select[name="country_id"] option[value="167"]', modal).prop('selected', true);

                    $('.selectpicker', modal).selectpicker('refresh');
                });

                get(`warehouse/edit/${id}`, function(data) {
                    $('[name="name"]', modal).val(data.name);
                    $('[name="descr"]', modal).val(data.descr);
                    $('[name="street"]', modal).val(data.street);
                    $('[name="postcode"]', modal).val(data.postcode);
                    $('[name="city"]', modal).val(data.city);
                    $('[name="country_id"]', modal).find('option[value="' + data.country_id + '"]').prop('selected', true);
                    $('[name="type"]', modal).find('option[value="' + data.type + '"]').prop('selected', true);

                    $('.selectpicker', modal).selectpicker('refresh');
                });

                break;
            case 'warehousesIn':
                $(title).html('Edycja przyjęcia zewnętrznego');

                contractor(false, function(data) {
                    let select = $('select[name="contractor_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}, ${value.street}, ${value.postcode} ${value.city}</option>`);
                    });
                });

                warehouse(false, function(data) {
                    let select = $('select[name="warehouse_id"]', modal);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}, ${value.street}, ${value.postcode} ${value.city}</option>`);
                    });
                });

                get(`warehousesIn/edit/${id}`, function(data) {
                    $('[name="document_name"]', modal).val(data.invoice_name);
                    $('[name="invoice_date"]', modal).val(data.invoice_date);
                    $('[name="contractor_id"]', modal).find('option[value="' + data.contractor_id + '"]').prop('selected', true);
                    $('[name="warehouse_id"]', modal).find('option[value="' + data.warehouse_id + '"]').prop('selected', true);
                    $('[name="warehouse_id"]', modal).prop('disabled', true);
                    $('[name="import_only"]', modal).prop('disabled', true);

                    $('.action-add-row', modal).prop('disabled', true);

                    $('.selectpicker', modal).selectpicker('refresh');

                    let table = $('table[data-element="warehousesIn"]', modal);

                    $('tbody', table).empty();

                    $.each(data.warehouses_in_item, function(k, v) {
                        let row = $('tbody', table).append(`<tr data-id="${v.id}">
                            <td></td>
                            <td>${v.item.model_name}</td>
                            <td></td>
                            <td>${v.quantity}</td>
                            <td>${v.item.unit.short_name}</td>
                            <td><input class="form-control" name="price_notax" type="number" step="0.01" min="0.00" value="${v.price_notax}" required></td>
                            <td>
                                <select class="form-control" name="tax_id">
                                </select>
                            </td>
                            <input type="hidden" name="tax_id">
                            <input type="hidden" name="item_id">
                            <input type="hidden" name="item_data" value="[]">
                            <input type="hidden" name="has_data">
                        </tr>`);

                        tax(false, function(data) {
                            let select = $('select[name="tax_id"]', row);

                            $(select).empty();

                            $.each(data, function(k, v) {
                                $(select).append(`<option value="${v.id}">${v.name}</option>`);
                            });

                            $(select).find(`[value="${v.tax.id}"]`).prop('selected', true);
                        });
                    });
                });

                break;
        }

        $(submitBtn).attr('data-type', 'edit');
        $(submitBtn).html('Zapisz');
        $(modal).modal();
    });

    // remove element
    $('table > tbody').on('click', '.action-remove', function() {
        let resource = $(this).closest('table').attr('data-resource');
        let element = $(this).closest('tr').attr('data-element-id');

        del(resource, element, function(data) {
            switch(resource) {
                case 'carsMove':
                    notification.success('Oczekujące przekazanie sprzętu zostało anulowane');
                    break;
                default:
                    notification.success('Element został usunięty');
            }

            refetch(resource);
        }, function(data) {
            switch(resource) {
                case 'carsMove':
                    notification.error('Nie można anulować przekazania sprzętu wprowadzonego przez innego użytkownika!');
                    break;
                default:
                    notification.error('Nie można usunąć elementu, ponieważ posiada inne przypisane elementy lub nie posiadasz uprawnień!');
            }
        });
    });

    // action-add-row
    $('.action-add-row').on('click', function() {
        let form = $(this).closest('form');
        let resource = $(form).attr('data-element');
        let section = $(this).closest('section');
        let tab = $(this).closest('table[data-element]').find('tbody');
        let row;

        switch(resource) {
            case 'item-import':
                row = $(`<tr>
                            <td>
                                <i class="tim-icons icon-simple-remove action-remove-row btn-link btn-icon btn-sm"></i>
                            </td>
                            <td>
                                <select class="form-control" name="items_manufacturer_id" >
                                </select>
                            </td>
                            <td>
                                <input type="text" class="form-control" name="model_name">
                            </td>
                            <td>
                                <select class="form-control" name="items_category_id" >
                                </select>
                            </td>
                            <td>
                                <select class="form-control" name="unit_id">
                                </select>
                            </td>
                            <td>
                                <input class="form-control" name="low_quant" type="number" step="1" min="0" value="0">
                            </td>
                            <td>
                                <select class="form-control" name="has_data">
                                    <option value="0">Nie</option>
                                    <option value="1">Tak</option>
                                </select>
                            </td>
                        </tr>`);

                let elementi = $(row).appendTo(tab);

                $(elementi).find('.prompt').focus();

                search(resource);

                itemsCategory(false, function(data) {
                    let select = $('select[name="items_category_id"]', elementi);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $(select).find('option[value="26"]').prop('selected', true);
                });

                itemsManufacturer(false, function(data) {
                    let select = $('select[name="items_manufacturer_id"]', elementi);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $(select).find('option[value="9"]').prop('selected', true);
                });

                unit(false, function(data) {
                    let select = $('select[name="unit_id"]', elementi);

                    $(select).empty();

                    $.each(data, function(key, value) {
                        $(select).append(`<option value="${value.id}">${value.name}</option>`);
                    });

                    $(select).find('option[value="2"]').prop('selected', true);
                });

                break;
            case 'warehousesPlace-import':
                row = $(`<tr>
                            <td>
                                <i class="tim-icons icon-simple-remove action-remove-row btn-link btn-icon btn-sm"></i>
                            </td>
                            <td>
                                <input class="form-control" name="name" type="text" minlength="3" aria-label="Nazwa miejsca">
                            </td>
                            <td>
                                <div class="ui search resource-search" data-resource="item">
                                    <div class="ui icon input">
                                        <input class="form-control prompt" type="text" placeholder="Wyszukaj produkt" autocomplete="off">
                                        <i class="search icon"></i>
                                    </div>
                                </div>
                            </td>
                            <input type="hidden" name="item_id">
                        </tr>`);

                let elementy = $(row).appendTo(tab);

                $(elementy).find('.prompt').focus();

                search(resource);

                break;
            case 'warehousesIn':
                row = $(`<tr>
                            <td>
                                <i class="tim-icons icon-simple-remove action-remove-row btn-link btn-icon btn-sm"></i>
                            </td>
                            <td>
                                <div class="ui search resource-item">
                                    <input class="form-control prompt" type="text" placeholder="Wyszukaj produkt" autocomplete="off">
                                </div>
                            </td>
                            <td>
                                <button type="button" class="btn btn-info btn-block" name="data-add" style="margin-top: -1px;" disabled>Dane produktu</button>
                            </td>
                            <td>
                                <input class="form-control" name="quantity" type="number" step="1" min="1" value="1" required>
                            </td>
                            <td>
                                <input class="form-control" name="unit" type="text" disabled>
                            </td>
                            <td>
                                <input class="form-control" name="price_notax" type="number" step="0.01" min="0.00" value="1.00" required>
                            </td>
                            <td>
                                <select class="form-control" name="tax_id" >
                                </select>
                            </td>
                            <input type="hidden" name="tax_id">
                            <input type="hidden" name="item_id">
                            <input type="hidden" name="item_data" value="[]">
                            <input type="hidden" name="has_data">
                        </tr>`);

                let element = $(row).appendTo(tab);

                $(element).find('.prompt').focus();

                search(resource);

                tax(false, function(data) {
                    let tax = $('select[name="tax_id"]', element);

                    $(tax).empty();

                    $.each(data, function(key, value) {
                        $(tax).append(`<option value="${value.id}">${value.name}</option>`);
                    });
                });

                break;
            case 'investment':
                row = $(`<tr>
                            <td>
                                <i class="tim-icons icon-simple-remove action-remove-row btn-link btn-icon btn-sm"></i>
                            </td>
                            <td>
                                <div class="form-check">
                                    <label class="form-check-label hidden">
                                        <input class="form-check-input" type="checkbox" name="add_to_request" value="true">
                                        <span class="form-check-sign"></span>
                                    </label>
                                </div>
                            </td>
                            <td>
                                <div class="ui search resource-item">
                                    <input class="form-control prompt" type="text" placeholder="Wyszukaj produkt" autocomplete="off">
                                </div>
                            </td>
                            <td>
                                <input class="form-control" name="quantity" type="number" step="1" min="1" value="1" required>
                            </td>
                            <td>
                                <input class="form-control" name="quantity_used" type="number" step="1" min="0" value="0" disabled>
                            </td>
                            <td>
                                <input class="form-control" name="unit" type="text" disabled>
                            </td>
                            <td>
                                <input class="form-control" type="text" name="comment" placeholder="komentarz powykonawczy" autocomplete="off" disabled>
                            </td>
                            <input type="hidden" name="item_id">
                        </tr>`);

                let elementInvestment = $(row).appendTo(tab);

                $(elementInvestment).find('.prompt').focus();

                search(resource);

                break;
            case 'request':
                row = $(`<tr>
                            <td>
                                <i class="tim-icons icon-simple-remove action-remove-row btn-link btn-icon btn-sm"></i>
                            </td>
                            <td>
                                <div class="ui search resource-item">
                                    <input class="form-control prompt" type="text" placeholder="Wyszukaj produkt" autocomplete="off">
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

                let elementRequest = $(row).appendTo(tab);

                $(elementRequest).find('.prompt').focus();

                search(resource);

                break;
            case 'warehousesInCar':
                row = `<div class="form-row mb-1">
                            <div class="col-lg-1 col-md-1">
                                <i class="tim-icons icon-simple-remove action-remove action-remove-row btn-link btn-icon btn-sm"></i>
                            </div>
                            <div class="col-lg-2 col-md-2">
                                <div class="ui search resource-item">
                                    <div class="ui icon input">
                                        <input class="form-control prompt" type="text" placeholder="Podaj indeks" autocomplete="off">
                                        <i class="search icon"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6">
                                <button type="button" class="btn btn-info btn-block" name="data-add" style="margin-top: -1px;" disabled>Dodaj dane</button>
                            </div>
                            <div class="col-lg-1 col-md-1">
                                <input class="form-control" name="quantity" type="number" step="1" min="1" max="10" value="1" required>
                            </div>
                            <div class="col-lg-1 col-md-1">
                                <input class="form-control" name="unit" type="text" disabled required>
                            </div>
                            <div class="col-lg-1 col-md-1">
                            </div>
                            <input type="hidden" name="item_id">
                            <input type="hidden" name="item_data" value="[]">
                            <input type="hidden" name="has_data">
                        </div>`;

                $(section).find('.form-row').last().after(row);
                $(section).find('.form-row').last().find('.prompt').focus();

                search(resource);

                break;
            case 'warehousesOutCar':
                row = $(`<tr>
                            <td>
                                <i class="tim-icons icon-simple-remove action-remove-row btn-link btn-icon btn-sm"></i>
                            </td>
                            <td>
                                <div class="ui search resource-item">
                                    <input class="form-control prompt" type="text" placeholder="Wyszukaj produkt" autocomplete="off">
                                </div>
                            </td>
                            <td>
                                <button type="button" class="btn btn-info btn-block" name="data-add" style="margin-top: -1px;" disabled>Dane produktu</button>
                            </td>
                            <td>
                                <input class="form-control" name="quantity" type="number" step="1" min="1" value="1" required>
                            </td>
                            <td>
                                <input class="form-control" name="unit" type="text" disabled>
                            </td>
                            <input type="hidden" name="item_id">
                            <input type="hidden" name="item_data" value="[]">
                            <input type="hidden" name="has_data">
                        </tr>`);

                let elementWOC = $(row).appendTo(tab);

                $(elementWOC).find('.prompt').focus();

                search(resource);

                break;
            case 'carsOut':
                row = `<div class="form-row mb-1">
                            <div class="col-lg-1 col-md-1">
                                <i class="tim-icons icon-simple-remove action-remove action-remove-row btn-link btn-icon btn-sm"></i>
                            </div>
                            <div class="col-lg-2 col-md-2">
                                <div class="ui search resource-item">
                                    <div class="ui icon input">
                                        <input class="form-control prompt" type="text" placeholder="Wyszukaj produkt" autocomplete="off">
                                        <i class="search icon"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6">
                                <button type="button" class="btn btn-info btn-block" name="data-add" style="margin-top: -1px;" disabled>Dodaj dane</button>
                            </div>
                            <div class="col-lg-1 col-md-1">
                                <input class="form-control" name="quantity" type="number" step="1" min="1" max="10" value="1" required>
                            </div>
                            <div class="col-lg-1 col-md-1">
                                <input class="form-control" name="unit" type="text" disabled required>
                            </div>
                            <div class="col-lg-1 col-md-1">
                            </div>
                            <input type="hidden" name="item_id">
                            <input type="hidden" name="item_data" value="[]">
                            <input type="hidden" name="has_data">
                        </div>`;

                $(form).find('.form-row').last().after(row);
                $(form).find('.form-row').last().find('.prompt').focus();

                search(resource);

                break;
            case 'carsIn':
                row = `<div class="form-row mb-1">
                            <div class="col-lg-1 col-md-1">
                                <i class="tim-icons icon-simple-remove action-remove action-remove-row btn-link btn-icon btn-sm"></i>
                            </div>
                            <div class="col-lg-2 col-md-2">
                                <div class="ui search resource-item">
                                    <div class="ui icon input">
                                        <input class="form-control prompt" type="text" placeholder="Wyszukaj produkt" autocomplete="off">
                                        <i class="search icon"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6">
                                <button type="button" class="btn btn-info btn-block" name="data-add" style="margin-top: -1px;" disabled>Dodaj dane</button>
                            </div>
                            <div class="col-lg-1 col-md-1">
                                <input class="form-control" name="quantity" type="number" step="1" min="1" max="10" value="1" required>
                            </div>
                            <div class="col-lg-1 col-md-1">
                                <input class="form-control" name="unit" type="text" disabled required>
                            </div>
                            <div class="col-lg-1 col-md-1">
                                <div class="form-check form-check-inline" style="margin-top: 10px;">
                                    <label class="form-check-label text-center">
                                      <input class="form-check-input" name="new" type="checkbox" value="">
                                      <span class="form-check-sign">Brak</span>
                                    </label>
                                </div>
                            </div>
                            <input type="hidden" name="item_id">
                            <input type="hidden" name="item_data" value="[]">
                            <input type="hidden" name="has_data">
                        </div>`;

                $(form).find('.form-row').last().after(row);
                $(form).find('.form-row').last().find('.prompt').focus();

                search(resource);

                break;
            case 'warehousesMove':
                row = $(`<tr>
                            <td>
                                <i class="tim-icons icon-simple-remove action-remove-row btn-link btn-icon btn-sm"></i>
                            </td>
                            <td>
                                <div class="ui search resource-item">
                                    <input class="form-control prompt" type="text" placeholder="Wyszukaj produkt" autocomplete="off">
                                </div>
                            </td>
                            <td>
                                <button type="button" class="btn btn-info btn-block" name="data-add" style="margin-top: -1px;" disabled>Dane produktu</button>
                            </td>
                            <td>
                                <input class="form-control" name="quantity" type="number" step="1" min="1" value="1" required>
                            </td>
                            <td>
                                <input class="form-control" name="unit" type="text" disabled>
                            </td>
                            <input type="hidden" name="item_id">
                            <input type="hidden" name="item_data" value="[]">
                            <input type="hidden" name="has_data">
                        </tr>`);

                let elementWarehousesMove = $(row).appendTo(tab);

                $(elementWarehousesMove).find('.prompt').focus();

                search(resource);

                break;
            case 'carsMove':
                row = `<div class="form-row mb-1">
                            <div class="col-lg-1 col-md-1">
                                <i class="tim-icons icon-simple-remove action-remove action-remove-row btn-link btn-icon btn-sm"></i>
                            </div>
                            <div class="col-lg-2 col-md-2">
                                <div class="ui search resource-item">
                                    <div class="ui icon input">
                                        <input class="form-control prompt" type="text" placeholder="Wyszukaj produkt" autocomplete="off">
                                        <i class="search icon"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6">
                                <button type="button" class="btn btn-info btn-block" name="data-add" style="margin-top: -1px;" disabled>Dodaj dane</button>
                            </div>
                            <div class="col-lg-1 col-md-1">
                                <input class="form-control" name="quantity" type="number" step="1" min="1" max="10" value="1" required>
                            </div>
                            <div class="col-lg-1 col-md-1">
                                <input class="form-control" name="unit" type="text" disabled required>
                            </div>
                            <div class="col-lg-1 col-md-1">
                            </div>
                            <input type="hidden" name="item_id">
                            <input type="hidden" name="item_data" value="[]">
                            <input type="hidden" name="has_data">
                        </div>`;

                $(section).find('.form-row').last().after(row);
                $(section).find('.form-row').last().find('.prompt').focus();

                search(resource);

                break;
        }
    });

    // TR click actions
    $('table > tbody').on('click', '.clickable td:not(:last-child)', function() {
        if($(this).hasClass('expand-table') || $(this).hasClass('collapse-table')) {
            return;
        }

        let resource = $(this).closest('table').attr('data-resource');
        let id = $(this).closest('tr').attr('data-element-id');
        let modal = $('div[data-element="' + resource + '-clickable"]');
        let element = $(this).closest('div[data-element]').attr('data-element');
        let clickable = new Clickable();
        let url;
        let page;

        if(typeof element === 'undefined') {
            clickable_id = id;
        }

        switch(element) {
            case 'item-clickable':
                modal = $('div[data-element="data-show"]');

                $('table > tbody', modal).empty();

                get('stock/' + id, function(data) {
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
            case 'warehouse-clickable':
                modal = $('div[data-element="data-show"]');

                $('table > tbody', modal).empty();

                get('stock/' + id, function(data) {
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

        switch(resource) {
            case 'item':
                page = 1;
                url = `item/${id}/stock` + (page !== false ? '?page=' + page : '/all');

                get(url, function(data) {
                    $('.modal-title', modal).html(`Produkt <strong>${data.items_manufacturer.name} ${data.model_name}</strong> (id: ${id})`);

                    $('table[data-resource="item-clickable"] > tbody', modal).empty();

                    let count = 0;

                    if(Object.keys(data.warehouses_stock).length < 1) {
                        let ths = $('table[data-resource="item-clickable"] > thead', modal).find('th');

                        count = Object.keys(ths).length;
                        $('table[data-resource="item-clickable"] > tbody', modal).append(`<tr><td colspan="${count}" class="text-center">Brak produktu na stanie</td></tr>`);
                    }

                    let quantity = 0;

                    $.each(data.warehouses_stock, function(key, value) {
                        let tbody = `<tr ${!parseInt(data.has_data) || 'class="clickable"' } data-element-id="${value.id}">
                            <td>${data.id}</td>
                            <td>${value.warehouse.name}</td>
                            <td>${Object.keys(value.warehouse.warehouses_place).length ? value.warehouse.warehouses_place[0].name : ''}</td>
                            <td>${value.quantity}</td>
                            <td>${data.unit.short_name}</td>
                        </tr>`;

                        quantity = quantity + value.quantity;

                        $('table[data-resource="item-clickable"] > tbody', modal).append(tbody);
                    });

                    if(object(Permission).has('item-edit')) {
                        $('table[data-resource="last-wIn"] > tbody', modal).empty();

                        if(Object.keys(data.warehouses_in_item).length < 1) {
                            let ths = $('table[data-resource="last-wIn"] > thead', modal).find('th');

                            count = Object.keys(ths).length;
                            $('table[data-resource="last-wIn"] > tbody', modal).append(`<tr><td colspan="${count}" class="text-center">Brak ostatnich przyjęć zewnętrznych</td></tr>`);
                        }

                        $.each(data.warehouses_in_item, function(key, value) {
                            let tbody = `<tr data-element-id="${value.id}">
                                <td>${value.warehouses_in.document_name}</td>
                                <td>${value.warehouses_in.warehouse.name}</td>
                                <td>${value.warehouses_in.contractor.name}</td>
                                <td>${userAvatar(value.warehouses_in.user)} ${value.warehouses_in.user.name}</td>
                                <td>${value.warehouses_in.created_at}</td>
                                <td>${value.warehouses_in.invoice_name}</td>
                                <td>${value.warehouses_in.invoice_date}</td>
                                <td>${value.quantity}</td>
                                <td>${data.unit.short_name}</td>
                                <td>${value.price_notax}</td>
                            </tr>`;

                            $('table[data-resource="last-wIn"] > tbody', modal).append(tbody);
                        });
                    } else {
                        $('table[data-resource="last-wIn"]', modal).closest('.card').hide();
                    }

                    if(quantity < data.low_quant) {
                        $('.modal-title', modal).append('&nbsp; <span class="alert alert-danger">Niski stan produktu!</span>');
                    }

                    if(data.photo) {
                        $('[data-data="item-clickable"] > div', modal).first().removeClass('hidden').html(`<div class="card"><div class="card-body text-center"><img style="max-height: 500px;" class="img-responsive" src="${storage + data.photo}"></div></div>`);
                    } else {
                        $('[data-data="item-clickable"] > div', modal).first().addClass('hidden');
                    }
                });

                break;
            case 'warehousesIn':
                $('.modal-title', modal).html(`Przyjęcie zewnętrzne (id: ${id})`);

                url = `warehousesIn/${id}`;

                get(url, function(data) {
                    $('.warehouse', modal).html(`${data.warehouse.name}<br>${data.warehouse.street}<br>${data.warehouse.postcode} ${data.warehouse.city}`);
                    $('.contractor', modal).html(`${data.contractor.name}<br>${data.contractor.street}<br>${data.contractor.postcode} ${data.contractor.city}<br>NIP ${data.contractor.nip}`);
                    $('.user', modal).html(`${data.user.name}`);
                    $('.name', modal).html(`${data.document_name}<br><small>do faktury ${data.invoice_name}<br>z dnia ${data.invoice_date}</small>`);
                    $('.notes', modal).html(`${data.notes ? data.notes : 'brak'}`);
                    $('.date', modal).html(`${data.created_at}`);

                    $('table > tbody', modal).empty();

                    let all_notax = 0.00;
                    let all_withtax = 0.00;

                    $.each(data.warehouses_in_item, function(key, value) {
                        let sum_notax = (parseFloat(value.price_notax) * value.quantity).toFixed(2);
                        let sum_withtax = (parseFloat(value.price_notax) * value.quantity * (1+(value.tax.multipler/100))).toFixed(2);

                        all_notax = all_notax + parseFloat(sum_notax);
                        all_withtax = all_withtax + parseFloat(sum_withtax);

                        let tbody = `<tr>
                            <td>${value.id}</td>
                            <td>${value.item.id}</td>
                            <td>${value.item.items_manufacturer.name}</td>
                            <td>${value.item.model_name}</td>
                            <td>${value.quantity}</td>
                            <td>${value.item.unit.short_name}</td>
                            <td>${value.price_notax}</td>
                            <td>${value.tax.name}</td>
                            <td>${value.price_withtax}</td>
                            <td>${sum_notax}</td>
                            <td>${sum_withtax}</td>
                            <td></td>
                        </tr>`;

                        $('table > tbody', modal).append(tbody);

                        if(value.item.has_data) {
                            let ths = $('table > thead', modal).find('th');
                            let count = Object.keys(ths).length;

                            let el = `<tr><td></td><td></td><td colspan="${count-2}">`;
                            let i = 0;

                            $.each(value.element, function(k, v) {
                                i++;
                                el = el + `<strong>${i}</strong> S/N: ${v.sn} MAC: ${v.mac}<br>`;
                            });

                            el = el + `</td></tr>`;

                            $('table > tbody', modal).append(el);
                        }
                    });

                    $('table > tbody', modal).append(`<tr><td colspan="9"></td><td>${parseFloat(all_notax).toFixed(2)}</td><td>${parseFloat(all_withtax).toFixed(2)}</td></tr>`);

                    $('.files', modal).empty();

                    $.each(data.file, function(k, v) {
                        $('.files', modal).append(`<li><span data-file-id="${v.id}" class="clickable font-weight-600">${v.name}</span></li>`);
                    })
                });

                break;
            case 'warehousesImport':
                $('.modal-title', modal).html(`<i class="fa fa-box-open mr-1"></i>Import magazynowy (id: ${id})`);

                url = `${resource}/${id}`;

                get(url, function(data) {
                    $('.warehouse', modal).html(`${data.warehouse.name}<br>${data.warehouse.street}<br>${data.warehouse.postcode} ${data.warehouse.city}`);
                    $('.user', modal).html(`${data.user.name}`);
                    $('.notes', modal).html(`${data.notes ? data.notes : 'brak'}`);
                    $('.name', modal).html(`IMPORT/${data.id}`);
                    $('.date', modal).html(`${data.created_at}`);

                    $('table > tbody', modal).empty();

                    $.each(data.warehouses_imports_item, function(key, value) {
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
                            let count = Object.keys(ths).length;

                            let el = `<tr><td></td><td></td><td colspan="${count-2}">`;
                            let i = 0;

                            $.each(value.element, function(k, v) {
                                i++;
                                el = el + `<strong>${i}</strong> S/N: ${v.sn} MAC: ${v.mac}<br>`;
                            });

                            el = el + `</td></tr>`;

                            $('table > tbody', modal).append(el);
                        }
                    });
                });

                break;
            case 'client':
                $('.modal-title', modal).html(`Stan klienta (id: ${id})`);

                url = `client/${id}`;

                get(url, function(data) {
                    $('.client', modal).html(`<strong>ID klienta: </strong>${data.client_id}<br>${data.name}<br>${data.address}`);
                    $('.client_name', modal).html(`${data.name} (ID: ${data.client_id})`);
                    // $('.user', modal).html(`${data.user.name}`);
                    $('.notes', modal).html(`${data.notes ? data.notes : '-'}`);
                    $('.date', modal).html(`${data.created_at}`);

                    $('table > tbody', modal).empty();

                    $.each(data.clients_item, function(key, value) {
                        let tbody = `<tr>
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
                });

                break;
            case 'investment':
                url = `investment/${id}`;

                get(url, function(data) {
                    $('.modal-title', modal).html(`Stan inwestycji (<strong>${id}</strong>) <strong>${data.name} (${data.investment_name})</strong>`);

                    $('.investment', modal).html(`<strong>Numer inwestycji: </strong>${data.investment_name}<br>${data.name}`);
                    $('.investment_name', modal).html(`${data.name} (${data.investment_name})`);
                    $('.user', modal).html(`${data.user.name}`);
                    $('.descr', modal).html(`${data.descr ? (data.descr).replace(/(?:\r\n|\r|\n)/g, '<br>') : 'brak'}`);
                    $('.date', modal).html(`${data.created_at}`);

                    let table = $('.stock', modal);
                    let tableQueue = $('.planned', modal);
                    let tableSchemas = $('.schemas', modal);

                    $('tbody', table).empty();
                    $('tbody', tableQueue).empty();
                    $('tbody', tableSchemas).empty();

                    if(!(Object.keys(data.children).length > 0)) {
                        noResults(tableSchemas);
                    } else {
                        let addRow = function addRow(el) {
                            $(tableSchemas).append(`<tr data-element-id="${el.id}">
                                <td>${el.id}</td>
                                <td>${Object.keys(el.children).length > 0 ? '<i class="fa fa-chevron-down mr-2"></i>' : ''} ${el.name}</td>
                                <td>${el.date_start}</td>
                                <td>${el.date_end}</td>
                                <td>${object(Investment).parseStatus(el.status)}</td>
                            </tr>`)
                        };

                        let recurse = function recurse(node) {
                            for(let i = 0, count = node.children.length; i < count; i++) {
                                addRow(node.children[i]);
                                recurse(node.children[i]);
                            }
                        };

                        recurse(data);
                    }

                    if(!(Object.keys(data.investments_queue_item).length > 0)) {
                        noResults(tableQueue);
                    } else {
                        let avgSum = 0.00;

                        $.each(data.investments_queue_item, function(key, value) {
                            let avgPrice = 0.00;

                            if(value.item.avg_price !== null) {
                                if(typeof value.item.avg_price[0] !== 'undefined') {
                                    avgPrice = Math.round(value.item.avg_price[0].avg * value.quantity * 100) / 100;
                                    avgSum = avgSum + avgPrice;
                                }
                            }

                            let row = `<tr>
                                <td>${value.item.id}</td>
                                <td>${value.item.items_manufacturer.name}</td>
                                <td>${value.item.model_name}</td>
                                <td>${value.quantity}</td>
                                <td>${value.item.unit.short_name}</td>
                                <td>${avgPrice > 0.00 ? avgPrice.toFixed(2) : 'n/a'}</td>
                            </tr>`;

                            $('tbody', tableQueue).append(row);
                        });

                        $('tbody', tableQueue).append(`<tr><td class="text-right" colspan="5"><strong>Suma</strong></td><td>${avgSum.toFixed(2)}</td></tr>`);
                    }

                    if(!(Object.keys(data.investments_item).length > 0)) {
                        noResults(table);
                    } else {
                        let avgSum = 0.00;

                        $.each(data.investments_item, function(key, value) {
                            let avgPrice = 0.00;

                            if(value.item.avg_price !== null) {
                                if(typeof value.item.avg_price[0] !== 'undefined') {
                                    avgPrice = Math.round(value.item.avg_price[0].avg * value.quantity * 100) / 100;
                                    avgSum = avgSum + avgPrice;
                                }
                            }

                            let row = `<tr>
                                <td>${value.item.id}</td>
                                <td>${value.item.items_manufacturer.name}</td>
                                <td>${value.item.model_name}</td>
                                <td>${value.quantity}</td>
                                <td>${value.item.unit.short_name}</td>
                                <td>${avgPrice > 0.00 ? avgPrice.toFixed(2) : 'n/a'}</td>
                            </tr>`;

                            $('tbody', table).append(row);

                            if(value.item.has_data) {
                                let ths = $('thead', table).find('th');
                                let count = Object.keys(ths).length;

                                let el = `<tr><td></td><td></td><td colspan="${count - 2}">`;
                                let i = 0;

                                $.each(value.element, function (k, v) {
                                    i++;
                                    el = el + '<strong>' + i + `</strong>. S/N: ${v.sn} MAC: ${v.mac}<br>`;
                                });

                                el = el + `</td></tr>`;

                                $('tbody', table).append(el);
                            }
                        });

                        $('tbody', table).append(`<tr><td class="text-right" colspan="5"><strong>Suma</strong></td><td>${(avgSum).toFixed(2)}</td></tr>`);
                    }

                    $('.files', modal).empty();

                    if(Object.keys(data.file).length > 0) {
                        $('.attachments', modal).removeClass('hidden');
                    } else {
                        $('.attachments', modal).addClass('hidden');
                    }

                    $.each(data.file, function(k, v) {
                        $('.files', modal).append(`<li><span data-file-id="${v.id}" class="clickable font-weight-600">${v.name}</span></li>`);
                    })
                });

                break;
            case 'warehousesMove':
                $('.modal-title', modal).html(`Przesunięcie międzymagazynowe (id: ${id})`);

                url = `warehousesMove/${id}`;

                get(url, function(data) {
                    $('.warehouse_in', modal).html(`${data.warehouse_in.name}<br>${data.warehouse_in.street}<br>${data.warehouse_in.postcode} ${data.warehouse_in.city}`);
                    $('.warehouse_out', modal).html(`${data.warehouse_out.name}<br>${data.warehouse_out.street}<br>${data.warehouse_out.postcode} ${data.warehouse_out.city}`);
                    $('.user', modal).html(`${data.user.name}`);
                    $('.name', modal).html(`${data.document_name}`);
                    $('.notes', modal).html(`${data.notes ? data.notes : '-'}`);
                    $('.date', modal).html(`${data.created_at}`);

                    $('table > tbody', modal).empty();

                    $.each(data.warehouses_moves_item, function(key, value) {
                        let tbody = `<tr>
                            <td>${value.id}</td>
                            <td>${value.item_id}</td>
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
                });

                break;
            case 'warehousesOutCar':
                $('.modal-title', modal).html(`Rozchód wewnętrzny (id: ${id})`);

                url = `warehousesOutCar/${id}`;

                get(url, function(data) {
                    $('.warehouse', modal).html(`${data.warehouse.name}<br>${data.warehouse.street}<br>${data.warehouse.postcode} ${data.warehouse.city}`);
                    $('.car', modal).html(`${data.car.name} (${data.car.registration})`);
                    $('.user-approved', modal).html(`${data.user_approved.name}`);
                    $('.user-get', modal).html(`${data.user_get.name}`);
                    $('.name', modal).html(`${data.document_name}`);
                    $('.notes', modal).html(`${data.notes ? data.notes : '-'}`);
                    $('.date', modal).html(`${data.created_at}`);

                    $('table > tbody', modal).empty();

                    $.each(data.warehouses_out_cars_item, function(key, value) {
                        let tbody = `<tr>
                            <td>${value.id}</td>
                            <td>${value.item_id}</td>
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
                });

                break;
            case 'warehousesInCar':
                $('.modal-title', modal).html(`Zwrot wewnętrzny (id: ${id})`);

                url = `warehousesInCar/${id}`;

                get(url, function(data) {
                    $('.warehouse', modal).html(`${data.warehouse.name}<br>${data.warehouse.street}<br>${data.warehouse.postcode} ${data.warehouse.city}`);
                    $('.car', modal).html(`${data.car.name} (${data.car.registration})`);
                    $('.user-approved', modal).html(`${data.user_approved.name}`);
                    $('.user-get', modal).html(`${data.user_get.name}`);
                    $('.name', modal).html(`${data.document_name}`);
                    $('.notes', modal).html(`${data.notes ? data.notes : '-'}`);
                    $('.date', modal).html(`${data.created_at}`);

                    $('table > tbody', modal).empty();

                    $.each(data.warehouses_in_cars_item, function(key, value) {
                        let tbody = `<tr>
                            <td>${value.id}</td>
                            <td>${value.item_id}</td>
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
                });

                break;
            case 'carsOut':
                $('.modal-title', modal).html(`Wydanie zewnętrzne (id: ${id})`);

                url = `carsOut/${id}`;

                get(url, function(data) {
                    $('.car', modal).html(`${data.car.name}<br>(${data.car.registration})`);
                    $('.client', modal).html(`${data.client !== null ? 'Klient: LMS ID ' + data.client.client_id + '<br>' + data.client.name + '<br>' + data.client.address : 'Inwestycja:<br>' + data.investment.investment_name + ' (' + data.investment.name + ')'}`);
                    $('.user', modal).html(`${data.user.name}`);
                    $('.name', modal).html(`${data.document_name}`);
                    $('.notes', modal).html(`${data.notes ? data.notes : '-'}`);
                    $('.date', modal).html(`${data.created_at}`);

                    $('table > tbody', modal).empty();

                    $.each(data.cars_outs_item, function(key, value) {
                        let tbody = `<tr>
                            <td>${value.id}</td>
                            <td>${value.item_id}</td>
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
                });

                break;
            case 'carsIn':
                $('.modal-title', modal).html(`Zwrot od klienta/z inwestycji (id: ${id})`);

                url = `carsIn/${id}`;

                get(url, function(data) {
                    $('.car', modal).html(`${data.car.name}<br>(${data.car.registration})`);
                    $('.client', modal).html(`${data.client !== null ? 'Klient: LMS ID ' + data.client.client_id + '<br>' + data.client.name + '<br>' + data.client.address : 'Inwestycja:<br>' + data.investment.investment_name + ' (' + data.investment.name + ')'}`);
                    $('.user', modal).html(`${data.user.name}`);
                    $('.name', modal).html(`${data.document_name}`);
                    $('.notes', modal).html(`${data.notes ? data.notes : '-'}`);
                    $('.date', modal).html(`${data.created_at}`);

                    $('table > tbody', modal).empty();

                    $.each(data.cars_ins_item, function(key, value) {
                        let tbody = `<tr>
                            <td>${value.id}</td>
                            <td>${value.item_id}</td>
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
                });

                break;
            case 'request':
                $('.modal-title', modal).html(`<i class="fa fa-file-import mr-2"></i>Zapotrzebowanie (<strong>${id}</strong>)`);

                url = `request/${id}`;

                get(url, function(data) {
                    $('.warehouse', modal).html(`${data.warehouse.name}<br>${data.warehouse.street}<br>${data.warehouse.postcode} ${data.warehouse.city}`);
                    $('.user', modal).html(`${data.user.name}`);
                    $('.name', modal).html(`${data.document_name}`);
                    $('.notes', modal).html(`${data.notes ? (data.notes).replace(/(?:\r\n|\r|\n)/g, '<br>') : '-'}`);
                    $('.date', modal).html(`${data.created_at}`);
                    $('.date-request', modal).html(`${data.date}`);

                    if(data.car === null) {
                        $('.car', modal).parent().addClass('invisible');
                    } else {
                        $('.car', modal).parent().removeClass('invisible');
                        $('.car', modal).html(`${data.car.name} (${data.car.registration})`);
                    }

                    $('table > tbody', modal).empty();

                    $.each(data.requests_item, function (key, value) {
                        let tbody = `<tr>
                            <td>${value.id}</td>
                            <td>${value.item_id}</td>
                            <td>${value.item.items_manufacturer.name}</td>
                            <td>${value.item.model_name}</td>
                            <td>${value.quantity}</td>
                            <td>${Object.keys(value.item.quantity).length ? value.item.quantity[0].quantity : '0'}</td>
                            <td>${value.item.unit.short_name}</td>
                        </tr>`;

                        $('table > tbody', modal).append(tbody);
                    });

                    if(object(Permission).has('request-approve') && !data.approved) {
                        $('.action-approve', modal).removeClass('hidden');
                    } else {
                        $('.action-approve', modal).addClass('hidden');
                    }
                });

                break;
            case 'warehouse':
                paging[resource + '-clickable'] = 1;

                clickable.warehouse(modal, resource + '-clickable', clickable_id);

                break;
            case 'carsMove':
                carsMoveObj.show(id);

                break;
        }

        $(modal).modal({
            backdrop: 'static'
        });
    });

    $('button[data-action="submit"]').on('click', function() {
        $('form[data-element="' + $(this).attr('data-form') + '"]').submit();
    });

    $('form[data-element]').on('submit', function(e) {
        e.preventDefault();

        let form = $(this);
        let modal = $(this).closest('.modal');
        let resource = $(this).attr('data-element');
        let button = $(form).closest('.modal-content').find('button[data-action="submit"]');
        let type = $(button).attr('data-type');

        let errors = 0;

        switch(type) {
            case 'add':
                switch(resource) {
                    case 'warehousesPlace':
                        $(button).prop('disabled', true);

                        post(resource, {
                            warehouse_id: $('select[name="warehouse_id"] option:selected', $(this)).val(),
                            item_id: $('input[name="item_id"]', $(this)).val(),
                            name: $('input[name="name"]', $(this)).val(),
                        }, function(data) {
                            notification.success('Miejsce magazynowania zostało dodane!');

                            $(`div[data-element="${resource}"]`).modal('hide');
                            $(form)[0].reset();

                            refetch(resource);

                            $(button).prop('disabled', false);
                        }, function(data) {
                            msg = `Miejsce magazynowania nie zostało dodane, sprawdź wprowadzone dane/czy miejsce już istnieje`;

                            parseErrors(form, data, msg);

                            $(button).prop('disabled', false);
                        });

                        break;
                    case 'investment':
                        object(Investment).store(form);

                        break;
                    case 'contractor':
                        $(button).prop('disabled', true);

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

                            $('div[data-element="' + resource + '"]').modal('hide');
                            $(form)[0].reset();

                            refetch(resource);

                            $(button).prop('disabled', false);
                        }, function(data) {
                            notification.error('Kontrahent nie został dodany, sprawdź wprowadzone dane.');

                            $(button).prop('disabled', false);
                        });

                        break;
                    case 'carsOut':
                        $(button).prop('disabled', true);

                        let carsOuts_items = [];
                        let carsOuts_items_ids = [];

                        $(this).find('.form-row').each(function() {
                            let quantity = $('[name="quantity"]', $(this)).val();
                            let item_id = $('[name="item_id"]', $(this)).val();
                            let item_data = $('[name="item_data"]', $(this)).val();

                            let item_data_object = trimItemData(JSON.parse(item_data));

                            if(Object.keys(item_data_object).length < 1 && parseInt($('[name="has_data"]', $(this)).val()) > 0) {
                                notification.error('Produkt, który posiada dodatkowe parametry musi posiadać minimum jedną parę S/N i MAC');
                                errors++;
                            }

                            if(!validateItemData(item_data_object)) {
                                notification.error(`Znaleziono zdublowane SN/MAC przy indeksie: <strong>${item_id}</strong>`);
                                errors++;
                            }

                            carsOuts_items.push({
                                item_id: item_id,
                                quantity: quantity,
                                data: JSON.stringify(item_data_object)
                            });

                            if($.inArray(item_id, carsOuts_items_ids) !== -1) {
                                notification.error('Produkty nie mogą się powtarzać!');
                                errors++;
                            }

                            carsOuts_items_ids.push(item_id);
                        });

                        if(errors > 0) {
                            $(button).prop('disabled', false);
                            return;
                        }

                        post(resource, {
                            car_id: $('[name="car_id"] option:selected', $(this)).val(),
                            client_id: $('[name="client_id"]', $(this)).val(),
                            investment_id: $('[name="investment_id"]', $(this)).val(),
                            contract_name: $('[name="contract_name"]', $(this)).val(),
                            notes: $('[name="notes"]', $(this)).val(),
                            type: $('[name="type"] option:selected', $(this)).val(),
                            items: carsOuts_items
                        }, function(data) {
                            notification.success('Wydanie do klienta zostało wprowadzone!');

                            $(`div[data-element="${resource}"]`).modal('hide');

                            $(form).find('.form-row').not(':first').remove();
                            $(form).find('.form-row').first().find('[name="item_data"]').val(JSON.stringify([]));
                            $(form)[0].reset();
                            $(form).find('[data-data="nodes"]').closest('.card').addClass('hidden');

                            refetch(resource);

                            $(button).prop('disabled', false);
                        }, function(data) {
                            switch(data.status) {
                                case 422:
                                    notification.error('Stan własny został zablokowany i nie ma możliwości jego zmiany');
                                    break;
                                default:
                                    notification.error('Wydanie do klienta nie zostało dodane, sprawdź wprowadzone dane (w szczególności numery seryjne i adresy MAC)');
                                    break;
                            }

                            $(form).find('[data-data="nodes"]').closest('.card').addClass('hidden');
                            $(button).prop('disabled', false);
                        });

                        break;
                    case 'carsIn':
                        $(button).prop('disabled', true);

                        let carsIns_items = [];
                        let carsIns_items_ids = [];

                        $(this).find('.form-row').each(function() {
                            let quantity = $('[name="quantity"]', $(this)).val();
                            let item_id = $('[name="item_id"]', $(this)).val();
                            let item_data = $('[name="item_data"]', $(this)).val();
                            let item_new = $('[name="new"]', $(this)).prop('checked') ? 1 : 0;

                            let item_data_object = trimItemData(JSON.parse(item_data));

                            if(Object.keys(item_data_object).length < 1 && parseInt($('[name="has_data"]', $(this)).val()) > 0) {
                                notification.error('Produkt, który posiada dodatkowe parametry musi posiadać minimum jedną parę S/N i MAC');
                                errors++;
                            }

                            if(!validateItemData(item_data_object)) {
                                notification.error(`Znaleziono zdublowane SN/MAC przy indeksie: <strong>${item_id}</strong>`);
                                errors++;
                            }

                            carsIns_items.push({
                                item_id: item_id,
                                quantity: quantity,
                                data: JSON.stringify(item_data_object),
                                item_new: item_new
                            });

                            if($.inArray(item_id, carsIns_items_ids) !== -1) {
                                notification.error('Produkty nie mogą się powtarzać! W każdej pozycji indeks produktu musi być inny.');
                                errors++;
                            }

                            carsIns_items_ids.push(item_id);
                        });

                        if(errors > 0) {
                            $(button).prop('disabled', false);
                            return;
                        }

                        post(resource, {
                            car_id: $('[name="car_id"] option:selected', $(this)).val(),
                            client_id: $('[name="client_id"]', $(this)).val(),
                            investment_id: $('[name="investment_id"]', $(this)).val(),
                            contract_name: $('[name="contract_name"]', $(this)).val(),
                            notes: $('[name="notes"]', $(this)).val(),
                            type: $('[name="type"] option:selected', $(this)).val(),
                            items: carsIns_items
                        }, function(data) {
                            notification.success('Zwrot od klienta został wprowadzony!');

                            $('div[data-element="' + resource + '"]').modal('hide');

                            $(form).find('.form-row').not(':first').remove();
                            $(form).find('.form-row').first().find('[name="item_data"]').val(JSON.stringify([]));
                            $(form)[0].reset();

                            refetch(resource);

                            $(button).prop('disabled', false);
                        }, function(data) {
                            switch(data.status) {
                                case 422:
                                    notification.error('Stan własny został zablokowany i nie ma możliwości jego zmiany');
                                    break;
                                default:
                                    notification.error('Zwrot nie został wprowadzony, sprawdź wprowadzone dane (w szczególności numery seryjne i adresy MAC)');
                                    break;
                            }

                            $(button).prop('disabled', false);
                        });

                        break;
                    case 'warehousesMove':
                        $(button).prop('disabled', true);

                        let warehousesMove_items = [];
                        let warehousesMove_items_ids = [];

                        $('table > tbody', form).find('tr').each(function() {
                            let quantity = $('[name="quantity"]', $(this)).val();
                            let item_id = $('[name="item_id"]', $(this)).val();
                            let item_data = $('[name="item_data"]', $(this)).val();

                            let item_data_object = trimItemData(JSON.parse(item_data));

                            if(Object.keys(item_data_object).length < 1 && parseInt($('[name="has_data"]', $(this)).val()) > 0) {
                                notification.error('Produkt, który posiada dodatkowe parametry musi posiadać minimum jedną parę S/N i MAC');
                                errors++;
                            }

                            if(!validateItemData(item_data_object)) {
                                notification.error(`Znaleziono zdublowane SN/MAC przy indeksie: <strong>${item_id}</strong>`);
                                errors++;
                            }

                            warehousesMove_items.push({
                                item_id: item_id,
                                quantity: quantity,
                                data: JSON.stringify(item_data_object)
                            });

                            if($.inArray(item_id, warehousesMove_items_ids) !== -1) {
                                notification.error('Indeksy nie mogą się powtarzać!');
                                errors++;
                            }

                            warehousesMove_items_ids.push(item_id);
                        });

                        if(errors > 0) {
                            $(button).prop('disabled', false);
                            return;
                        }

                        if($('[name="warehouse_in_id"] option:selected', $(this)).val() === $('[name="warehouse_out_id"] option:selected', $(this)).val()) {
                            notification.error('Przesunięcie międzymagazynowe nie zostało wprowadzone, magazyn docelowy nie może być taki sam jak magazyn źródłowy!');
                            $(button).prop('disabled', false);
                            return;
                        }

                        post(resource, {
                            warehouse_in_id: $('[name="warehouse_in_id"] option:selected', $(this)).val(),
                            warehouse_out_id: $('[name="warehouse_out_id"] option:selected', $(this)).val(),
                            notes: $('[name="notes"]', $(this)).val(),
                            items: warehousesMove_items
                        }, function(data) {
                            notification.success('Przesunięcie międzymagazynowe zostało wprowadzone!');

                            file(`warehousesMove/${data.id}/pdf`, function(blob) {
                                pdf(blob, `MM_${data.id}.pdf`);
                            });

                            $(`div[data-element="${resource}"]`).modal('hide');

                            $(form)[0].reset();
                            $('tbody', form).find('tr').remove();

                            refetch(resource);

                            $(button).prop('disabled', false);
                        }, function(data) {
                            notification.error('Przesunięcie międzymagazynowe nie zostało dodane, sprawdź wprowadzone dane (w szczególności numery seryjne i adresy MAC)');

                            $(button).prop('disabled', false);
                        });

                        break;
                    case 'carsMove':
                        $(button).prop('disabled', true);

                        let carsMove_items = [];
                        let carsMove_items_ids = [];

                        $(this).find('.form-row').each(function() {
                            let quantity = $('[name="quantity"]', $(this)).val();
                            let item_id = $('[name="item_id"]', $(this)).val();
                            let item_data = $('[name="item_data"]', $(this)).val();

                            let item_data_object = trimItemData(JSON.parse(item_data));

                            if(Object.keys(item_data_object).length < 1 && parseInt($('[name="has_data"]', $(this)).val()) > 0) {
                                notification.error('Produkt, który posiada dodatkowe parametry musi posiadać minimum jedną parę S/N i MAC');
                                errors++;
                            }

                            if(!validateItemData(item_data_object)) {
                                notification.error(`Znaleziono zdublowane SN/MAC przy indeksie: <strong>${item_id}</strong>`);
                                errors++;
                            }

                            carsMove_items.push({
                                item_id: item_id,
                                quantity: quantity,
                                data: JSON.stringify(item_data_object)
                            });

                            if($.inArray(item_id, carsMove_items_ids) !== -1) {
                                notification.error('Indeksy nie mogą się powtarzać!');
                                errors++;
                            }

                            carsMove_items_ids.push(item_id);
                        });

                        if(errors > 0) {
                            $(button).prop('disabled', false);
                            return;
                        }

                        /*
                        if($('[name="user_id"] option:selected', $(this)).val() === $('[name="warehouse_out_id"] option:selected', $(this)).val()) {
                            notification.error('Przesunięcie międzymagazynowe nie zostało wprowadzone, magazyn docelowy nie może być taki sam jak magazyn źródłowy!');
                            $(button).prop('disabled', false);
                            return;
                        }
                        */

                        post(resource, {
                            user_id: $('[name="user_id"] option:selected', $(this)).val(),
                            notes: $('[name="notes"]', $(this)).val(),
                            items: carsMove_items
                        }, function(data) {
                            notification.success('Przekazanie sprzętu zostało wprowadzone! Po akceptacji przez użytkownika docelowego sprzęt zostanie przekazany.');

                            file(`carsMove/${data.id}/pdf`, function(blob) {
                                pdf(blob, `MMT_${data.id}.pdf`);
                            });

                            $('div[data-element="' + resource + '"]').modal('hide');

                            $(form).find('.form-row').not(':first').remove();
                            $(form).find('.form-row').first().find('[name="item_data"]').val(JSON.stringify([]));
                            $(form)[0].reset();

                            refetch(resource);

                            $(button).prop('disabled', false);
                        }, function(data) {
                            switch(data.status) {
                                case 422:
                                    notification.error('Stan własny został zablokowany i nie ma możliwości jego zmiany');
                                    break;
                                default:
                                    notification.error('Przekazanie sprzętu nie zostało wprowadzone, sprawdź wprowadzone dane (w szczególności numery seryjne i adresy MAC)');
                                    break;
                            }

                            $(button).prop('disabled', false);
                        });

                        break;
                    case 'warehousesOutCar':
                        $(button).prop('disabled', true);

                        let warehousesOutCar_items = [];
                        let warehousesOutCar_items_ids = [];

                        $('table > tbody', form).find('tr').each(function() {
                            let quantity = $('[name="quantity"]', $(this)).val();
                            let item_id = $('[name="item_id"]', $(this)).val();
                            let item_data = $('[name="item_data"]', $(this)).val();

                            let item_data_object = trimItemData(JSON.parse(item_data));

                            if(Object.keys(item_data_object).length < 1 && parseInt($('[name="has_data"]', $(this)).val()) > 0) {
                                notification.error('Produkt, który posiada dodatkowe parametry musi posiadać minimum jedną parę S/N i MAC');
                                errors++;
                            }

                            if(!validateItemData(item_data_object)) {
                                notification.error(`Znaleziono zdublowane SN/MAC przy indeksie: <strong>${item_id}</strong>`);
                                errors++;
                            }

                            warehousesOutCar_items.push({
                                item_id: item_id,
                                quantity: quantity,
                                data: JSON.stringify(item_data_object)
                            });

                            if($.inArray(item_id, warehousesOutCar_items_ids) !== -1) {
                                notification.error('Produkty nie mogą się powtarzać!');
                                errors++;
                            }

                            warehousesOutCar_items_ids.push(item_id);
                        });

                        if(errors > 0) {
                            $(button).prop('disabled', false);
                            return;
                        }

                        post(resource, {
                            car_id: $('[name="car_id"] option:selected', $(this)).val(),
                            warehouse_id: $('[name="warehouse_id"] option:selected', $(this)).val(),
                            user_get_id: $('[name="user_get_id"]', $(this)).val(),
                            notes: $('[name="notes"]', $(this)).val(),
                            items: warehousesOutCar_items
                        }, function(data) {
                            notification.success('Rozchód wewnętrzny został wprowadzony!');

                            file(`warehousesOutCar/${data.id}/pdf`, function(blob) {
                                pdf(blob, `RW_${data.id}.pdf`);
                            });

                            $(`div[data-element="${resource}"]`).modal('hide');

                            $(form)[0].reset();
                            $('tbody', form).find('tr').remove();

                            refetch(resource);

                            $(button).prop('disabled', false);
                        }, function(data) {
                            notification.error('Rozchód wewnętrzny nie został dodany, sprawdź wprowadzone dane (w szczególności numery seryjne i adresy MAC)');

                            $(button).prop('disabled', false);
                        });

                        break;
                    case 'warehousesInCar':
                        $(button).prop('disabled', true);

                        let warehousesInCar_items = [];
                        let warehousesInCar_items_ids = [];

                        $(this).find('.form-row').each(function() {
                            let quantity = $('[name="quantity"]', $(this)).val();
                            let item_id = $('[name="item_id"]', $(this)).val();
                            let item_data = $('[name="item_data"]', $(this)).val();

                            let item_data_object = trimItemData(JSON.parse(item_data));

                            if(Object.keys(item_data_object).length < 1 && parseInt($('[name="has_data"]', $(this)).val()) > 0) {
                                notification.error('Produkt, który posiada dodatkowe parametry musi posiadać minimum jedną parę S/N i MAC');
                                errors++;
                            }

                            if(!validateItemData(item_data_object)) {
                                notification.error(`Znaleziono zdublowane SN/MAC przy indeksie: <strong>${item_id}</strong>`);
                                errors++;
                            }

                            warehousesInCar_items.push({
                                item_id: item_id,
                                quantity: quantity,
                                data: JSON.stringify(item_data_object)
                            });

                            if($.inArray(item_id, warehousesInCar_items_ids) !== -1) {
                                notification.error('Indeksy nie mogą się powtarzać!');
                                errors++;
                            }

                            warehousesInCar_items_ids.push(item_id);
                        });

                        if(errors > 0) {
                            $(button).prop('disabled', false);
                            return;
                        }

                        post(resource, {
                            car_id: $('[name="car_id"] option:selected', $(this)).val(),
                            warehouse_id: $('[name="warehouse_id"] option:selected', $(this)).val(),
                            user_get_id: $('[name="user_get_id"]', $(this)).val(),
                            notes: $('[name="notes"]', $(this)).val(),
                            items: warehousesInCar_items
                        }, function(data) {
                            notification.success('Zwrot wewnętrzny został wprowadzony!');

                            file(`warehousesInCar/${data.id}/pdf`, function(blob) {
                                pdf(blob, `ZW_${data.id}.pdf`);
                            });

                            $('div[data-element="' + resource + '"]').modal('hide');

                            $(form).find('.form-row').not(':first').remove();
                            $(form).find('.form-row').first().find('[name="item_data"]').val(JSON.stringify([]));
                            $(form)[0].reset();

                            refetch(resource);

                            $(button).prop('disabled', false);
                        }, function(data) {
                            notification.error('Zwrot wewnętrzny nie został dodany, sprawdź wprowadzone dane (w szczególności numery seryjne i adresy MAC)');

                            $(button).prop('disabled', false);
                        });

                        break;
                    case 'request':
                        $(button).prop('disabled', true);

                        let requests_items = [];

                        $('table > tbody', form).find('tr').each(function() {
                            let quantity = $('[name="quantity"]', $(this)).val();
                            let item_id = $('[name="item_id"]', $(this)).val();

                            requests_items.push({
                                item_id: item_id,
                                quantity: quantity
                            });
                        });

                        if(errors > 0) {
                            $(button).prop('disabled', false);
                            return;
                        }

                        post(resource, {
                            warehouse_id: $('[name="warehouse_id"] option:selected', $(this)).val(),
                            car_id: $('[name="car_id"] option:selected', $(this)).val(),
                            notes: $('[name="notes"]', $(this)).val(),
                            date: $('[name="date"]', $(this)).val(),
                            items: requests_items
                        }, function(data) {
                            notification.success('Zapotrzebowanie zostało wprowadzone!');

                            $(`div[data-element="${resource}"]`).modal('hide');

                            $(form)[0].reset();
                            $('tbody', form).find('tr').remove();

                            refetch(resource);

                            $(button).prop('disabled', false);
                        }, function(data) {
                            notification.error('Zapotrzebowanie nie zostało wprowadzone, sprawdź wprowadzone dane.');

                            $(button).prop('disabled', false);
                        });

                        break;
                    case 'warehousesIn':
                        $(button).prop('disabled', true);

                        let warehousesIn_items = [];
                        let warehousesIn_items_ids = [];

                        $('table > tbody', form).find('tr').each(function() {
                            let quantity = $('[name="quantity"]', $(this)).val();
                            let item_id = $('[name="item_id"]', $(this)).val();
                            let item_data = $('[name="item_data"]', $(this)).val();

                            let item_data_object = trimItemData(JSON.parse(item_data));

                            if(Object.keys(item_data_object).length < 1 && parseInt($('[name="has_data"]', $(this)).val()) > 0) {
                                notification.error('Produkt, który posiada dodatkowe parametry musi posiadać minimum jedną parę S/N i MAC');
                                errors++;
                            }

                            if(!validateItemData(item_data_object)) {
                                notification.error(`Znaleziono zdublowane SN/MAC przy indeksie: <strong>${item_id}</strong>`);
                                errors++;
                            }

                            warehousesIn_items.push({
                                item_id: item_id,
                                tax_id: $('[name="tax_id"]', $(this)).val(),
                                quantity: quantity,
                                price_notax: parseFloat($('[name="price_notax"]', $(this)).val()),
                                data: JSON.stringify(item_data_object)
                            });

                            if($.inArray(item_id, warehousesIn_items_ids) !== -1) {
                                notification.error('Indeksy nie mogą się powtarzać!');
                                errors++;
                            }

                            warehousesIn_items_ids.push(item_id);
                        });

                        if(errors > 0) {
                            $(button).prop('disabled', false);
                            return;
                        }

                        let formData = new FormData();

                        let files = $('input[name="file"]', form);

                        if($(files).get(0).files !== null) {
                            if(Object.keys($(files).get(0).files).length > 0) {
                                $.each($(files).get(0).files, function(k,v) {
                                    formData.append('file[]', v);
                                });
                            } else {
                                if(!$('[name="import_only"]', form).prop('checked')) {
                                    $(button).prop('disabled', false);

                                    notification.error('Nie wybrano pliku faktury');

                                    return;
                                }
                            }
                        } else {
                            if(!$('[name="import_only"]', form).prop('checked')) {
                                $(button).prop('disabled', false);

                                notification.error('Nie wybrano pliku faktury');

                                return;
                            }
                        }

                        let wInData = {
                            contractor_id: $('[name="contractor_id"] option:selected', form).val(),
                            document_name: $('[name="document_name"]', form).val(),
                            invoice_date: $('[name="invoice_date"]', form).val(),
                            warehouse_id: $('[name="warehouse_id"] option:selected', form).val(),
                            import_only: $('[name="import_only"]', form).prop('checked') ? 1 : 0,
                            notes: $('[name="notes"]', form).val(),
                            items: JSON.stringify(warehousesIn_items)
                        };

                        $.each(wInData, function(k,v) {
                            formData.append(k, v);
                        });

                        post(resource, formData, function(data) {
                            if(!$('[name="import_only"]').prop('checked')) {
                                notification.success('Przyjęcie zewnętrzne zostało wprowadzone!');

                                file(`warehousesIn/${data.id}/pdf`, function(blob) {
                                    pdf(blob, `PZ_${data.id}.pdf`);
                                });
                            } else {
                                notification.success('Import magazynowy (bez PZ) został wprowadzony!');
                            }

                            $(`div[data-element="${resource}"]`).modal('hide');

                            $(form)[0].reset();
                            $('tbody', form).find('tr').remove();

                            refetch(resource);

                            $(button).prop('disabled', false);
                        }, function(data) {
                            notification.error('Przyjęcie magazynowe nie zostało dodane, sprawdź wprowadzone dane.');

                            $(button).prop('disabled', false);
                        });

                        break;
                    case 'warehouse':
                        $(button).prop('disabled', true);

                        post(resource, {
                            country_id: $('select[name="country_id"] option:selected', $(this)).val(),
                            name: $('input[name="name"]', $(this)).val(),
                            descr: $('input[name="descr"]', $(this)).val(),
                            postcode: $('input[name="postcode"]', $(this)).val(),
                            street: $('input[name="street"]', $(this)).val(),
                            city: $('input[name="city"]', $(this)).val(),
                            type: $('select[name="type"] option:selected', $(this)).val()
                        }, function(data) {
                            notification.success('Magazyn został dodnay!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');

                            $(form)[0].reset();

                            refetch(resource);
                        }, function(data) {
                            msg = `Magazyn nie został dodany, sprawdź wprowadzone dane.`;

                            parseErrors(form, data, msg);
                        });

                        $(button).prop('disabled', false);

                        break;
                    case 'unit':
                        $(button).prop('disabled', true);

                        post(resource, {
                            name: $('input[name="name"]', $(this)).val(),
                            short_name: $('input[name="short_name"]', $(this)).val(),
                            type: $('select[name="type"] option:selected', $(this)).val()
                        }, function(data) {
                            notification.success('Jednostka miary została dodana!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');

                            $(form)[0].reset();

                            refetch(resource);
                        }, function(data) {
                            msg = 'Jednostka miary nie została dodana, sprawdź wprowadzone dane.';

                            parseErrors(form, data, msg);
                        });

                        $(button).prop('disabled', false);

                        break;
                    case 'itemsCategory':
                        $(button).prop('disabled', true);

                        post(resource, {
                            name: $('input[name="name"]', $(this)).val()
                        }, function(data) {
                            notification.success('Kategoria została dodana!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');

                            $(form)[0].reset();

                            refetch(resource);
                        }, function(data) {
                            msg = `Kategoria nie została dodana, sprawdź wprowadzone dane.`;

                            parseErrors(form, data, msg);

                            notification.error(body);
                        });

                        $(button).prop('disabled', false);

                        break;
                    case 'itemsManufacturer':
                        $(button).prop('disabled', true);

                        post(resource, {
                            name: $('input[name="name"]', $(this)).val()
                        }, function(data) {
                            notification.success('Producent został dodany!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');

                            $(form)[0].reset();

                            refetch(resource);
                        }, function(data) {
                            msg = `Producent nie został dodany, sprawdź wprowadzone dane.`;

                            parseErrors(form, data, msg);

                            notification.error(body);
                        });

                        $(button).prop('disabled', false);

                        break;
                    case 'item':
                        $(button).prop('disabled', true);

                        let data = new FormData();

                        let input = {
                            model_name: $('input[name="model_name"]', $(this)).val(),
                            parent_id: $('input[name="parent_id"]', $(this)).val(),
                            descr: $('textarea[name="descr"]', $(this)).val(),
                            items_category_id: $('select[name="items_category_id"] option:selected', $(this)).val(),
                            items_manufacturer_id: $('select[name="items_manufacturer_id"] option:selected', $(this)).val(),
                            unit_id: $('select[name="unit_id"] option:selected', $(this)).val(),
                            has_data: $('select[name="has_data"] option:selected', $(this)).val(),
                            low_quant: $('input[name="low_quant"]', $(this)).val(),
                            hidden: $('select[name="hidden"] option:selected', $(this)).val()
                        };

                        $.each(input, function(key, value) {
                            data.append(key, value);
                        });

                        if($('input[name="photo"]', $(this)).get(0).files !== null) {
                            if(Object.keys($('input[name="photo"]', $(this)).get(0).files).length > 0) {
                                let photo = $('input[name="photo"]', $(this)).get(0).files[0];
                                data.append('photo', photo);
                            }
                        }

                        post(resource, data, function(data) {
                            notification.success('Produkt został dodany!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');

                            $(form)[0].reset();

                            refetch(resource);
                        }, function(data) {
                            msg = `Produkt nie został dodany, sprawdź wprowadzone dane.`;

                            parseErrors(form, data, msg);
                        });

                        $(button).prop('disabled', false);

                        break;
                    case 'car':
                        $(button).prop('disabled', true);

                        post(resource, {
                            name: $('input[name="name"]', $(this)).val(),
                            registration: $('input[name="registration"]', $(this)).val()
                        }, function(data) {
                            notification.success('Pojazd został dodany!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');
                            $(form)[0].reset();

                            refetch(resource);
                        }, function(data) {
                            msg = `Pojazd nie został dodany, sprawdź wprowadzone dane.`;

                            parseErrors(form, data, msg);
                        });

                        $(button).prop('disabled', false);

                        break;
                }

                break;
            case 'edit':
                switch(resource) {
                    case 'request':
                        $(button).prop('disabled', true);

                        let requests_items = [];

                        $('table > tbody', form).find('tr').each(function() {
                            let quantity = $('[name="quantity"]', $(this)).val();
                            let item_id = $('[name="item_id"]', $(this)).val();

                            requests_items.push({
                                item_id: item_id,
                                quantity: quantity
                            });
                        });

                        if(errors > 0) {
                            $(button).prop('disabled', false);
                            return;
                        }

                        put(`${resource}/${editable_id}`, {
                            warehouse_id: $('[name="warehouse_id"] option:selected', $(this)).val(),
                            car_id: $('[name="car_id"] option:selected', $(this)).val(),
                            notes: $('[name="notes"]', $(this)).val(),
                            date: $('[name="date"]', $(this)).val(),
                            items: requests_items
                        }, function(data) {
                            notification.success('Zapotrzebowanie zostało zaktualizowane!');

                            $(`div[data-element="${resource}"]`).modal('hide');

                            $(form)[0].reset();
                            $('tbody', form).find('tr').remove();

                            refetch(resource);

                            $(button).prop('disabled', false);
                        }, function(data) {
                            notification.error('Zapotrzebowanie nie zostało zaktualizowane, sprawdź wprowadzone dane.');

                            $(button).prop('disabled', false);
                        });

                        break;
                    case 'warehousesPlace':
                        put(resource + '/' + editable_id, {
                            warehouse_id: $('[name="warehouse_id"]', $(this)).val(),
                            item_id: $('[name="item_id"]', $(this)).val(),
                            name: $('[name="name"]', $(this)).val(),
                        }, function(data) {
                            notification.success('Miejsce magazynowe zostało zaktualizowane!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');
                            $(form)[0].reset();

                            refetch(resource);
                        }, function(data) {
                            notification.error('Miejsce magazynowania nie zostało zaktualizowane, sprawdź wprowadzone dane.');
                        });

                        break;
                    case 'investment':
                        object(Investment).update(editable_id, form);

                        break;
                    case 'item':
                        let data = new FormData();

                        let input = {
                            model_name: $('[name="model_name"]', $(this)).val(),
                            parent_id: $('[name="parent_id"]', $(this)).val(),
                            descr: $('textarea[name="descr"]', $(this)).val(),
                            items_category_id: $('[name="items_category_id"] option:selected', $(this)).val(),
                            items_manufacturer_id: $('[name="items_manufacturer_id"] option:selected', $(this)).val(),
                            unit_id: $('[name="unit_id"] option:selected', $(this)).val(),
                            low_quant: $('[name="low_quant"]', $(this)).val(),
                            hidden: $('[name="hidden"] option:selected', $(this)).val(),
                        };

                        $.each(input, function(key, value) {
                            data.append(key, value);
                        });

                        if($('input[name="photo"]', $(this)).get(0).files !== null) {
                            if(Object.keys($('input[name="photo"]', $(this)).get(0).files).length > 0) {
                                let photo = $('input[name="photo"]', $(this)).get(0).files[0];
                                data.append('photo', photo);
                            }
                        }

                        put(`${resource}/${editable_id}`, data, function(data) {
                            notification.success('Produkt został zaktualizowany!');

                            $('[name="has_data"]', $(this)).prop('disabled', false);

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');
                            $(form)[0].reset();

                            refetch(resource);
                        }, function(data) {
                            notification.error('Produkt nie został zaktualizowany, sprawdź wprowadzone dane.');
                        });

                        break;
                    case 'warehouse':
                        put(resource + '/' + editable_id, {
                            name: $('[name="name"]', $(this)).val(),
                            descr: $('[name="descr"]', $(this)).val(),
                            street: $('[name="street"]', $(this)).val(),
                            postcode: $('[name="postcode"]', $(this)).val(),
                            city: $('[name="city"]', $(this)).val(),
                            country_id: $('[name="country_id"] option:selected', $(this)).val(),
                            type: $('[name="type"]', $(this)).val()
                        }, function(data) {
                            notification.success('Magazyn został zaktualizowany!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');
                            $(form)[0].reset();

                            refetch(resource);
                        }, function(data) {
                            notification.error('Magazyn nie został zaktualizowany, sprawdź wprowadzone dane.');
                        });

                        break;
                    case 'itemsCategory':
                        put(resource + '/' + editable_id, {
                            name: $('[name="name"]', $(this)).val()
                        }, function(data) {
                            notification.success('Kategoria została zaktualizowana!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');
                            $(form)[0].reset();

                            refetch(resource);
                        }, function(data) {
                            notification.error('Kategoria nie została zaktualizowana, sprawdź wprowadzone dane.');
                        });

                        break;
                    case 'itemsManufacturer':
                        put(resource + '/' + editable_id, {
                            name: $('[name="name"]', $(this)).val()
                        }, function(data) {
                            notification.success('Producent został zaktualizowany!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');
                            $(form)[0].reset();

                            refetch(resource);
                        }, function(data) {
                            notification.error('Producent nie został zaktualizowany, sprawdź wprowadzone dane.');
                        });

                        break;
                    case 'unit':
                        put(resource + '/' + editable_id, {
                            name: $('[name="name"]', $(this)).val(),
                            short_name: $('[name="short_name"]', $(this)).val(),
                            type: $('[name="type"] option:selected', $(this)).val()
                        }, function(data) {
                            notification.success('Jedn. miary została zaktualizowana!');

                            $('div[data-element="' + $(form).attr('data-element') + '"]').modal('hide');
                            $(form)[0].reset();

                            refetch(resource);
                        }, function(data) {
                            notification.error('Jedn. miary nie została zaktualizowana, sprawdź wprowadzone dane.');
                        });

                        break;
                    case 'warehousesIn':
                        $(button).prop('disabled', true);

                        let warehousesIn_items = [];

                        $('table > tbody', form).find('tr').each(function() {
                            let id = $(this).data('id');

                            warehousesIn_items.push({
                                id: id,
                                tax_id: $('select[name="tax_id"] option:selected', $(this)).val(),
                                price_notax: parseFloat($('[name="price_notax"]', $(this)).val())
                            });
                        });

                        if(errors > 0) {
                            return;
                        }

                        put(`${resource}/${editable_id}`, {
                            contractor_id: $('[name="contractor_id"] option:selected', modal).val(),
                            document_name: $('[name="document_name"]', modal).val(),
                            invoice_date: $('[name="invoice_date"]', modal).val(),
                            notes: $('[name="notes"]', modal).val(),
                            items: warehousesIn_items
                        }, function(data) {
                            notification.success('Przyjęcie zewnętrzne zostało zaktualizowane!');

                            file(`warehousesIn/${data.id}/pdf`, function(blob) {
                                pdf(blob, `PZ_${data.id}.pdf`);
                            });

                            $('div[data-element="' + resource + '"]').modal('hide');

                            $(form)[0].reset();
                            $('tbody', form).find('tr').remove();

                            refetch(resource);

                            $(button).prop('disabled', false);
                        }, function(data) {
                            notification.error('Przyjęcie zewnętrzne nie zostało zaktualizowane, sprawdź wprowadzone dane.');

                            $(button).prop('disabled', false);
                        });

                        break;
                }

                break;
            case 'import':
                switch(resource) {
                    case 'warehouse-import':
                        post('stock/import', {
                            csv: $('[name="csv"]', form).val(),
                            warehouse_id: $('[name="warehouse_id"] option:selected', form).val()
                        }, function(data) {
                            notification.success('Dane zostały zaimportowane!');

                            $(modal).modal('hide');
                            $(form)[0].reset();

                            refetch(resource);
                        }, function(data) {
                            notification.error('Nie udało się zaimportować danych.');
                        });

                        break;
                    case 'item-import':
                        $(button).prop('disabled', true);

                        let itemImport_items = [];

                        $('table > tbody', form).find('tr').each(function() {
                            let items_manufacturer_id = $('[name="items_manufacturer_id"] option:selected', $(this)).val();
                            let model_name = $('[name="model_name"]', $(this)).val();
                            let items_category_id = $('[name="items_category_id"] option:selected', $(this)).val();
                            let unit_id = $('[name="unit_id"] option:selected', $(this)).val();
                            let low_quant = $('[name="low_quant"]', $(this)).val();
                            let has_data = $('[name="has_data"]', $(this)).val();

                            if(!(model_name.length > 0)) {
                                errors++;
                            }

                            itemImport_items.push({
                                items_manufacturer_id: items_manufacturer_id,
                                model_name: model_name,
                                items_category_id: items_category_id,
                                unit_id: unit_id,
                                low_quant: low_quant,
                                has_data: has_data
                            });
                        });

                        if(errors > 0) {
                            notification.error('Sprawdź wprowadzone dane.');
                            return;
                        }

                        post('item/import', {
                            items: itemImport_items
                        }, function(data) {
                            notification.success('Masowe dodawanie produktów zakończone powodzeniem!');

                            $(form).closest('.modal').modal('hide');
                            $(form).find('table > tbody').empty();

                            $('tbody', form).find('tr').remove();

                            refetch('item');

                            $(button).prop('disabled', false);
                        }, function(data) {
                            notification.error('Sprawdź wprowadzone dane.');

                            $(button).prop('disabled', false);
                        });

                        break;
                    case 'warehousesPlace-import':
                        $(button).prop('disabled', true);

                        let placeImport_items = [];

                        $('table > tbody', form).find('tr').each(function() {
                            let name = $('[name="name"]', $(this)).val();
                            let item_id = $('[name="item_id"]', $(this)).val();

                            if(!(name.length > 0)) {
                                errors++;
                            }

                            placeImport_items.push({
                                name: name,
                                item_id: item_id,
                            });
                        });

                        if(errors > 0) {
                            notification.error('Sprawdź wprowadzone dane.');

                            return;
                        }

                        let warehouse_id = $('[name="warehouse_id"] option:selected', modal).val();

                        post('warehousesPlace/import', {
                            warehouse_id: warehouse_id,
                            items: placeImport_items
                        }, function(data) {
                            notification.success('Masowe dodawanie miejsc magazynowania zakończone powodzeniem!');

                            $(form).closest('.modal').modal('hide');
                            $(form).find('table > tbody').empty();

                            $('tbody', form).find('tr').remove();

                            refetch('warehousesPlace');

                            $(button).prop('disabled', false);
                        }, function(data) {
                            notification.error('Sprawdź wprowadzone dane.');

                            $(button).prop('disabled', false);
                        });

                        break;
                }

                break;
        }
    });

    // on change form reset
    $('[data-element="carsIn"]').on('change', '[name="client_id"], [name="investment_id"], [name="type"]', function() {
        let form = $(this).closest('form');
        let resource = $(form).attr('data-resource');

        $(form).find('.form-row').not(':first').remove();
        $(form).find('input, textarea').not('[name="client_id"], [name="investment_id"], [name="item_data"]').each(function() {
            $(this).val('');
        });

        search(resource);
    });

    $('[data-element="warehousesMove"]').on('change', '[name="warehouse_in_id"]', function() {
        let form = $(this).closest('form');
        let resource = $(form).attr('data-resource');

        $('tbody', form).find('tr').remove();

        search(resource);
    });

    $('[data-element="carsIn"]').on('change', '[name="new"]', function() {
        let row = $(this).closest('.form-row');

        $(row).find('.prompt').val('');
        $(row).find('[name="item_id"]').val('');
        $(row).find('[name="item_data"]').val('[]');
        $(row).find('[name="has_data"]').val('');
        $(row).find('[name="unit"]').val('');
        $(row).find('[name="quantity"]').val('1');
        $(row).find('[name="data-add"]').prop('disabled', true);
    });

    $('[data-element="carsOut"], [data-element="carsIn"]').on('change', '[name="type"]', function() {
        let form = $(this).closest('form');
        let val = $('option:selected', this).val();
        let resource = $(this).attr('data-element');

        switch(parseInt(val)) {
            case 0:
                $('[name="client_id"]', form).closest('.form-group').show();
                $('[name="investment_id"]', form).closest('.form-group').hide();

                break;
            case 1:
                $('[name="client_id"]', form).closest('.form-group').hide();
                $('[name="investment_id"]', form).closest('.form-group').show();

                break;
        }

        if(resource === 'carsIn') {
            $('[name="client_id"]').val('').trigger('change');
            $('[name="investment_id"]').val('').trigger('change');
        }
    });

    $('[data-element="warehousesOutCar"]').on('change', '[name="warehouse_id"]', function() {
        let form = $(this).closest('form');

        $('tbody', form).find('tr').remove();
    });

    $('[data-element="warehousesInCar"]').on('change', '[name="user_get_id"]', function() {
        let form = $(this).closest('form');

        $(form).find('.form-row').not(':first').remove();
        $(form).find('input, textarea').not('[name="item_data"]').each(function() {
            $(this).val('');
        });
    });

    // sn and mac add window
    $('form[data-element]').on('click', '[name="data-add"]', function() {
        let resource = $(this).closest('[data-element]').attr('data-element');

        switch(resource) {
            case 'warehousesIn':
                window.dataAddElement = $(this).closest('tr');

                break;
            case 'warehousesOutCar':
                window.dataAddElement = $(this).closest('tr');

                break;
            case 'warehousesMove':
                window.dataAddElement = $(this).closest('tr');

                break;
            default:
                window.dataAddElement = $(this).closest('.form-row');
        }

        let item_data = JSON.parse($(window.dataAddElement).find('input[name="item_data"]').val());

        $('div[data-element="data-add"]').find('.row:not(:first)').remove();

        $('div[data-element="data-add"]').find('[name="sn"]', '.row:first').val('');
        $('div[data-element="data-add"]').find('[name="mac"]', '.row:first').val('');

        if(Object.keys(item_data).length > 0) {
            $.each(item_data, function(k,v) {
                row = `<div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <input class="form-control" name="sn" placeholder="" type="text" minlength="3" value="${v.sn}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <input class="form-control" name="mac" placeholder="" type="text" minlength="3" value="${v.mac}">
                        </div>
                    </div>
                </div>`;

                $('div[data-element="data-add"]').find('.row:first').after(row);
            });
        }

        $('div[data-element="data-add"]').modal();
        $('div[data-element="data-add"]').find('input[name="sn"]').first().focus();
    });

    // sn and mac add window inputs actions
    $('div[data-element="data-add"]').on('keypress', '[name="sn"]', function(e) {
        if(e.which === 13) {
            if($(this).closest('.row').next().length) {
                $(this).closest('.row').next().find('[name="sn"]').focus();
            } else {
                row = `<div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <input class="form-control" name="sn" placeholder="" type="text" minlength="3">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <input class="form-control" name="mac" placeholder="" type="text" minlength="3">
                        </div>
                    </div>
                </div>`;

                $(this).closest('.row').after(row);
            }

            $(this).closest('.row').next().find('[name="sn"]').focus();
        }
    });

    $('div[data-element="data-add"]').on('keypress', '[name="mac"]', function(e) {
        if(e.which === 13) {
            if($(this).closest('.row').next().length) {
                $(this).closest('.row').next().find('[name="mac"]').focus();
            } else {
                row = `<div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <input class="form-control" name="sn" placeholder="" type="text" minlength="3">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <input class="form-control" name="mac" placeholder="" type="text" minlength="3">
                        </div>
                    </div>
                </div>`;

                $(this).closest('.row').after(row);
            }

            $(this).closest('.row').next().find('[name="mac"]').focus();
        }
    });

    $('div[data-element="data-add"]').on('blur', '[name="sn"], [name="mac"]', function() {
        let sn = $(this).closest('.row').find('[name="sn"]');
        let mac = $(this).closest('.row').find('[name="mac"]');
        let resource = $(window.dataAddElement).closest('div[data-element]').attr('data-element');
        let warehouse, item;

        if($(sn).val().length < 1 && $(mac).val().length < 1) {
            return;
        }

        switch(resource) {
            case 'warehousesMove':
                warehouse = $(window.dataAddElement).closest('form').find('[name="warehouse_in_id"] option:selected').val();
                item = $(window.dataAddElement).find('[name="item_id"]').val();

                post(`warehouse/stock/verify`, {
                    warehouse_id: warehouse,
                    item_id: item,
                    sn: $(sn).val(),
                    mac: $(mac).val()
                }, function(data) {
                    $(sn).parent().removeClass('has-danger has-success');
                    $(mac).parent().removeClass('has-danger has-success');

                    if(Object.keys(data).length < 1) {
                        $(sn).parent().addClass('has-danger');
                        $(mac).parent().addClass('has-danger');

                        return;
                    }

                    $(sn).parent().addClass('has-success');
                    $(mac).parent().addClass('has-success');
                });

                break;
            case 'warehousesOutCar':
                warehouse = $(window.dataAddElement).closest('form').find('[name="warehouse_id"] option:selected').val();
                item = $(window.dataAddElement).find('[name="item_id"]').val();

                post(`warehouse/stock/verify`, {
                    warehouse_id: warehouse,
                    item_id: item,
                    sn: $(sn).val(),
                    mac: $(mac).val()
                }, function(data) {
                    $(sn).parent().removeClass('has-danger has-success');
                    $(mac).parent().removeClass('has-danger has-success');

                    if(Object.keys(data).length < 1) {
                        $(sn).parent().addClass('has-danger');
                        $(mac).parent().addClass('has-danger');

                        return;
                    }

                    $(sn).parent().addClass('has-success');
                    $(mac).parent().addClass('has-success');
                });

                break;
            case 'warehousesInCar':
                user = $(window.dataAddElement).closest('form').find('[name="user_get_id"] option:selected').val();
                item = $(window.dataAddElement).find('[name="item_id"]').val();

                post(`car/stock/verify`, {
                    user_id: user,
                    item_id: item,
                    sn: $(sn).val(),
                    mac: $(mac).val()
                }, function(data) {
                    $(sn).parent().removeClass('has-danger has-success');
                    $(mac).parent().removeClass('has-danger has-success');

                    if(Object.keys(data).length < 1) {
                        $(sn).parent().addClass('has-danger');
                        $(mac).parent().addClass('has-danger');

                        return;
                    }

                    $(sn).parent().addClass('has-success');
                    $(mac).parent().addClass('has-success');
                });

                break;
        }
    });

    $('div[data-element="data-add"]').on('click', '[data-action="save_data"]', function(e) {
        e.preventDefault();

        let elements = [];
        let sn, mac;

        $(this).closest('.modal-content').find('form').find('.row').each(function() {
            sn = $(this).find('[name="sn"]').val();
            mac = $(this).find('[name="mac"]').val();

            if(sn.length > 0 || mac.length > 0) {
                elements.push({
                    sn: $.trim(sn),
                    mac: $.trim(mac)
                });
            }
        });

        $(window.dataAddElement).find('[name="quantity"]').val(Object.keys(elements).length);
        $(window.dataAddElement).find('[name="quantity"]').trigger('change');

        $(window.dataAddElement).find('[name="item_data"]').val(JSON.stringify(elements));

        $('div[data-element="data-add"]').modal('hide');
    });

    $('[data-action="checkPin"]').on('click', function() {
        let id = $(this).closest('.card-body').find('[data-action="checkPin"]').data('client-id');
        let pin = $(this).closest('.card-body').find('[name="pin"]').val();

        get(`client/${id}/pin/${pin}`, function(data) {
            if(data.data === true) {
                let nodes = $('table[data-data="nodes"] > tbody');

                if(typeof data.nodes === 'object' && data.nodes !== null) {
                    if(Object.keys(data.nodes).length > 0) {
                        $(nodes).empty();

                        $.each(data.nodes, function(k,v) {
                            let address = data.addr.find(x => x.id === v.address_id);
                            let addressStr;

                            if(address) {
                                addressStr = (address.street ? address.street : address.city) + (address.house ? ` ${address.house}` : '') + (address.flat ? ` m. ${address.flat}` : '') + ', ' + address.city;
                            } else {
                                addressStr = 'brak';
                            }

                            $(nodes).append(`<tr><td>${v.name}</td><td>${addressStr}</td><td>${v.ipaddr}</td><td>${v.passwd}</td></tr>`);
                        });

                        $(nodes).closest('table').removeClass('hidden');
                        $(nodes).closest('div').find('[name="pin"]').closest('div').addClass('hidden');
                        $(nodes).closest('.card').removeClass('hidden');
                        $(nodes).closest('div').find('[data-action="checkPin"]').addClass('hidden');
                    }
                }
            } else {
                alert('PIN nieprawidłowy');
            }
        });
    });

    $(document).on('change', '[name="hidden"]', function(e) {
        refetch('item');
    });

    $(document).on('click', '.expand-table', function(e) {
        let id = $(this).closest('tr').attr('data-element-id');

        $(this).removeClass('expand-table');
        $(this).addClass('collapse-table');

        $(this).children('i').removeClass('fa-chevron-right');
        $(this).children('i').addClass('fa-chevron-down');

        $(this).closest('tr').nextAll(`[data-parent-id="${id}"]`).removeClass('hidden');
        /* $(this).closest('tr').nextAll(`[data-parent-id="${id}"]`).each(function() {
            $(this).children('td:eq(1)').css('padding-left', '+=30');
        }); */

        $(this).closest('tr').nextAll(`.gid-${id}`).each(function() {
            $(this).children('td:eq(1)').css('padding-left', '+=24');
        });
    });

    $(document).on('click', '.collapse-table', function(e) {
        let id = $(this).closest('tr').attr('data-element-id');

        $(this).removeClass('collapse-table');
        $(this).addClass('expand-table');

        $(this).children('i').removeClass('fa-chevron-down');
        $(this).children('i').addClass('fa-chevron-right');

        $(this).closest('tr').nextAll(`.gid-${id}`).addClass('hidden');
        $(this).closest('tr').nextAll(`.gid-${id}`).each(function() {
            $(this).children('td:eq(1)').css('padding-left', '-=24');

            $(this).children('td:eq(1)').removeClass('collapse-table');
            $(this).children('td:eq(1)').addClass('expand-table');

            $(this).children('td:eq(1)').children('i').removeClass('fa-chevron-down');
            $(this).children('td:eq(1)').children('i').addClass('fa-chevron-right');
        });
    });
});
