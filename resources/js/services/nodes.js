let map;
let start;
let markers = [];

function removeMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

let nodes = function nodes() {
    removeMarkers();

    get('lms/netnode', function(response) {
        $.each(response, function(k,v) {
            let marker = new google.maps.Marker({
                position: { lat: parseFloat(v.latitude), lng: parseFloat(v.longitude) },
                map: map,
                animation: google.maps.Animation.DROP,
            });

            markers.push(marker);
        });
    });
}

$(document).ready(function() {
    start = {
        lat: 53.648983,
        lng: 18.727242
    };

    map = new google.maps.Map(document.getElementById('map'), { zoom: 10, center: start });

    nodes();

    $('body', document).addClass('sidebar-mini');
});
