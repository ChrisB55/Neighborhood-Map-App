// ViewModel, marker array for map locations.
var map,
  vm,
  markers = [];

var locations = [{
  title: 'Lincoln Park, Washington',
  location: {
    lat: 38.889249,
    lng: -76.990197

  }
}, {
  title: 'Library of Congress',
  location: {
    lat: 38.888947,
    lng: -77.005921
  }
  }, {
  title: 'Eastern Market',
  location: {
    lat: 38.886446,
    lng: -76.996221
  }
  }, {
  title: 'Nationals Park',
  location: {
    lat: 38.874824,
    lng: -77.007423
  }
  }, {
  title: 'Southwest Waterfront',
  location: {
    lat: 38.877718,
    lng: -77.022362
  }
  }, {
  title: 'Folger Shakespeare Library',
  location: {
    lat: 38.889757,
    lng: -77.002530
  }
}, {
  title: 'Congressional Cemetary',
  location: {
    lat: 38.882919,
    lng: -76.979183
  }
  }, {
  title: 'US National Arborteum',
  location: {
    lat: 38.910233,
    lng: -76.967539
  }
}, {
  title: 'Barracks Row',
  location: {
    lat: 38.881319,
    lng: -76.995007
  },

}];


//Initalizes google map api and places starting location and markers.
function initMap() {
function locationMarker(title, lat, lng) {
  var marker;

  this.title = ko.observable(title);
  this.lat  = ko.observable(lat);
  this.lng  = ko.observable(lng);
}

  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 38.889783,
      lng: -76.988963
    },
    zoom: 15
  });

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

    marker.addListener( 'click', function() {

      populateInfoWindow(this, largeInfowindow)
    this.setIcon('https://www.google.com/mapfiles/marker_green.png');

    });
    bounds.extend(markers[i].position);
  }



  map.fitBounds(bounds);


  vm = new AppViewModel();


  ko.applyBindings(vm);

}


function AppViewModel() {
  var self = this;

  self.locations = ko.observableArray(markers);

  self.searchLocation = ko.observable("");

self.filteredLocations = ko.computed(function() {

 var search = self.searchLocation().toLowerCase();
    if (!self.searchLocation()) {
        return self.locations();
    } else {
        return ko.utils.arrayFilter(self.locations(),function(location) {
          var title = location.title.toLowerCase();
          var match = title.indexOf(search) > -1;
        location.setVisible(match);
          console.log(title, search, match);

            return match;
        });
    }
},AppViewModel);


//Instructs users that more info through wiki api is available. Creates click response and wiki api search.
  self.openWindow = function(marker) {
    //console.log(marker);
    google.maps.event.trigger(marker, 'click');
  };

  self.details = ko.observable("Click a marker to learn more. ");
}

function populateInfoWindow(marker, infowindow) {
  var query = marker.title;

  var wikiURL = 'https://en.wikipedia.org/w/api.php?' +
        'action=opensearch&search=' + query +
        '&format=json&callback=wikiCallback';

      var wikiRequestTimeout = setTimeout(function() {
        vm.details(" Aw, snaps! Wikipedia did't respond.");
      }, 2000);

      $.ajax({
        url: wikiURL,
        dataType: "jsonp",

        success: function (response) {
          var title = response[0];
          var firstUrl = response[3][0];
          var vm = ko.dataFor(document.body);
          vm.details('<em>Wikipedia Page: <br> <a href="' + firstUrl+ '">' + title + '</a></em>');
          var formattedContent = '<div class="info-window"><h2>' + title +
                                '</h2><a href="' + firstUrl +
                                '">go to wikipedia</a></div>';
          infowindow.setContent(formattedContent);
          infowindow.open(map, marker);
          clearTimeout(wikiRequestTimeout);
        }
      });

};
