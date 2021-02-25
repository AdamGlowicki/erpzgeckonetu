var ripe = function ripe(page = false, callbackSuccess = false, callbackError = false, sortBy = []) {
    let resource = 'ripe';
    let sortable = Object.keys(sortBy).length > 0 ? true : false;
    let url = resource + (sortable ? '/sort/' + sortBy[0] + '/' + sortBy[1] : '') + (page !== false ? '?page=' + page : '/all');

    get(url, function(data) {
        console.log(data);

        if(callbackSuccess !== false) {
            callbackSuccess(data);
            return;
        }

        $('table[data-resource="' + resource + '"] > tbody').empty();

        let ths = $('table[data-resource="' + resource + '"] > thead').find('th');
        let span = Object.keys(ths).length-2;

        if(!(Object.keys(data.data).length > 0)) {
            let tbody = `<tr><td class="text-center" colspan="${span}">Brak wyników</td></tr>`;

            $('table[data-resource="' + resource + '"] > tbody').append(tbody);
        } else {
            $.each(data.data, function(key, value) {
                let tbody = `<tr data-element-id="${value.id}">
                    <td>${value.id}</td>
                    <td>${value.org_name}</td>
                    <td>${value.address}</td>
                    <td>${value.email}</td>
                    <td>${value.notify}</td>
                    <td>
                        <i class="tim-icons icon-simple-remove action-remove btn-link btn-icon btn-sm"></i>
                    </td>
                </tr>`;

                $('table[data-resource="' + resource + '"] > tbody').append(tbody);
            });
        }

        sort(resource, sortBy);
        pagination(resource, data);
        onFirstLoad(resource);
    }, function(jqXHR) {
        switch(jqXHR.status) {
            case 403:
                $('div[data-section="' + resource + '"]').hide();
                break;
            default:
                notification.error('Nie udało się pobrać danych: ' + resource);
                break;
        }
    });
};

$(document).ready(function() {
    // data load
    ripe(1);

    $('li[data-route="ripe"]').addClass('active');

    // print action
    $('.action-print').on('click', function() {
        let title = $(this).closest('.modal').find('.doc-name').text();

        $(this).closest('.modal').printThis({
            debug: true,
            pageTitle: title,
            header: '<style>table, td, th, tr, thead, tbody { color: #7c7c7c !important; } .table { color: #7c7c7c; } .table-stripped { color: #7c7c7c; }</style>'
        });
    });

    // remove element
    $('table > tbody').on('click', '.action-remove', function() {
        let resource = $(this).closest('table').attr('data-resource');
        let element = $(this).closest('tr').attr('data-element-id');

        del(resource, element, function(data) {
            notification.success('Element został usunięty');

            refetch(resource);
        }, function(data) {
            notification.error('Nie można usunąć elementu, ponieważ posiada inne przypisane elementy lub nie istnieje!');
        });
    });

    // row actions
    $('section').on('click', '.action-remove-row', function() {
        $(this).closest('.form-row').remove();
    });

    $('button[data-action="submit"]').on('click', function() {
        $('form[data-element="' + $(this).attr('data-form') + '"]').submit();
    });
});
