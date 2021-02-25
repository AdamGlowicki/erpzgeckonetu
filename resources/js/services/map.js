let map;
let start;
let markers = [];
let paths = [];

function cMarker(color) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1,
    };
}

function removeMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function removePaths() {
    for (let i = 0; i < paths.length; i++) {
        paths[i].setMap(null);
    }
}

let fetchLocation = function fetchLocation() {
    removeMarkers();
    removePaths();

    get('location', function(response) {
        $.each(response.data, function(k,v) {
            let color = v.user.settings !== null ? v.user.settings.event_color : '#ffffff';

            let marker = new google.maps.Marker({
                position: { lat: parseFloat(v.lat), lng: parseFloat(v.long) },
                map: map,
                // animation: google.maps.Animation.DROP,
                icon: cMarker(color),
            });

            let st = moment(v.created_at, 'YYYY-MM-DD HH:mm:ss');
            let end = moment();

            let infowindow = new google.maps.InfoWindow({
                content: `<div class="row">
                    <div class="col">
                        <span class="font-weight-bold">${v.user.name}</span>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col">
                    Ostatnio widziany: ${parseInt(moment.duration(end.diff(st)).asMinutes())} min temu (${v.created_at})
                    </div>
                </div>`,
                map: map,
                maxWidth: 470,
            });

            infowindow.set('opened', false);

            marker.addListener('mouseover', function() {
                infowindow.open(map, this);
            });

            marker.addListener('mouseout', function() {
                infowindow.close();
            });

            marker.addListener('click', function() {
                map.setZoom(16);
                map.setCenter(marker.getPosition());

                if(!infowindow.get('opened')) {
                    infowindow.open(map, this);
                    infowindow.set('opened', true);

                    google.maps.event.clearListeners(marker, 'mouseover');
                    google.maps.event.clearListeners(marker, 'mouseout');
                } else {
                    infowindow.close();
                    infowindow.set('opened', false);

                    marker.addListener('mouseover', function() {
                        infowindow.open(map, this);
                    });

                    marker.addListener('mouseout', function() {
                        infowindow.close();
                    });
                }
            });

            let dateFrom = moment().format('YYYY-MM-DD');
            let dateTo = moment().add(1, 'days').format('YYYY-MM-DD');

            get(`location/${v.user.id}/${dateFrom}/${dateTo}`, function(response) {
                let cords = [];

                $.each(response.data, function(k,v) {
                    cords.push({
                        lat: parseFloat(v.lat),
                        lng: parseFloat(v.long),
                    });
                });

                const path = new google.maps.Polyline({
                    path: cords,
                    geodesic: true,
                    strokeColor: v.user.settings !== null ? v.user.settings.event_color : '##000000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });

                path.setMap(map);

                paths.push(path);
            });

            markers.push(marker);
        });
    });
}

$(document).ready(function() {
    // The location of Uluru
    start = {
        lat: 53.648983,
        lng: 18.727242
    };

    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById('map'), {zoom: 10, center: start});
    // The marker, positioned at Uluru

    fetchLocation();

    $('body', document).addClass('sidebar-mini');
});
