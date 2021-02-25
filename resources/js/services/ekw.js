var ekw = function ekw(page = false, callbackSuccess = false, callbackError = false, sortBy = [], search = false) {
    let resource = 'ekw';
    let sortable = Object.keys(sortBy).length > 0 ? true : false;
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
                    <td>${value.sad}</td>
                    <td>${value.numer}</td>
                    <td>${value.ck}</td>
                </tr>`;

                $('table[data-resource="' + resource + '"] > tbody').append(tbody);
            });
        }

        sort(resource, sortBy);
        pagination(resource, data);
        onFirstLoad(resource);
    });
};

$(document).ready(function() {
    $('table > tbody').on('click', '.clickable td:not(:last-child)', function() {
        let resource = $(this).closest('table').attr('data-resource');
        let id = $(this).closest('tr').attr('data-element-id');
        let modal = $('div[data-element="' + resource + '-clickable"]');
        let element = $(this).closest('div[data-element]').attr('data-element');
        
        let title = $(modal).find('.modal-title');
        let body = $(modal).find('.modal-body');
        
        switch(resource) {
            case 'ekw':
                get(`ekw/${id}`, function(r) {
                    $(title).html(`Księga wieczysta: ${r.sad}/${r.numer}/${r.ck}`);
                    $(body).html(`<div class="row clipboard cadastre">
                        ${r.okladka}
                        ${r.adres}
                        ${r.prawa}
                        ${r.wlasc}
                        ${r.roszcz}
                        ${r.hipo}
                    </div>`);
        
                    $(modal).modal();
                });
                
                break;
        }
    });
});