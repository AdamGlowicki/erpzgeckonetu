var rwdz = function rwdz(page = false, callbackSuccess = false, callbackError = false, sortBy = ['desc', 'data_wplywu_wniosku'], search = false) {
    let resource = 'rwdz';
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
                    <td>${value.data_wplywu_wniosku}</td>
                    <td>${value.data_wydania_decyzji}</td>
                    <td>${value.miasto}</td>
                    <td>${value.ulica}</td>
                    <td>${value.nazwa_zam_budowlanego}</td>
                    <td>${value.nazwa_zamierzenia_bud}</td>
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
    $('li[data-route="rwdz"]').addClass('active');
});