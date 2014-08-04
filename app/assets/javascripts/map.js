var BikeMap = {

  init: function() {

    // binds map rendering to form submit
    $('form').on('submit', function(e) {

      e.preventDefault();

      var starting = $("input[id='s']").val();
      var destination = $("input[id='d']").val();

      $('.index').remove();
      $('body').append("<div id='map'></div>");

      var ajaxRequest = $.ajax({
        url: '/search/map',
        type: 'GET',
        data: {s: starting, d: destination}
      });

      ajaxRequest.done(function(mapData) {
        this.render(mapData.mapPoints, mapData.addresses, mapData.startStation, mapData.destinationStation);
      }.bind(this));

    }.bind(this));

  },

  render: function(coords, addresses, startStation, destinationStation) {

    // renders map with center latitude and longitude being the average of 
    // the starting point and the destination point
    var centerLatLng = new google.maps.LatLng((coords[0][0]+coords[3][0])/2,(coords[0][1]+coords[3][1])/2);
    var mapOptions = {
      zoom: this.calculateZoom(coords[0][1], coords[3][1]),
      center: centerLatLng
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // render walking route from starting point to first station
    this.displayRoute({ start: coords[0],
                        end: coords[1],
                        travelMode: google.maps.TravelMode.WALKING,
                        address: [addresses[0]],
                        showMarker: this.showMarker.bind(this),
                        markerType: 'start' });
    // render bike route from station to station
    this.displayRoute({ start: coords[1],
                        end: coords[2],
                        travelMode: google.maps.TravelMode.BICYCLING,
                        address: [startStation, destinationStation],
                        showMarker: this.showMarker.bind(this),
                        markerType: 'bike' });
    // render walking route from second station to destination
    this.displayRoute({ start: coords[2],
                        end: coords[3],
                        travelMode: google.maps.TravelMode.WALKING,
                        address: [addresses[1]],
                        showMarker: this.showMarker.bind(this),
                        markerType: 'end' });

  },

  calculateZoom: function(longitude1, longitude2) {
    var distance = longitude1 - longitude2;

    if (Math.abs(distance) >= 0.03) {
      return 14;
    } else if (Math.abs(distance) >= 0.02) {
      return 15;
    } else {
      return 16;
    }

  },

  displayRoute: function(args) {

    var startLatLng = new google.maps.LatLng(args.start[0], args.start[1]);
    var endLatLng = new google.maps.LatLng(args.end[0], args.end[1]);
    var request = {
      origin: startLatLng,
      destination: endLatLng,
      travelMode: args.travelMode
    };
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    directionsDisplay.setMap(this.map);

    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setOptions({ preserveViewport: true });
        directionsDisplay.setDirections(response);
        directionsDisplay.setOptions( {suppressMarkers: true});
        args.showMarker(response, args.address, args.markerType);
      }
    });

  },

  showMarker: function(directionResult, address, markerType) {

    var marker, marker2;
    var myRoute = directionResult.routes[0].legs[0];

    // show walk marker if one address is passed
    if (address.length == 1) {

      if (markerType == 'start') {
        marker = this.makeMarker(myRoute, 'A');

      } else if (markerType == 'end') {
        marker = this.makeMarker(myRoute, 'D');
      }

      this.addMarkerListener(marker, address, markerType);

    // show station markers if two addresses are passed
    } else {

      marker = this.makeMarker(myRoute, 'B');
      marker2 = this.makeMarker(myRoute, 'C');

      this.addMarkerListener(marker, address[0], markerType);
      this.addMarkerListener(marker2, address[1], markerType);

    }

  },

  makeMarker: function(myRoute, point) {
    var icon, position, marker, i;

    // defines the icon and position for the four key points of the map
    if (point == 'A') {
      icon = '/images/letter_a.png';
      position = myRoute.steps[0].start_point;
    }

    else if (point == 'B') {
      icon = '/images/stationicon.png';
      position = myRoute.steps[0].start_point;

    } else if (point == 'C') {
      icon = '/images/stationicon.png';
      i = myRoute.steps.length-1;
      position = myRoute.steps[i].end_point;

    } else if (point == 'D') {
      icon = '/images/letter_b.png';
      i = myRoute.steps.length-1;
      position = myRoute.steps[i].end_point;
    }

    marker = new google.maps.Marker({
      position: position,
      map: this.map,
      icon: icon
    });

    return marker;
  },

  addMarkerListener: function(marker, addressOrStation, markerType) {

    google.maps.event.addListener(marker, 'click', function() {

      var contentString;
      var stationInfoWindow = new google.maps.InfoWindow({maxWidth: 1000});
      var div = document.createElement('div');

      if (markerType == 'bike') {
        contentString = this.generateStationContent(addressOrStation);
      } else {
        contentString = this.generateAddressContent(addressOrStation);
      }

      // This code helps prevent scroll-bars. Create an element, put the content in the element, then put the element in the window (below)
      div.innerHTML = contentString;
      // Set the content in the infowindow
      stationInfoWindow.setContent(div);
      stationInfoWindow.open(this.map, marker);

    }.bind(this));

  },

  generateAddressContent: function(address) {
    return  '<div class="station-window">' +
              '<h2>' + address + '</h2>' +
            '</div>';
  },

  generateStationContent: function(station) {
    return  '<div class="station-window">' +
              '<h2>' + station.stationName + '</h2>' +
              // if the station is planned, put up a small message saying it is planned, if not, put the table up
              (station.statusValue == 'Planned' ? "<i>(planned station)</i>" :
                '<div class="station-data">' +
                  '<b>Available Bikes: </b>' + station.availableBikes + '<br>' +
                  '<b>Available Docks: </b>' + station.availableDocks + '<br>' +
                '</div>'
              ) +
            '</div>';
  }

};

$(document).ready(function() {
  BikeMap.init();
});
