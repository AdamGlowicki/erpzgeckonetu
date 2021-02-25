let calendar;
let calendarEl;

class EventClass {
    constructor() {
        this.data = {};
        this.data.resource = 'event';
        this.data.id = null;
        this.data.info = null;

        this.priority = {
            PRIORITY_LOW: 0,
            PRIORITY_NORMAL: 1,
            PRIORITY_HIGH: 2,
        };

        this.type = {
            TYPE_INSTALLATION: 0,
            TYPE_FAULT: 1,
            TYPE_DISASSEMBLY: 2,
            TYPE_UPGRADE: 3,
            TYPE_INVESTMENT: 4,
            TYPE_CHECK: 5,
            TYPE_OTHER: 9,
        };

        this.status = {
            STATUS_NEW: 0,
            STATUS_IN_PROGRESS: 1,
            STATUS_FINISHED: 2,
        };
    }

    parseType(v) {
        switch(v) {
            case this.type.TYPE_INSTALLATION:
                return 'Instalacja';
            case this.type.TYPE_FAULT:
                return 'Usterka';
            case this.type.TYPE_DISASSEMBLY:
                return 'Demontaż';
            case this.type.TYPE_UPGRADE:
                return 'Modernizacja';
            case this.type.TYPE_INVESTMENT:
                return 'Inwestycja';
            case this.type.TYPE_CHECK:
                return 'Wizja';
            case this.type.TYPE_OTHER:
                return 'Inny';
        }
    }

    get resource() {
        return this.data.resource;
    }

    get id() {
        return this.data.id;
    }

    copy(eventId, userId) {
        let event = calendar.getEventById(eventId);

        if(!event || !userId) {
            return;
        }

        get(`event/${eventId}`, function(response) {
            console.log(response.data);

            let data = {
                user_id:  userId,
                client_id: response.data.client ? response.data.client.client_id : null,
                investment_id: response.data.investment_id,
                start: event.start,
                end: event.end,
                title: response.data.title,
                description: response.data.description,
                phone: response.data.phone,
                address: response.data.address,
                priority: response.data.priority,
                type: response.data.type,
                all_day: event.allDay,
                source_id: eventId,
            };

            post(`event`, data, function(r) {
                closeAllPopovers();

                calendar.refetchEvents();

                newEventData = null;

                notification.success('Zadanie zostało skopiowane');
            }, function(response) {
                switch(response.status) {
                    case 422:
                        notification.error('Nie udało się skopiować zadania, dane są niepoprawne');

                        break;
                    default:
                        notification.error('Brak uprawnień do kopiowania zadań');
                }
            });
        });
    }

    store() {
        let form = $('.popover-body').find('form');
        let title = $('.popover-header').find('[name="title"]');

        let event = calendar.getEventById('newEvent');

        let data = {
            user_id:  $('[name="user_id"]', form).find('option:selected').val(),
            client_id: $('[name="client_id"]', form).val(),
            investment_id: $('[name="investment_id"]', form).val(),
            start: event.start,
            end: event.end,
            title: $(title).val(),
            description: $('[name="description"]', form).val(),
            phone: $('[name="phone"]', form).val(),
            address: $('[name="address"]', form).val(),
            priority: $('[name="priority"]', form).find('option:selected').val(),
            type: $('[name="type"]', form).find('option:selected').val(),
            all_day: event.allDay,
        };

        post(`event`, data, function(response) {
            closeAllPopovers();

            event.remove();

            calendar.refetchEvents();

            newEventData = null;

            notification.success('Zadanie zostało dodane do kalendarza');
        }, function(response) {
            switch(response.status) {
                case 422:
                    notification.error('Nie udało się dodać zadania, uzupełnij wymagane pola i sprawdź wprowadzone dane');

                    break;
                default:
                    notification.error('Brak uprawnień do tworzenia zadań');
            }
        });
    }

    update(id) {
        let form = $('.popover-body').find('form');
        let title = $('.popover-header').find('[name="title"]');

        let event = calendar.getEventById(id);

        if(!event) {
            return;
        }

        let data = {
            user_id:  $('[name="user_id"]', form).find('option:selected').val(),
            client_id: $('[name="client_id"]', form).val(),
            investment_id: $('[name="investment_id"]', form).val(),
            start: $('[name="start"]', form).val(),
            end: $('[name="end"]', form).val(),
            title: $(title).val(),
            description: $('[name="description"]', form).val(),
            phone: $('[name="phone"]', form).val(),
            address: $('[name="address"]', form).val(),
            priority: $('[name="priority"]', form).find('option:selected').val(),
            type: $('[name="type"]', form).find('option:selected').val(),
            all_day: event.allDay,
        };

        put(`event/${id}`, data, function(response) {
            closeAllPopovers();

            event.remove();

            calendar.refetchEvents();

            notification.success('Zadanie zostało zaktualizowane');
        }, function(response) {
            switch(response.status) {
                case 422:
                    notification.error('Nie udało się zaktualizować zadania, uzupełnij wymagane pola i sprawdź wprowadzone dane');

                    break;
                default:
                    notification.error('Brak uprawnień do edycji zadań');
            }
        });
    }

    show(info) {
        this.data.info = info;

        if($(info.el).data('bs.popover') !== undefined) {
            $(info.el).popover('dispose');

            $(info.el).css('z-index', $(info.el).data('zIndex'));
            $(info.el).css({
                'box-shadow': '',
                '-webkit-box-shadow': '',
                '-moz-box-shadow': '',
            });

            return;
        }

        closeAllPopovers();

        $(info.el).popover({
            content: `<div class="container-fluid">
                    <div class="row">
                        <div class="col">
                            <h4 class="mb-1 animated fadeIn">${info.event.extendedProps.user !== null ? userAvatar(info.event.extendedProps.user) + info.event.extendedProps.user.name : '<strong>n/a</strong>'}</h4>
                            <h4 class="mb-1 animated fadeIn"><i class="fa fa-fw fa-calendar-alt mr-2"></i>${moment.utc(info.event.start).format('HH:mm DD-MM-YYYY')} (${moment.duration(moment(info.event.end).diff(info.event.start)).format('d [day] h [h] m [m]')})</h4>
                            <h4 class="mb-1 animated fadeIn"><i class="fa fa-fw fa-home mr-2"></i>${info.event.extendedProps.address !== null ? info.event.extendedProps.address : 'brak danych'}</h4>
                            <h5 class="mb-1 animated fadeIn slow"><i class="fa fa-fw fa-fire mr-2"></i>${priority(info.event.extendedProps.priority)}</h5>
                            <h5 class="mb-1 animated fadeIn slow"><i class="fa fa-fw fa-phone mr-2"></i>${info.event.extendedProps.phone !== null ? info.event.extendedProps.phone : 'brak danych'}</h5>
                            <h5 class="mb-1 animated fadeIn slow"><i class="fa fa-fw fa-user mr-2"></i>${info.event.extendedProps.client !== null ? `<span class="clickable font-weight-bold" data-resource="client" data-id="${info.event.extendedProps.client.id}">${info.event.extendedProps.client.name} (${info.event.extendedProps.client.client_id})</span>` : 'brak danych'}</h5>
                            <h5 class="mb-1 animated fadeIn slow"><i class="fa fa-fw fa-project-diagram mr-2"></i>${info.event.extendedProps.investment !== null ? `<span class="clickable font-weight-bold" data-resource="investment" data-id="${info.event.extendedProps.investment.id}">${info.event.extendedProps.investment.name} (${info.event.extendedProps.investment.investment_name})</span>` : 'brak danych'}</h5>
                            <h5 class="mb-1 animated fadeIn slow"><i class="fa fa-fw fa-align-justify mr-2"></i>${info.event.extendedProps.description !== null && info.event.extendedProps.description !== "" ? info.event.extendedProps.description.replace(/\r\n?|\n/g, '<br>') : 'brak danych'}</h5>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col animated fadeIn slow">
                            <button class="fc-button fc-button-primary" data-action="edit" data-id="${info.event.id}"><i class="fa fa-pencil-alt"></i></button>
                            <button class="ml-1 fc-button fc-button-primary" data-action="copy" data-id="${info.event.id}"><i class="fa fa-copy"></i></button>
                            <button class="ml-1 fc-button fc-button-primary" data-action="remove" data-id="${info.event.id}"><i class="fa fa-trash-alt"></i></button>
                        </div>
                        <div class="col animated fadeIn slow">
                            <span class="pull-right">
                                <button class="fc-button fc-button-primary" data-action="details" data-id="${info.event.id}">Szczegóły</button>
                            </span>
                        </div>
                    </div>
                </div>`,
            container: 'body',
            placement: 'auto',
            boundary: 'viewport',
            html: true,
            title: `<h4 class="mb-0 animated fadeIn mr-1 ml-1 d-inline">
                <span class="fc-event-dot mb-0 mr-1" style="background-color: ${info.event.backgroundColor};"></span> ${info.event.title}
            </h4>`,
        });

        $(info.el).popover('toggle');

        if(info.event.extendedProps.type !== null) {
            $('.popover-header').find('h4').append(`
                <span class="pull-right ml-3">
                    <h4 class="animated fadeIn mt-1"><i class="fa fa-cog mr-2"></i>${info.event.extendedProps.type !== null ? eventObject.parseType(info.event.extendedProps.type) : 'b/d'}</h4>
                </span>`);
        }

        if(info.event.extendedProps.priority === eventObject.priority.PRIORITY_HIGH) {
            $('.popover-header').css('background-color', '#fd5d5d');
            $('h4', '.popover-header').css('color', '#ffffff');
        }

        switch(info.event.extendedProps.status) {
            case eventObject.status.STATUS_NEW:
                $('.popover-header').append(`<div class="alert alert-info d-inline-block p-1 m-1">Nowe</div>`);

                break;
            case eventObject.status.STATUS_IN_PROGRESS:
                $('.popover-header').append(`<div class="alert alert-warning d-inline-block p-1 m-1">W trakcie</div>`);

                break;
            case eventObject.status.STATUS_FINISHED:
                $('.popover-header').append(`<div class="alert alert-success d-inline-block p-1 m-1">Zakończone</div>`);

                break;
        }

        setZindex(info.el);
    }

    details(id) {
        get(`${this.resource}/${id}`, function(response) {
            let event = response.data;

            let color = moment(event.end).isBefore(moment()) ? 'hsl(0, 0%, 80%)' : 'hsl(0,0%,0%)';

            if(event.user !== null) {
                if(event.user.settings !== null) {
                    color = moment(event.end).isBefore(moment()) ? event.user.settings.event_color2 : event.user.settings.event_color;
                } else {
                    color = moment(event.end).isBefore(moment()) ? stringToHslColor(event.user.id + event.user.name, 25, 75) : stringToHslColor(event.user.id + event.user.name);
                }
            }

            let dModal = $(`<div class="modal animated fadeIn" tabindex="-1" role="dialog" data-element="event-details" aria-hidden="true">
            <div class="modal-dialog modal-mlg" role="document">
              <div class="modal-content">
                <div class="modal-header">
                    <div class="pull-left d-inline">
                        <h4 class="mb-0 animated fadeIn mr-1 ml-1 d-inline">
                            <span class="fc-event-dot mb-0 mr-1 d-inline-block" style="background-color: ${color};"></span> ${event.title}
                        </h4>
                    </div>
                    <div class="pull-right">
                        ${event.user !== null ? userAvatar(event.user) + event.user.name : '<strong>n/a</strong>'}
                    </div>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col">
                            <div class="card">
                                <div class="card-header">
                                    <strong>Informacje</strong>
                                </div>
                                <div class="card-body">
                                    <h4 class="mb-1 animated fadeIn"><i class="fa fa-fw fa-calendar-alt mr-2"></i>${moment.utc(event.start).format('HH:mm DD-MM-YYYY')} (${moment.duration(moment(event.end).diff(event.start)).format('d [day] h [h] m [m]')})</h4>
                                    <h4 class="mb-1 animated fadeIn"><i class="fa fa-fw fa-home mr-2"></i>${event.address !== null ? event.address : 'brak danych'}</h4>
                                    <h4 class="mb-1 animated fadeIn"><i class="fa fa-fw fa-user-plus mr-2"></i>${userAvatar(event.user_created)} ${event.user_created.name}</h4>
                                    <h5 class="mb-1 animated fadeIn"><i class="fa fa-fw fa-plus mr-2"></i>${moment(event.created_at).format('HH:mm DD-MM-YYYY')}</h5>
                                    <h5 class="mb-1 animated fadeIn slow"><i class= "fa fa-fw fa-fire mr-2"></i>${priority(event.priority)}</h5>
                                    <h5 class="mb-1 animated fadeIn slow"><i class="fa fa-fw fa-phone mr-2"></i>${event.phone !== null ? event.phone : 'brak danych'}</h5>
                                    <h5 class="mb-1 animated fadeIn slow"><i class="fa fa-fw fa-user mr-2"></i>${event.client !== null ? `<span class="clickable font-weight-bold" data-resource="client" data-id="${event.client.id}">${event.client.name} (${event.client.client_id})</span>` : 'brak danych'}</h5>
                                    <h5 class="mb-1 animated fadeIn slow"><i class="fa fa-fw fa-project-diagram mr-2"></i>${event.investment !== null ? `<span class="clickable font-weight-bold" data-resource="investment" data-id="${event.investment.id}">${event.investment.name} (${event.investment.investment_name})</span>` : 'brak danych'}</h5>
                                    <h5 class="mb-1 animated fadeIn slow"><i class="fa fa-fw fa-align-justify mr-2"></i>${event.description !== null && event.description !== "" ? event.description.replace(/\r\n?|\n/g, '<br>') : 'brak danych'}</h5>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header">
                                    <strong>Historia</strong>
                                </div>
                                <div class="card-body" data-data="history">

                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card">
                                <div class="card-header">
                                    <strong>Raport</strong>
                                </div>
                                <div class="card-body" data-data="report">
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
        </div>`).appendTo('div.wrapper');

            if(Object.keys(event.events_note).length < 1) {
                $('[data-data="report"]', dModal).append('Brak raportów');
            } else {
                $.each(event.events_note, function(k,v) {
                    let type;

                    if(v.file_id) {
                        type = (v.file.path).split('.').pop() === 'mp4' ? 'video' : 'image';
                    }

                    $('[data-data="report"]', dModal).append(`<div class="row">
                    <div class="col">
                        ${v.created_at} ${userAvatar(v.user)} <strong>${v.user.name}</strong>
                        <div class="row mt-2">
                            <div class="row ml-4 mr-4">
                                ${v.file_id ? `<a href="file/${v.file_id}" class="photo-lightbox" data-gallery="report-${event.id}" data-type="${type}">${type === 'video' ? `<i class="fa fa-4x fa-play-circle"></i>` : `<img class="photo2 mr-1" src="file/${v.file_id}" alt="">`}</a>` : v.note}
                            </div>
                        </div>
                    </div>
                </div>`);
                });
            }

            if(Object.keys(event.history).length < 1) {
                $('[data-data="history"]', dModal).append('Brak informacji');
            } else {
                $.each(event.history, function(k,v) {
                    if(!v.causer) {
                        return true;
                    }

                    $('[data-data="history"]', dModal).append(`<div class="row">
                    <div class="col">
                        ${v.created_at} ${userAvatar(v.causer)} <strong>${v.causer.name}</strong>
                        <div class="row mb-2">
                            <div class="row ml-4 mr-4">
                                ${v.description}
                            </div>
                        </div>
                    </div>
                </div>`);
                });
            }

            let el = $('.modal-header > .pull-left', dModal);

            switch(event.status) {
                case eventObject.status.STATUS_NEW:
                    $(el).append(`<div class="alert alert-info d-inline-block p-1 m-1">Nowe</div>`);

                    break;
                case eventObject.status.STATUS_IN_PROGRESS:
                    $(el).append(`<div class="alert alert-warning d-inline-block p-1 m-1">W trakcie</div>`);

                    break;
                case eventObject.status.STATUS_FINISHED:
                    $(el).append(`<div class="alert alert-success d-inline-block p-1 m-1">Zakończone</div>`);

                    break;
            }

            $(dModal).modal();
        });
    }

    edit(id) {
        let parent = this;

        get(`event/${id}`, function(response) {
            let event = calendar.getEventById(id);

            if(!event) {
                return;
            }

            $('.popover-header').html(`<span class="fc-event-dot" style="background-color: ${event.backgroundColor};"></span> <span class="font-weight-bold ml-1">
                <input class="form-control-search" name="title" placeholder="Dodaj tytuł *" value="${event.title}">
            </span>`);

            if(response.data.priority === 2) {
                $('.form-control-search', '.popover-header').css('background-color', '#ffffff');
            }

            $('.popover-body').html(`<form role="form" data-resource="event" data-action="update" data-id="${response.data.id}">
                <div class="container-fluid">
                    <div class="row mb-1">
                        <div class="col font-weight-bold text-nowrap">Zaplanowano na </div>
                        <div class="col text-right">
                            <input type="datetime-local" name="start" value="${moment(response.data.start).format('YYYY-MM-DDTHH:mm')}">
                        </div>
                    </div>
                    <div class="row mb-1">
                        <div class="col font-weight-bold text-nowrap">Zaplanowano do </div>
                        <div class="col text-right">
                            <input type="datetime-local" name="end" value="${moment(response.data.end).format('YYYY-MM-DDTHH:mm')}">
                        </div>
                    </div>
                    <!-- <div class="row mb-1">
                        <div class="col font-weight-bold text-nowrap">Długość zadania </div>
                        <div class="col text-right">${moment.duration(moment(response.data.end).diff(response.data.start)).format('d [day] h [hr] m [min]')}</div>
                    </div> -->
                    <div class="row mb-1">
                        <div class="col font-weight-bold text-nowrap align-self-center">Przypisane do *</div>
                        <div class="col text-right">
                            <select class="selectpicker show-tick" name="user_id" data-live-search="true">
                            </select>
                        </div>
                    </div>
                    <div class="row mb-1">
                        <div class="col font-weight-bold text-nowrap align-self-center">Rodzaj zadania *</div>
                        <div class="col text-right"><select class="form-control-search" name="type">
                            <option value="" disabled selected>--- wybierz ---</option>
                            <option value="0">Instalacja</option>
                            <option value="5">Wizja</option>
                            <option value="1">Usterka</option>
                            <option value="2">Demontaż</option>
                            <option value="3">Modernizacja</option>
                            <option value="4">Inwestycja</option>
                            <option value="9">Inne</option>
                        </select></div>
                    </div>
                    <div class="row mb-1">
                        <div class="col font-weight-bold text-nowrap align-self-center">Priorytet *</div>
                        <div class="col text-right"><select class="form-control-search" name="priority">
                            <option value="0">Niski</option>
                            <option value="1">Normalny</option>
                            <option value="2">Wysoki</option>
                        </select></div>
                    </div>
                    <div class="row mb-1">
                        <div class="col font-weight-bold text-nowrap align-self-center">Status </div>
                        <div class="col text-right"><select class="form-control-search" name="status">
                            <option class="alert alert-info" value="0">Nowe</option>
                            <option class="alert alert-warning" value="1">W trakcie</option>
                            <option class="alert alert-success" value="2">Zakończone</option>
                        </select></div>
                    </div>
                    <div class="row mb-1">
                        <div class="col font-weight-bold text-nowrap align-self-center">Klient </div>
                        <div class="col text-right">
                            <div class="ui search resource-search" data-search="client">
                                <div class="ui icon input">
                                    <input class="form-control-search prompt" type="text" placeholder="Wyszukaj klienta" autocomplete="off" value="${response.data.client_id ? response.data.client.client_id : ''}">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-1">
                        <div class="col font-weight-bold text-nowrap align-self-center">Inwestycja </div>
                        <div class="col text-right">
                            <div class="ui search resource-search" data-search="investment">
                                <div class="ui icon input">
                                    <input class="form-control-search prompt" type="text" placeholder="Wyszukaj inwestycję" autocomplete="off" value="${response.data.investment_id ? response.data.investment_id : ''}">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-1">
                        <div class="col font-weight-bold text-nowrap align-self-center">Adres </div>
                        <div class="col text-right">
                            <input class="form-control-search" name="address" placeholder="Dodaj adres" value="${response.data.address ? response.data.address : ''}">
                        </div>
                    </div>
                    <div class="row mb-1">
                        <div class="col font-weight-bold text-nowrap align-self-center">Telefon </div>
                        <div class="col text-right">
                            <input class="form-control-search" name="phone" placeholder="Dodaj telefon" value="${response.data.phone ? response.data.phone : ''}">
                        </div>
                    </div>
                    <div class="row mb-1">
                        <div class="col font-weight-bold text-nowrap align-self-center">Opis prac </div>
                        <div class="col text-right"><textarea class="form-control-search" style="width: 250px;" rows="5" name="description">${response.data.description ? response.data.description : ''}</textarea></div>
                    </div>
                </div>
                <input type="hidden" name="client_id" value="${response.data.client_id ? response.data.client.client_id : ''}">
                <input type="hidden" name="investment_id" value="${response.data.investment_id ? response.data.investment_id : ''}">
                <span class="mb-2 pull-left">
                    <input type="button" name="cancel" class="btn btn-secondary btn-xs" value="Anuluj">
                </span>
                <span class="mb-2 pull-right">
                    <input type="submit" name="submit" class="btn btn-primary btn-xs" value="Zapisz" data-action="update">
                </span>
            </form>`);

            $('[name="priority"]', '.popover-body').find(`option[value="${response.data.priority}"]`).prop('selected', true);
            $('[name="type"]', '.popover-body').find(`option[value="${response.data.type}"]`).prop('selected', true);

            let parent_ = response;

            user(false, function(response) {
                let select = $('[name="user_id"]', '.popover-body');

                let roles = [];

                $.each(response, function(k,v) {
                    Object.keys(v.roles).length ? roles.push({
                        id: v.roles[0].id,
                        name: v.roles[0].name,
                    }) : null;
                });

                let uniqRoles = roles.reduce((x, y) => x.findIndex(z => z.name === y.name) < 0 ? [...x, y]: x, []);

                $.each(uniqRoles, function(k,v) {
                    $(select).append(`<optgroup label="${v.name}" data-id="${v.id}"></optgroup>`);
                });

                $.each(response, function(k,v) {
                    if(Object.keys(v.roles).length) {
                        $(select).find(`optgroup[data-id="${v.roles[0].id}"]`).append(`<option data-tokens="${v.roles[0].name}" value="${v.id}" ${parent_.data.user_id === v.id ? 'selected' : ''}>${v.name}</option>`);
                    }
                });

                $(select).selectpicker();
            });

            let statusEl = $('[name="status"]', '.popover-body');
            $(statusEl).find(`option[value="${response.data.status}"]`).prop('selected', true);

            search();

            $(parent.data.info.el).popover('update');
        }, function(response) {

        });
    }

    delete(id) {
        let event = calendar.getEventById(id);

        del(`event`, id, function(response) {
            event.remove();

            newEventData = null;
        }, function(response) {
            event.revert();
        });
    }
}

let newEventData = null;
let eventObject  = new EventClass();

let user = function user(page = false, callbackSuccess = false, callbackError = false) {
    let resource = 'user';
    let url = resource + (page !== false ? '?page=' + page : '/all');

    get('user/all', function(data) {
        if(callbackSuccess !== false) {
            callbackSuccess(data);
            return;
        }
    }, function(data) {
        notification.error('Nie udało się pobrać danych: ' + resource);
    });
};

let search = function() {
    let popover = $('.popover-body', document);

    $(popover).find('.resource-search').each(function() {
        let resource = $(this).data('search');
        let url;

        switch(resource) {
            case 'client':
                url = api + 'client/search/{query}';

                break;
            case 'investment':
                url = api + 'investment/search/{query}';

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
                        case 'client':
                            break;
                        case 'investment':
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

                    switch(resource) {
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
                                    addr        : item.addresses,
                                    phones      : item.phones,
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
                    }

                    return convertedResponse;
                }
            },
            cache: false,
            minCharacters: 1,
            maxResults: 8,
            onSelect: function(result) {
                switch(resource) {
                    case 'client':
                        $('input[name="client_id"]', popover).val(result.client_id);

                        let el = $(`<div class="modal" tabindex="-1" role="dialog" style="z-index: 2500;" data-set="address">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">
                                            <i class="fa fa-map"></i>
                                            <span class="ml-2">Wybierz adres z listy</span>
                                        </h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                    </div>
                                </div>
                            </div>
                        </div>`);

                        let m = $(el).appendTo('body');

                        $.each(result.addr, function(k,v) {
                            let street = v.street ? v.street : v.city;
                            let house = v.house || '';
                            let flat = v.flat ? '/' + v.flat : '';
                            let zip = v.zip || '';
                            let city = v.city ? v.city : v.postoffice;

                            $('.modal-body', m).append(`<div class="alert alert-dark clickable-only" data-selectable="address">${street} ${house}${flat}, ${zip} ${city}</div>`);
                        });

                        $(m).modal();

                        if(result.phones === null) {
                            break;
                        }

                        let elPhone = $(`<div class="modal" tabindex="-1" role="dialog" style="z-index: 2500;" data-set="phone">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">
                                            <i class="fa fa-phone"></i>
                                            <span class="ml-2">Wybierz numer telefonu kontaktowego z listy</span>
                                        </h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                    </div>
                                </div>
                            </div>
                        </div>`);

                        let mPhone = $(elPhone).appendTo('body');

                        $.each(result.phones, function(k,v) {
                            $('.modal-body', mPhone).append(`<div class="alert alert-dark clickable-only" data-selectable="phone">${v.contact}</div>`);
                        });

                        break;
                    case 'investment':
                        $('input[name="investment_id"]', popover).val(result.investment_id);

                        break;
                }
            }
        });
    });
};

let closeAllPopovers = function closeAllPopovers() {
    $('.popover').each(function(k,v) {
        $(this).popover('dispose');

        let id = $(this).attr('id');
        let event = $(calendarEl).find(`[aria-describedby="${id}"]`);

        $(event).css('z-index', $(event).data('zIndex'));
        $(event).css({
            'box-shadow': '',
            '-webkit-box-shadow': '',
            '-moz-box-shadow': '',
        });
    });
};

let setZindex = function setZindex(el) {
    let zIndex = $(el).css('z-index');
    $(el).data('zIndex', zIndex);

    $(el).css({
        'box-shadow': '5px 5px 5px rgba(0, 0, 0, 0.3)',
        '-webkit-box-shadow': '5px 5px 5px rgba(0, 0, 0, 0.3)',
        '-moz-box-shadow': '5px 5px 5px rgba(0, 0, 0, 0.3)',
    });

    $(el).css('z-index', '100');
};

$(document).ready(function() {
    calendarEl = $('div[data-object="calendar"]');
    calendar = new FullCalendar.Calendar(calendarEl[0], {
        plugins: [ 'dayGrid', 'timeGrid', 'interaction', 'list' ],
        editable: true,
        selectable: true,
        locale: 'pl',
        timeZone: 'Europe/Warsaw',
        firstDay: 1,
        fixedWeekCount: true,
        defaultView: 'timeGridWeek',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'listYear,dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today:    'dziś',
            month:    'miesiąc',
            week:     'tydzień',
            day:      'dzień',
        },
        snapDuration: '00:15:00',
        slotDuration: '00:30:00',
        slotLabelFormat: {
            hour: 'numeric',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'short'
        },
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'short'
        },
        businessHours: [
            {
                daysOfWeek: [ 1, 2, 3, 4, 5 ],
                startTime: '07:00',
                endTime: '16:00',
            },
            {
                daysOfWeek: [ 6 ],
                startTime: '08:00',
                endTime: '16:00',
            },
        ],
        eventLimit: true,
        views: {
            dayGridMonth: {
                eventLimit: 5
            },
            listYear: {
                type: 'list',
                duration: { years: 1 },
                buttonText: 'rok',
                activeStart: new Date().getFullYear() + '-01-01',
            },
        },
        allDaySlot: true,
        defaultAllDayEventDuration: { hours: 24 },
        nowIndicator: true,
        height: 680,
        eventTextColor: '#ffffff',
        navLinks: true,
        events: function(info, successCallback, failureCallback) {
            let user = $('select[name="uid"]').val();
            let searchStr = $('[data-search="event"]').val();

            let url = `event/${info.startStr}/${info.endStr}`;

            if(typeof user !== 'undefined') {
                if(user.length > 0) {
                    let userJson = JSON.stringify(user);

                    url = url + `/${userJson}`;
                }
            }

            if(searchStr.length > 0) {
                url = url + '?search=' + encodeURI(searchStr);
            }

            get(url, function(response) {
                let events = [];

                $.each(response.data, function(k,v) {
                    let color = moment(v.end).isBefore(moment()) ? 'hsl(0, 0%, 80%)' : 'hsl(0,0%,0%)';

                    if(v.user !== null) {
                        if(v.user.settings !== null) {
                            color = moment(v.end).isBefore(moment()) ? v.user.settings.event_color2 : v.user.settings.event_color;
                        } else {
                            color = moment(v.end).isBefore(moment()) ? stringToHslColor(v.user.id + v.user.name, 25, 75) : stringToHslColor(v.user.id + v.user.name);
                        }
                    }

                    events.push({
                        id: v.id,
                        title: v.title,
                        start: v.start,
                        end: v.end,
                        description: v.description,
                        priority: v.priority,
                        status: v.status,
                        type: v.type,
                        created_date: v.created_at,
                        created_user: v.user_created,
                        user: v.user,
                        client: v.client,
                        investment: v.investment,
                        note: v.events_note,
                        history: v.history,
                        phone: v.phone,
                        address: v.address,
                        backgroundColor: color,
                        borderColor: color,
                        allDay: v.all_day,
                    });
                });

                successCallback(events);
            });
        },
        loading: function(isLoading) {},
        dateClick: function(info) {},
        eventRender: function(info) {
            if(calendar.view.type === 'listYear') {
                return;
            }

            if(info.isMirror) {
                return;
            }

            $(info.el).find('.fc-title').addClass('font-weight-bold');

            if(info.event.extendedProps.description) {
                $(info.el).find('.fc-title').after('<span style="font-size: 10px;">' + info.event.extendedProps.description + '</span>');
            }

            if(info.event.extendedProps.priority === eventObject.priority.PRIORITY_HIGH) {
                $(info.el).find('.fc-time').prepend('<i class="mr-2 fa fa-bolt"></i>');
            }
        },
        eventPositioned(info) {
            if(info.isMirror) {
                return;
            }

            if(info.event.extendedProps.newEvent !== undefined) {
                calendar.unselect();

                $(info.el).popover({
                    content: `<form role="form" data-resource="event" data-action="store">
                        <div class="container-fluid">
                            <div class="row mb-1">
                                <div class="col font-weight-bold text-nowrap">Zaplanowano na </div>
                                <div class="col text-right">${moment.utc(info.event.start).format('HH:mm DD-MM-YYYY')}</div>
                            </div>
                            <div class="row mb-1">
                                <div class="col font-weight-bold text-nowrap">Zaplanowano do </div>
                                <div class="col text-right">${moment.utc(info.event.end).format('HH:mm DD-MM-YYYY')}</div>
                            </div>
                            <div class="row mb-1">
                                <div class="col font-weight-bold text-nowrap">Długość zadania </div>
                                <div class="col text-right">${moment.duration(moment(info.event.end).diff(info.event.start)).format('d [day] h [hr] m [min]')}</div>
                            </div>
                            <div class="row mb-1">
                                <div class="col font-weight-bold text-nowrap align-self-center">Przypisane do *</div>
                                <div class="col text-right">
                                    <select class="selectpicker show-tick" name="user_id" data-live-search="true">
                                    </select>
                                </div>
                            </div>
                            <div class="row mb-1">
                                <div class="col font-weight-bold text-nowrap align-self-center">Rodzaj zadania *</div>
                                <div class="col text-right"><select class="form-control-search" name="type">
                                    <option value="" disabled selected>--- wybierz ---</option>
                                    <option value="0">Instalacja</option>
                                    <option value="5">Wizja</option>
                                    <option value="1">Usterka</option>
                                    <option value="2">Demontaż</option>
                                    <option value="3">Modernizacja</option>
                                    <option value="4">Inwestycja</option>
                                    <option value="9">Inne</option>
                                </select></div>
                            </div>
                            <div class="row mb-1">
                                <div class="col font-weight-bold text-nowrap align-self-center">Priorytet *</div>
                                <div class="col text-right"><select class="form-control-search" name="priority">
                                    <option value="0">Niski</option>
                                    <option value="1" selected="selected">Normalny</option>
                                    <option value="2">Wysoki</option>
                                </select></div>
                            </div>
                            <div class="row mb-1">
                                <div class="col font-weight-bold text-nowrap align-self-center">Klient </div>
                                <div class="col text-right">
                                    <div class="ui search resource-search" data-search="client">
                                        <div class="ui icon input">
                                            <input class="form-control-search prompt" type="text" placeholder="Wyszukaj klienta" autocomplete="off" value="${newEventData ? newEventData.client_id : ''}">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-1">
                                <div class="col font-weight-bold text-nowrap align-self-center">Inwestycja </div>
                                <div class="col text-right">
                                    <div class="ui search resource-search" data-search="investment">
                                        <div class="ui icon input">
                                            <input class="form-control-search prompt" type="text" placeholder="Wyszukaj inwestycję" autocomplete="off" value="${newEventData ? newEventData.investment_id : ''}">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-1">
                                <div class="col font-weight-bold text-nowrap align-self-center">Adres </div>
                                <div class="col text-right">
                                    <input class="form-control-search" name="address" placeholder="Dodaj adres" value="${newEventData ? newEventData.address : ''}">
                                </div>
                            </div>
                            <div class="row mb-1">
                                <div class="col font-weight-bold text-nowrap align-self-center">Telefon </div>
                                <div class="col text-right">
                                    <input class="form-control-search" name="phone" placeholder="Dodaj telefon" value="${newEventData ? newEventData.phone : ''}">
                                </div>
                            </div>
                            <div class="row mb-1">
                                <div class="col font-weight-bold text-nowrap align-self-center">Opis </div>
                                <div class="col text-right"><textarea class="form-control-search" style="width: 250px;" rows="5" name="description">${newEventData ? newEventData.description : ''}</textarea></div>
                            </div>
                        </div>
                        <input type="hidden" name="client_id" value="${newEventData ? newEventData.client_id : ''}">
                        <input type="hidden" name="investment_id" value="${newEventData ? newEventData.investment_id : ''}">
                        <span class="mb-2 pull-left">
                            <input type="button" name="cancel" class="btn btn-secondary btn-xs" value="Anuluj">
                        </span>
                        <span class="mb-2 pull-right">
                            <input type="submit" name="submit" class="btn btn-primary btn-xs" value="Utwórz">
                        </span>
                    </form>`,
                    container: '.content',
                    placement: 'auto',
                    boundary: 'scrollParent',
                    html: true,
                    title: `<span class="fc-event-dot" style="background-color: ${info.event.backgroundColor};"></span> <span class="font-weight-bold ml-1">
                            <input class="form-control-search" name="title" placeholder="Dodaj tytuł *" value="${newEventData ? newEventData.title : ''}">
                        </span>`,
                });

                user(false, function(response) {
                    let roles = [];

                    $.each(response, function(k,v) {
                        Object.keys(v.roles).length ? roles.push({
                            id: v.roles[0].id,
                            name: v.roles[0].name,
                        }) : null;
                    });

                    let uniqRoles = roles.reduce((x, y) => x.findIndex(z => z.name === y.name) < 0 ? [...x, y]: x, []);

                    $.each(uniqRoles, function(k,v) {
                        $('[name="user_id"]', '.popover-body').append(`<optgroup label="${v.name}" data-id="${v.id}"></optgroup>`);
                    });

                    $.each(response, function(k,v) {
                        if(Object.keys(v.roles).length) {
                            $('[name="user_id"]', '.popover-body').find(`optgroup[data-id="${v.roles[0].id}"]`).append(`<option data-tokens="${v.roles[0].name}" value="${v.id}">${v.name}</option>`);
                        }
                    });

                    if(newEventData) {
                        $('[name="user_id"]', '.popover-body').find(`option[value="${newEventData.user_id}"]`).prop('selected', true);
                        $('[name="priority"]', '.popover-body').find(`option[value="${newEventData.priority}"]`).prop('selected', true);
                        $('[name="type"]', '.popover-body').find(`option[value="${newEventData.type}"]`).prop('selected', true);
                    }

                    $('[name="user_id"]', '.popover-body').selectpicker();
                    $('[name="uid"]', document).selectpicker();
                });

                $(info.el).popover('toggle');

                search();

                setZindex(info.el);
            }
        },
        eventClick: function(info) {
            let event = calendar.getEventById('newEvent');

            if(event) {
                event.remove();
            }

            eventObject.show(info);
        },
        eventDestroy: function(info) {
            let pop = $('.popover');

            if($(pop).find('[name="title"]').length) {
                newEventData = {
                    title: $(pop).find('[name="title"]').val(),
                    priority: $(pop).find('[name="priority"]').val(),
                    user_id: $(pop).find('[name="user_id"]').val(),
                    address: $(pop).find('[name="address"]').val(),
                    phone: $(pop).find('[name="phone"]').val(),
                    description: $(pop).find('[name="description"]').val(),
                    client_id: $(pop).find('[name="client_id"]').val(),
                    investment_id: $(pop).find('[name="investment_id"]').val(),
                    type: $(pop).find('[name="type"]').val(),
                };
            }

            if($(pop).length) {
                $(pop).remove();
            }
        },
        eventResize: function(info) {
            if(info.event.extendedProps.newEvent !== undefined) {
                return;
            }

            put(`event/${info.event.id}`, {
                start: info.event.start,
                end: info.event.end,
                all_day: info.event.allDay,
            }, function(data) {
                calendar.refetchEvents();
            }, function(data) {
                info.revert();

                switch(response.status) {
                    case 422:
                        notification.error('Wystąpił błąd podczas edycji zadania');

                        break;
                    default:
                        notification.error('Brak uprawnień do edycji zadań');
                }
            });
        },
        eventDrop: function(info) {
            if(info.event.extendedProps.newEvent !== undefined) {
                return;
            }

            put(`event/${info.event.id}`, {
                start: info.event.start,
                end: info.event.end ? info.event.end : moment.utc(info.event.start).add(1, 'day'),
                all_day: info.event.allDay,
            }, function(data) {
                calendar.refetchEvents();
            }, function(data) {
                info.revert();

                switch(response.status) {
                    case 422:
                        notification.error('Wystąpił błąd podczas edycji zadania');

                        break;
                    default:
                        notification.error('Brak uprawnień do edycji zadań');
                }
            });
        },
        select: function(info) {
            if(info.view.type === "dayGridMonth" || $('.popover').length > 0) {
                calendar.unselect();

                closeAllPopovers();

                let event = calendar.getEventById('newEvent');

                if(event) {
                    event.remove();
                }

                return;
            }

            let color = moment(info.end).isBefore(moment()) ? 'hsl(0, 0%, 80%)' : 'hsl(0,0%,0%)';

            calendar.addEvent({
                id: 'newEvent',
                title: 'Nowe zadanie',
                start: info.start,
                end: info.end,
                backgroundColor: color,
                borderColor: color,
                newEvent: Math.random() * 100,
                allDay: info.allDay,
            });
        },
        viewSkeletonRender(arg) {
            // new PerfectScrollbar($(arg.el).find('.fc-scroller').get(0));
        }
    });

    calendar.render();

    user(false, function(response) {
        let select = $('select[name="uid"]');

        let roles = [];

        $.each(response, function(k,v) {
            Object.keys(v.roles).length ? roles.push({
                id: v.roles[0].id,
                name: v.roles[0].name,
            }) : null;
        });

        let uniqRoles = roles.reduce((x, y) => x.findIndex(z => z.name === y.name) < 0 ? [...x, y]: x, []);

        $.each(uniqRoles, function(k,v) {
            $(select).append(`<optgroup label="${v.name}" data-id="${v.id}"></optgroup>`);
        });

        $.each(response, function(k,v) {
            let color;

            if(v.settings !== null) {
                color = v.settings.event_color;
            } else {
                color = stringToHslColor(v.name);
            }

            if(Object.keys(v.roles).length) {
                $(select).find(`optgroup[data-id="${v.roles[0].id}"]`).append(`<option data-tokens="${v.roles[0].name}" value="${v.id}" style="color: ${color}; font-weight: bold;">${v.name}</option>`);
            }
        });

        $(select).selectpicker('refresh');

        if(localStorage.getItem('calendar')) {
            let val = localStorage.getItem('calendar');
            let uid = JSON.parse(val);

            $(select).selectpicker('val', uid);

            calendar.refetchEvents();
        }
    });

    $(document).on('click', '[data-action="edit"]', function(e) {
        let id = $(this).data('id');

        eventObject.edit(id);
    });

    $(document).on('click', '[data-action="copy"]', function(e) {
        let id = $(this).data('id');

        let el = $(`<div class="modal" tabindex="-1" role="dialog" style="z-index: 2500;" data-set="user">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fa fa-user"></i>
                            <span class="ml-2">Wybierz użytkownika, do którego skopiować zadanie</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Zamknij">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                    </div>
                </div>
            </div>
        </div>`);

        let m = $(el).appendTo('body');

        user(false, function(data) {
            $.each(data, function(k,v) {
                $('.modal-body', m).append(`<div class="alert alert-dark clickable-only" style="background-color: ${v.settings ? v.settings.event_color : '#2C3E50'};" data-selectable="user" data-eventid="${id}" data-uid="${v.id}">${v.name}</div>`);
            });

            $(m).modal();
        });
    });

    $(document).on('click', '[data-action="remove"]', function(e) {
        let id = $(this).data('id');

        eventObject.delete(id);
    });

    $(document).on('click', '[data-action="details"]', function(e) {
        let id = $(this).data('id');

        eventObject.details(id);
    });

    $(document).on('change', '[name="uid"]', function(e) {
        calendar.refetchEvents();

        let val = JSON.stringify($(this).val());

        localStorage.setItem('calendar', val);
    });

    $(document).on('click', 'input[name="submit"]', function(e) {
        e.preventDefault();

        $(this).closest('form').submit();
    });

    $(document).on('click', 'input[name="cancel"]', function(e) {
        e.preventDefault();

        closeAllPopovers();

        let event = calendar.getEventById('newEvent');

        if(event) {
            event.remove();
        }

        newEventData = null;
    });

    $(document).on('change', '[name="start"]', function(e) {
        let id = $(this).closest('form').data('id');

        let event = calendar.getEventById(id);

        let start = $(this);
        let end = $(this).closest('.popover-body').find('[name="end"]');

        let duration = (moment.duration(moment(event.end).diff(event.start))).asMinutes();

        if(moment($(end).val()).isBefore(moment($(start).val()))) {
            let endNew = moment($(start).val()).add(duration, 'minutes').format('YYYY-MM-DDTHH:mm');

            $(end).attr('min', endNew);
            $(end).val(endNew);
        }
    });

    $(document).on('click', '[data-selectable]', function(e) {
        e.preventDefault();

        let resource = $(this).data('selectable');
        let value = $(this).text();
        let input = null;

        switch(resource) {
            case 'address':
                input = $('.popover-body', document).find('[name="address"]');

                $(input).val(value);

                break;
            case 'phone':
                input = $('.popover-body', document).find('[name="phone"]');

                $(input).val(value);

                break;
            case 'user':
                value = $(this).data('uid');

                let id = $(this).data('eventid');

                eventObject.copy(id, value);

                break;
        }

        $(this).closest('.modal').modal('hide');
        $(this).closest('.modal').remove();
    });

    $(document).on('submit', 'form', function(e) {
        e.preventDefault();

        let resource = $(this).data('resource');
        let action = $(this).data('action');

        switch(action) {
            case 'store':
                switch(resource) {
                    case 'event':
                        eventObject.store();

                        break;
                }
                break;
            case 'update':
                switch(resource) {
                    case 'event':
                        let id = $(this).data('id');

                        eventObject.update(id);

                        break;
                }
                break;
        }
    });

    $(document).on('hidden.bs.modal', '.modal', function(e) {
        if($(this).data('set') === 'address') {
            $(document).find('[data-set="phone"]').modal();
        }
    });

    $(document).on('click', 'span[data-resource]', function() {
        let resource = $(this).data('resource');
        let id = $(this).data('id');

        switch(resource) {
            case 'client':

                break;
            case 'investment':
                object(Investment).show(id);

                break;
        }
    });

    $(document).on('click', '.photo-lightbox', function(e) {
        e.preventDefault();

        $(this).ekkoLightbox();
    });

    let url = (window.location.href).split('#');

    if(url.length > 1) {
        let route = (url[1]).split('/');

        if(route.length > 0) {
            switch(route[1]) {
                case 'details':
                    eventObject.details(route[2]);

                    break;
            }
        }
    }

    $('body', document).addClass('sidebar-mini');
});
