const api = 'api/';

let get = function(resource, callbackSuccess = false, callbackError = false) {
    $.ajax({
        type: 'GET',
        url: api + resource,
        beforeSend: function(request) {
            request.setRequestHeader('Accept', 'application/json');
            request.setRequestHeader('Content-Type', 'application/json');
            Cookies.get('apiToken') && request.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('apiToken'));
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: function(data) { callbackSuccess(data); },
        error: function(jqXHR) { callbackError !== false ? callbackError(jqXHR) : handleError(jqXHR); }
    });
};

let download = function(resource, filename, callbackSuccess = false, callbackError = false) {
    $.ajax({
        type: 'GET',
        url: api + resource,
        beforeSend: function(request) {
            Cookies.get('apiToken') && request.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('apiToken'));
        },
        xhrFields: {
            responseType: 'blob'
        },
        async: true,
        success: function(data) {
            if(callbackSuccess !== false) {
                callbackSuccess(data);
            }

            let a = document.createElement('a');
            let url = window.URL.createObjectURL(data);

            a.href = url;
            a.download = filename;

            document.body.append(a);

            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        },
        error: function(jqXHR) { callbackError !== false ? callbackError(jqXHR) : handleError(jqXHR); }
    });
};

let file = function(resource, callbackSuccess = false, callbackError = false) {
    $.ajax({
        type: 'GET',
        url: api + resource,
        beforeSend: function(request) {
            Cookies.get('apiToken') && request.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('apiToken'));
        },
        async: true,
        success: function(data) { callbackSuccess(data); },
        error: function(jqXHR) { callbackError !== false ? callbackError(jqXHR) : handleError(jqXHR); }
    });
};

let post = function(resource, data, callbackSuccess = false, callbackError = false) {
    if(data instanceof FormData) {
        $.ajax({
            type: 'POST',
            url: api + resource,
            data: data,
            beforeSend: function(request) {
                request.setRequestHeader('Accept', 'application/json');
                Cookies.get('apiToken') && request.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('apiToken'));
            },
            contentType: false,
            processData: false,
            async: true,
            success: function(data) { callbackSuccess(data); },
            error: function(jqXHR) { callbackError !== false ? callbackError(jqXHR) : handleError(jqXHR); }
        });
    } else {
        $.ajax({
            type: 'POST',
            url: api + resource,
            data: JSON.stringify(data),
            beforeSend: function(request) {
                request.setRequestHeader('Accept', 'application/json');
                request.setRequestHeader('Content-Type', 'application/json');
                Cookies.get('apiToken') && request.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('apiToken'));
            },
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: function(data) { callbackSuccess(data); },
            error: function(jqXHR) { callbackError !== false ? callbackError(jqXHR) : handleError(jqXHR); }
        });
    }
};

let put = function(resource, data, callbackSuccess = false, callbackError = false) {
    if(data instanceof FormData) {
        data.append('_method', 'PUT');

        $.ajax({
            type: 'POST',
            url: api + resource,
            data: data,
            beforeSend: function(request) {
                request.setRequestHeader('Accept', 'application/json');
                Cookies.get('apiToken') && request.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('apiToken'));
            },
            contentType: false,
            processData: false,
            async: true,
            success: function(data) { callbackSuccess(data); },
            error: function(jqXHR) { callbackError !== false ? callbackError(jqXHR) : handleError(jqXHR); }
        });
    } else {
        $.ajax({
            type: 'PUT',
            url: api + resource,
            data: JSON.stringify(data),
            beforeSend: function(request) {
                request.setRequestHeader('Accept', 'application/json');
                request.setRequestHeader('Content-Type', 'application/json');
                Cookies.get('apiToken') && request.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('apiToken'));
            },
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: function(data) { callbackSuccess(data); },
            error: function(jqXHR) { callbackError !== false ? callbackError(jqXHR) : handleError(jqXHR); }
        });
    }
};

let del = function(resource, id, callbackSuccess = false, callbackError = false) {
    $.ajax({
        type: 'DELETE',
        url: api + resource + '/' + id,
        beforeSend: function(request) {
            request.setRequestHeader('Accept', 'application/json');
            request.setRequestHeader('Content-Type', 'application/json');
            Cookies.get('apiToken') && request.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('apiToken'));
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: function(data) { callbackSuccess(data); },
        error: function(jqXHR) { callbackError !== false ? callbackError(jqXHR) : handleError(jqXHR); }
    });
};

let handleError = function(jqXHR) {
    switch(jqXHR.status) {
        case 403:
            notification.error('Nie udało się pobrać danych: ' + jqXHR.status);
            break;
        case 401:
            window.location.href = '/login';
            break;
    }
};

let parseErrors = (form, data, msg) => {
    if(!data) {
        notification.error(msg);

        return;
    }

    $(form).find('.has-danger').each(function() {
        $(this).removeClass('has-danger');
    });

    if(Object.keys(data.responseJSON.errors).length) {
        $.each(data.responseJSON.errors, function(k, v) {
            let input = $(form).find(`[name="${k}"]`);

            if($(input).attr('type') === 'hidden') {
                return;
            }

            $(input).parent().addClass('has-danger');

            let label = $(input).siblings('label').html();

            if(typeof label === 'undefined') {
                label = $(input).parent().siblings('label').html();
            }

            if(typeof label === 'undefined') {
                label = $(input).closest('label').html();
            }

            if(typeof label === 'undefined') {
                return;
            }

            msg += `<br><br>${label}`;

            $.each(v, function(key, value) {
                msg += `<br>- ${value}`;
            });
        });
    }

    notification.error(msg);
};
