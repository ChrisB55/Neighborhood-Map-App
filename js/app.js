//function AppViewModel() {

//}

// Activates knockout
//ko.applyBindings(new AppViewModel());
      function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: {lat: 38.889783, lng: -76.988963}
        });
        var geocoder = new google.maps.Geocoder();
        document.getElementById('submit').addEventListener('click', function() {
          geocodeAddress(geocoder, map);
        });
      }
      function geocodeAddress(geocoder, resultsMap) {
        var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            resultsMap.setCenter(results[0].geometry.location);
            //TODO: Insert code here to take the first result's formatted address, and LOCATION.
            document.getElementById('geoInfo').innerHTML="This is Lincoln Park"; // PUT STUFF HERE
            document.getElementById('geoInfoSecond').innerHTML="in Capitol Hill"; // PUT STUFF HERE
          } else {
            alert('Geocode please try again later. Result status: ' + status);
          }
        });
      }


