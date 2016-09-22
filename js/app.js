//function AppViewModel() {

//}

// Activates knockout
//ko.applyBindings(new AppViewModel());
var map;

var markers = [];

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 38.889783,
            lng: -76.988963
        },
        zoom: 15
    });

    var locations = [ {
        title: 'Lincoln Park',
        location: {
            lat: 38.889249,
            lng: -76.990197
        }
    }, {
        title: 'Eastern Market',
        location: {
            lat: 38.886446,
            lng: -76.996221
        }
    }, {
        title: 'Congressional Cemetary',
        location: {
            lat: 38.882919,
            lng: -76.979183
        }
    }, {
        title: 'Frederick Douglas Museum',
        location: {
            lat: 38.890962,
            lng: -77.001087
        }
    }, {
        title: 'William Penn House',
        location: {
            lat: 38.889788,
            lng: -76.998759
        }
    }, {
        title: 'Barracks Row',
        location: {
            lat: 38.881319,
            lng: -76.995007
        }
    }];


    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < locations.length; i++) {

        var position = locations[i].location;
        var title = locations[i].title;

        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });

        markers.push(marker);

        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
        bounds.extend(markers[i].position);
    }

    map.fitBounds(bounds);
}

function populateInfoWindow(marker, infowindow) {

    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);

        infowindow.addListener('closeclick', function() {
            infowindow.setMarker(null);
        });
    }
}