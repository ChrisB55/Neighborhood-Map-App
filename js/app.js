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

    marker.addListener('click', function() {
var self = this;

      populateInfoWindow(this, largeInfowindow);
    this.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                self.setAnimation(null);
            }, 1400);

    });
    bounds.extend(markers[i].position);
  }



  map.fitBounds(bounds);


  vm = new AppViewModel();


  ko.applyBindings(vm);

}


function AppViewModel() {
  var self = this;

  self.marker = ko.observableArray(markers);

  self.searchLocation = ko.observable("");

//markers.forEach(function (location) {
 // self.marker.setVisible(location);
 // });



self.filteredLocations = ko.computed(function() {

 var search = self.searchLocation().toLowerCase();
    if (!self.searchLocation) {
       for (var i = 0; i > self.marker.length; i++) {
        self.marker[i].setVisible(true);
        return self.marker();
      }
    } else {
        return ko.utils.arrayFilter(self.marker(),function(location) {
          var title = location.title.toLowerCase();
          var match = title.indexOf(search) > -1;
        location.setVisible(match);
         // console.log(title, search, match);

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
        vm.details(" You'll have to try again later.");
          var formattedContent = '<div class="info-window"> <h4>' + query +' </h4> "Aw, snaps! No Wikipedia response right now"</h4></div>' ;
        infowindow.setContent(formattedContent);
          infowindow.open(map, marker);
      }, 2000);

      $.ajax({
        url: wikiURL,
        dataType: "jsonp",

        success: function (response) {
          var title = response[0];
          var firstUrl = response[3][0];
          var wikiSnippet = response[2][0];
          vm.details('<em>Wikipedia Page: <br> <a href="' + firstUrl+ '">' + title + ' '+ wikiSnippet +' </a></em>');
          var formattedContent = '<div class="info-window"><h2>' + title +
                                '</h2><a href="' + firstUrl +
                                '">go to wikipedia</a></div>';
          infowindow.setContent(formattedContent);
          infowindow.open(map, marker);
          clearTimeout(wikiRequestTimeout);
        }
      });

};
