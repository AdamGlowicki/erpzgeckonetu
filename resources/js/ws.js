class requestClass {
    constructor() {
        this.id = null;
    }

    show(id) {
        this.id = id;

        let url = `request/${this.id}`;

        get(url, function(data) {
            let object = $(`<div class="modal" tabindex="-1" role="dialog" data-object="modal">
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
                                <strong>Magazyn</strong>
                                <p class="warehouse ml-2"></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-sm-12 text-center mt-5 mb-5 doc-name">
                                <strong>Dokument nr <span class="name"></span></strong>
                            </div>
                        </div>
                        <table class="table table-stripped" data-resource="request-clickable">
                            <thead>
                                <th>ID</th>
                                <th>Indeks</th>
                                <th>Producent</th>
                                <th>Model</th>
                                <th>Ilość potrzebna</th>
                                <th>Stan mag. głównych</th>
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
                                <strong>Data zapotrzebowania</strong>
                                <p class="date-request ml-2"></p>
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                                <strong>Data wystawienia</strong>
                                <p class="date ml-2"></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-9 col-md-9 col-sm-9 mt-4 mb-4">
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-3 mt-4 mb-4">
                                <strong>Zgłaszający</strong>
                                <p class="user ml-2"></p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer hidden-sm">
                        <div class="pull-left">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
                        </div>
                        <div class="pull-right">
                            <button type="button" class="btn btn-primary hidden" data-type="approve" data-action="request">Oznacz jako zrealizowane</button>
                        </div>
                    </div>
                  </div>
                </div>
            </div>`);

            $('table > tbody', object).empty();

            $('.modal-title', object).html(`Zapotrzebowanie (<strong>${data.id}</strong>) dla <strong>${data.user.name}</strong>`);

            $('.warehouse', object).html(`${data.warehouse.name}<br>${data.warehouse.street}<br>${data.warehouse.postcode} ${data.warehouse.city}`);
            $('.user', object).html(`${data.user.name}`);
            $('.name', object).html(`${data.document_name}`);
            $('.notes', object).html(`${data.notes ? data.notes : '-'}`);
            $('.date', object).html(`${data.created_at}`);
            $('.date-request', object).html(`${data.date}`);

            $('table > tbody', object).empty();

            $.each(data.requests_item, function (key, value) {
                let tbody = `<tr>
                    <td>${value.id}</td>
                    <td>${value.item_id}</td>
                    <td>${value.item.items_manufacturer.name}</td>
                    <td>${value.item.model_name}</td>
                    <td>${value.quantity}</td>
                    <td>${value.item.warehouses_stock !== null && typeof value.item.warehouses_stock !== "undefined" ? value.item.warehouses_stock[0].quantity : '0'}</td>
                    <td>${value.item.unit.short_name}</td>
                </tr>`;

                $('table > tbody', object).append(tbody);
            });

            if($.inArray(roleCache, [1, 2, 3]) !== -1 || data.approved === 0) {
               $('[data-action="request"]', object).removeClass('hidden');
            }

            if(data.approved === 1) {
                $('[data-action="request"]', object).addClass('hidden');
            }

            $(object).modal();
        });
    }

    approve(id = this.id, object) {
        let url = `request/${id}`;
        let parent = this;

        put(url, {
            approved: 1
        }, function(data) {
            notification.success('Zapotrzebowanie zostało oznaczone jako zrealizowane!');

            $(object).closest('.modal').modal('hide');

            parent.refresh();
        }, function(data) {
            notification.error('Zapotrzebowanie nie zostało zatwierdzone, wystąpił nieznany błąd.');

            $(object).closest('.modal').modal('hide');
        });
    }

    refresh() {
        refetch('request');
    }
}

class carsMoveClass {
    constructor() {
        this.id = null;
    }

    show(id) {
        this.id = id;

        let url = `carsMove/${this.id}`;

        get(url, function(data) {
            let object = $(`<div class="modal" tabindex="-1" role="dialog" data-object="modal">
                <div class="modal-dialog modal-mlg animated fadeInDown" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Przekazanie sprzętu</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                        <div class="card">
                            <div class="card-body">
                                <table class="table table-stripped">
                                    <thead>
                                        <th>Indeks</th>
                                        <th>Producent</th>
                                        <th>Model</th>
                                        <th>Ilość</th>
                                        <th>J.m.</th>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                        <button type="button" class="btn btn-primary" data-type="approve" data-action="carsMove">Akceptuj</button>
                    </div>
                  </div>
                </div>
            </div>`);

            $('table > tbody', object).empty();

            $.each(data.cars_moves_item, function(key, value) {
                let row = `<tr>
                    <td>${value.item.id}</td>
                    <td>${value.item.items_manufacturer.name}</td>
                    <td>${value.item.model_name}</td>
                    <td>${value.quantity}</td>
                    <td>${value.item.unit.short_name}</td>
                </tr>`;

                $('table > tbody', object).append(row);

                let ths = $('table > thead', object).find('th');
                let thsCount = Object.keys(ths).length;

                if(value.item.has_data) {
                    let i = 0;
                    let el = `<tr><td></td><td></td><td colspan="${thsCount-1}">`;

                    $.each(value.element, function(k, v) {
                        i++;
                        el = el + '<strong>' + i + `</strong>. S/N: ${v.sn} MAC: ${v.mac}<br>`;
                    });

                    el = el + `</td></tr>`;

                    $('table > tbody', object).append(el);
                }
            });

            if(data.approved === 1 || data.user_out_id !== userObj.id) {
                $('[data-type="approve"]', object).addClass('hidden');
            }

            $(object).modal();
        });
    }

    approve(id = this.id, object) {
        let url = `carsMove/${id}/approve`;
        let parent = this;

        put(url, {}, function(data) {
            notification.success('Przekazanie sprzętu zostało zaakceptowane!');

            $(object).closest('.modal').modal('hide');

            parent.refresh();
        }, function(data) {
            notification.error('Przekazanie sprzętu nie zostało zaakceptowane, stany sprzętowe zmieniły się po przesłaniu zapytania!');

            $(object).closest('.modal').modal('hide');
        });
    }

    refresh() {
        refetch('carsMove');
    }
}

let carsMoveObj = new carsMoveClass();
let requestObj = new requestClass();

class Notify {
    constructor() {
        this.object = $('.notifications');
        this.button = $('.notifications-button');
        this.notifications = [];
    }

    check() {
        let count = $(this.object).find('li > span').length;

        if(count > 0) {
            return true;
        }

        return false;
    }

    send(body, id, date, notify) {
        if(this.check()) {
            $(this.object).find('li > span').remove();
            $(this.button).addClass('notification');
        }

        $(this.object).find('li:first').before(`<li class="nav-link" data-id="${id}"><a href="javascript:void(0)" class="nav-item dropdown-item">
            <div class="col">${date}</div>
            <div class="col">${body}</div>
        </li>`);

        if(notify) {
            notification.info(`<div class="ml-2">${body}</span>`);
        }
    }

    parse(n, notify = true) {
        this.notifications.push(n);

        switch(n.type) {
            case 'App\\Notifications\\NewCarsMoveNotification':
                this.send(`<i class="fa fa-people-carry"></i>
                    <span class="ml-1">Nowe przekazanie sprzętu (${n.data.id}) od: <strong>${n.data.from}</strong></span>`, n.id, n.created_at ? n.created_at : moment().format('YYYY-MM-DD HH:mm:ss'), notify);

                carsMoveObj.refresh();

                break;
            case 'App\\Notifications\\ApprovedCarsMoveNotification':
                this.send(`<i class="fa fa-people-carry"></i>
                    <span class="ml-1">Przekzanie sprzętu (${n.data.id}) zatwierdzono przez <strong>${n.data.from}</strong></span>`, n.id, n.created_at ? n.created_at : moment().format('YYYY-MM-DD HH:mm:ss'), notify);

                carsMoveObj.refresh();

                break;
            case 'App\\Notifications\\NewRequestNotification':
                this.send(`<i class="fa fa-file-import"></i>
                    <span class="ml-1">Nowe zapotrzebowanie (${n.data.id}) dodane przez <strong>${n.data.from}</strong></span>`, n.id, n.created_at ? n.created_at : moment().format('YYYY-MM-DD HH:mm:ss'), notify);

                requestObj.refresh();

                break;
            case 'App\\Notifications\\ApprovedRequestNotification':
                this.send(`<i class="fa fa-file-import"></i>
                    <span class="ml-1">Twoje zapotrzebowanie (${n.data.id}) zostało oznaczone jako zrealizowane</span>`, n.id, n.created_at ? n.created_at : moment().format('YYYY-MM-DD HH:mm:ss'), notify);

                requestObj.refresh();

                break;
            case 'App\\Notifications\\RefreshEventsNotification':
                if(typeof calendar !== 'undefined' && $('[name="submit"]', '.popover').length === 0) {
                    calendar.refetchEvents();
                }

                break;
            case 'App\\Notifications\\RefreshLocationNotification':
                if(typeof fetchLocation !== 'undefined') {
                    fetchLocation();
                }

                break;

        }
    }

    action(id) {
        let n = this.notifications.find(x => x.id === id);

        switch(n.type) {
            case 'App\\Notifications\\NewCarsMoveNotification':
                carsMoveObj.show(n.data.id);

                break;
            case 'App\\Notifications\\ApprovedCarsMoveNotification':
                carsMoveObj.show(n.data.id);

                break;
            case 'App\\Notifications\\NewRequestNotification':
                requestObj.show(n.data.id);

                break;
            case 'App\\Notifications\\ApprovedRequestNotification':
                requestObj.show(n.data.id);

                break;
        }
    }
}

$(document).ready(() => {
    let wsKey;

    if(window.location.hostname === 'erp.geckonet.pl') {
        wsKey = '0d8770ba14fdc4348ba1';
    } else {
        wsKey = 'efd7125f3ba1dcd0062d';
    }

    window.notify = new Notify();
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: wsKey,
        cluster: 'eu',
        wsHost: window.location.hostname,
        wsPort: 6001,
        wssPort: 443,
        auth: {
            headers: {
                Authorization: 'Bearer ' + Cookies.get('apiToken')
            }
        },
        disableStats: true,
        enabledTransports: ['ws', 'wss']
    });

    $('.notifications').on('click', 'li', function() {
        let id = $(this).data('id');

        notify.action(id);
    });

    $(document).on('click', '[data-action]', function() {
        let strClass = $(this).data('action');

        switch($(this).data('type')) {
            case 'approve':
                switch($(this).data('action')) {
                    case 'carsMove':
                        carsMoveObj.approve(editable_id, $(this));

                        break;
                    case 'request':
                        requestObj.approve(editable_id, $(this));

                        break;
                }

                break;
        }
    });

    $(document).on('hidden.bs.modal', function(e) {
        let modal = $(e.target);

        if($(modal).data('object')) {
            $(modal).remove();
        }
    });
});
