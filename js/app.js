var map,
  vm,
  markers = [];

var locations = [{
  title: 'Lincoln Park, Washington, DC',
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
  title: 'US Supreme Court',
  location: {
    lat: 38.890610,
    lng: -77.003674
  }
}, {
  title: 'RFK Stadium',
  location: {
    lat: 38.889822,
    lng: -76.974052
  }
}, {
  title: 'Barracks Row',
  location: {
    lat: 38.881319,
    lng: -76.995007
  }

}];

function initMap() {

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

 var search = self.filteredLocations().toLowerCase();
    if (!self.filteredLocations) {
        return self.filteredLocations();
    } else {
        return ko.utils.arrayFilter(self.filteredLocations(),function(locations) {
            return ko.utils.indexOf(self.filteredLocations().toLowerCase());
        });
    }
},AppViewModel);





  self.openWindow = function(marker) {
    //console.log(marker);
    google.maps.event.trigger(marker, 'click');
  };

  self.details = ko.observable("<em>Wiki Api Details</em>");
}

function populateInfoWindow(marker, infowindow) {
  var query = marker.title;

  var wikiURL = 'https://en.wikipedia.org/w/api.php?' +
        'action=opensearch&search=' + query +
        '&format=json&callback=wikiCallback';

      var  wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("wikipedia did't respond.");
      }, 8000);

      $.ajax({
        url: wikiURL,
        dataType: "jsonp",

        success: function (response) {
          var title = response[0];
          var firstUrl = response[3][0];
          var vm = ko.dataFor(document.body);
          vm.details('<em>Wiki Article <a href="' + firstUrl+ '">' + title + '</a></em>');
          clearTimeout(wikiRequestTimeout);
        }
      });

};





