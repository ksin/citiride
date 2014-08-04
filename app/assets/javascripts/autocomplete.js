var AutoComplete = {
  
  init: function() {

    var inputS = document.getElementById('s');
    var inputD = document.getElementById('d');
    var bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(40.91757700, -74.2590900),
      new google.maps.LatLng(40.47739900, -73.70027200)
    );
    var options = ({
      bounds: bounds,
      componentRestrictions: {country: 'us'}
    });

    new google.maps.places.Autocomplete(inputS, options);
    new google.maps.places.Autocomplete(inputD, options);

    this.geolocate();
  },

  // Bias the autocomplete object to the user's geographical location,
  // as supplied by the browser's 'navigator.geolocation' object.
  geolocate: function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = new google.maps.LatLng(
            position.coords.latitude, position.coords.longitude);
        autocomplete.setBounds(new google.maps.LatLngBounds(geolocation,
            geolocation));
      });
    }
  }

};

$(document).ready(function() {
  AutoComplete.init();
});