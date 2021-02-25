class ReportClass {
    constructor() {
        this.data = {};
        this.data.resource = 'report';
        this.data.id = null;
    }

    get resource() {
        return this.data.resource;
    }

    get id() {
        return this.data.id;
    }

    get(response) {
        let overtime = 0.00;

        let isSameUser = (parseInt(Cookies.get('userId')) === parseInt($('[name="user_id"]', document).val()));

        if(isSameUser) {
            $('table', document).find('[name="content"]').prop('disabled', false);
            $('table', document).find('[name="overtime"]').prop('disabled', false);
        }

        $.each(response.data, function(k,v) {
            let row = $(`[data-date="${v.date}"]`);

            $(row).find('[name="content"]').val(v.content);
            $(row).find('[name="overtime"]').val(v.overtime);
            $(row).next('tr').find('[data-type="created_at"]').html(v.created_at);
            $(row).next('tr').find('[data-type="updated_at"]').html(v.updated_at);
        });

        $('table[data-element="report"]', document).find('input[name="overtime"]').each(function() {
            overtime = overtime + parseFloat($(this).val());

            console.log($(this).val());
        });

        $('table > tbody', document).append(`<tr>
            <td colspan="2">
                <span class="pull-right">Suma nadgodzin</span>
            </td>
            <td>
                <span class="pull-right">${overtime} h</span>
            </td>
        </tr>`);

        $('[name="content"], [name="overtime"]', document).on('blur', function(e) {
            let date = $(this).closest('tr').data('date');
            let content = $(this).closest('tr').find('[name="content"]').val();
            let overtime = $(this).closest('tr').find('[name="overtime"]').val();

            reportObj.createOrUpdate(date, content, overtime);
        });

        $('.loading', document).hide();
    }

    createOrUpdate(date, content, overtime) {
        let data = {
            date: date,
            content: content,
            overtime: overtime,
        };

        post('report', data, function(response) {
            notification.success('Raport został zapisany');
        });
    }
}

function getDaysArrayByMonth(month) {
    var daysInMonth = moment(month, 'YYYY-MM').daysInMonth();
    var arrDays = [];

    while(daysInMonth) {
        var current = moment(month, 'YYYY-MM').date(daysInMonth);
        arrDays.push(current);
        daysInMonth--;
    }

    return arrDays;
}

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


let reportObj = new ReportClass();

$(document).ready(function() {
    moment.locale('pl');

    get('user/all/active', function(response) {
        $.each(response, function(k,v) {
            $('[name="user_id"]', document).append(`<option value="${v.id}">${v.name}</option>`);
        });

        $('[name="user_id"]', document).find(`option[value="${Cookies.get('userId')}"]`).prop('selected', true);
    });

    $('[name="month"]', document).val(moment().format('YYYY-MM'));
    $('[name="month"]', document).on('change', function(e) {
        let month = $(this).val();
        let user_id = $('[name="user_id"]', document).val();

        let days = getDaysArrayByMonth(month).reverse();

        let url;

        if(user_id) {
            url = `report/${month}/${user_id}`;
        } else {
            url = `report/${month}`;
        }

        get(url, function(response) {
            $('table > tbody', document).empty();

            let processedItems = 0;

            days.forEach(function(item) {
                $('table > tbody', document).append(`<tr${[0,6].includes(item.day()) ? ' style="background-color: #e3e3e3;"' : ''} data-date="${item.format('YYYY-MM-DD')}">
                    <th scope="row">
                        ${item.format('DD-MM-YYYY')} <br>(${item.format('dddd')})
                    </th>
                    <td>
                        <textarea class="form-control-search" disabled="disabled" rows="5" style="width: 100%;" name="content"></textarea>
                    </td>
                    <td>
                        <input class="form-control" type="number" disabled="disabled" min="0" step="0.25" name="overtime" value="0.00">
                    </td>
                </tr>
                <tr${[0, 6].includes(item.day()) ? ' style="background-color: #e3e3e3;"' : ''}>
                    <td></td>
                    <td colspan="2">
                        <div class="row">
                            <div class="col">
                                Data dodania: <span data-type="created_at">brak raportu</span>
                            </div>
                            <div class="col">
                                Data edycji: <span data-type="updated_at">brak raportu</span>
                            </div>
                        </div>
                    </td>
                </tr>`);

                processedItems++;

                if(processedItems === Object.keys(days).length) {
                    setTimeout(function() {
                        object(ReportClass).get(response);
                    }, 100);
                }
            });
        });
    });

    $('[name="month"]', document).trigger('change');

    $('[name="user_id"]', document).on('change', function(e) {
        $('[name="month"]', document).trigger('change');
    });

    $('body', document).addClass('sidebar-mini');
});
