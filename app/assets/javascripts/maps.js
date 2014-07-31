function initialize(coords, addresses, startStation, destinationStation) {
  // renders map with center latitude and longitude being the average of 
  // the starting point and the destination point
  var centerLatLng = new google.maps.LatLng((coords[0][0]+coords[3][0])/2,(coords[0][1]+coords[3][1])/2);
  var mapOptions = {
    zoom: 14,
    center: centerLatLng
  };

  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // displays routes
  displayFirstWalkRoute(coords[0], coords[1], addresses[0]);
  displayBikeRoute(coords[1], coords[2], startStation, destinationStation);
  displaySecondWalkRoute(coords[2], coords[3], addresses[1]);
}

function displayFirstWalkRoute(start, startStation, startAddress) {
  var directionsService = new google.maps.DirectionsService();

  var startingLatLng = new google.maps.LatLng(start[0],start[1]);
  var firstStationLatLng = new google.maps.LatLng(startStation[0],startStation[1]);

  var directionsDisplay = new google.maps.DirectionsRenderer();

  directionsDisplay.setMap(map);

  var request = {
    origin : startingLatLng,
    destination : firstStationLatLng,
    travelMode : google.maps.TravelMode.WALKING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setOptions({ preserveViewport: true });
      directionsDisplay.setDirections(response);
      directionsDisplay.setOptions( {suppressMarkers: true});
      showFirstWalkMarkers(response, startAddress);
    }
  });
}

function displayBikeRoute(startStation, nextStation, startStationJson, destinationStationJson) {
  var directionsService = new google.maps.DirectionsService();

  var firstStationLatLng = new google.maps.LatLng(startStation[0],startStation[1]);
  var secondStationLatLng = new google.maps.LatLng(nextStation[0],nextStation[1]);

  var directionsDisplay = new google.maps.DirectionsRenderer();

  directionsDisplay.setMap(map);

  var request = {
    origin : firstStationLatLng,
    destination : secondStationLatLng,
    travelMode : google.maps.TravelMode.BICYCLING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setOptions({ preserveViewport: true });
      directionsDisplay.setDirections(response);
      directionsDisplay.setOptions( {suppressMarkers: true});
      showBikeMarkers(response, startStationJson, destinationStationJson);
    }
  });
}

function showBikeMarkers(directionResult, startStation, destinationStation) {

  var stationInfoWindow = new google.maps.InfoWindow({});
  
  var myRoute = directionResult.routes[0].legs[0];

  for (var i = 0; i < myRoute.steps.length; i++) {

    var icon1 = new google.maps.MarkerImage(
      '/images/map-icons.png',
      new google.maps.Size(42, 53),
      new google.maps.Point(0, sprite_offset(startStation.availableBikes, startStation.availableDocks)),
      new google.maps.Point(22, 53)
    );

    if (i === 0) {
      // Icon as start position
      // icon = "https://chart.googleapis.com/chart?chst=d_map_xpin_icon&chld=pin_star|car-dealer|00FFFF|FF0000";
      var marker = new google.maps.Marker({
        position: myRoute.steps[i].start_point,
        map: map,
        icon: icon1
      });

    // Create an Event Listener that pops up the infoWindow when a user clicks a station
    google.maps.event.addListener(marker, 'click', function() {
      contentString = '<div class="station-window" style="width: 20%, margin: 0">' +
                        // Sets a temporary padding, this helps the station name stay on all one line. Google maps doesn't like the text-transform:uppercase without this
                        '<h2 class="temp-padding" style="margin: 0">' + startStation.stationName + '</h2>' +
                        // if the station is planned, put up a small message saying it is planned, if not, put the table up
                        (startStation.statusValue == 'Planned' ? "<i>(planned station)</i>" :

                          '<div class="station-data">' +
                            '<b>Available Bikes: </b>' + startStation.availableBikes + '<br>' +
                            '<b>Available Docks: </b>' + startStation.availableDocks + '<br>' +
                          '</div>'
                        ) +
                      '</div>';

      // This code helps prevent scroll-bars. Create an element, put the content in the element, then put the element in the window (below)
      var div = document.createElement('div');
      div.innerHTML = contentString;

      // Set the content in the infowindow
      stationInfoWindow.setContent(div);

      // Open the InfoWindow
      stationInfoWindow.open(map, marker);

    });
  }
}
// Icon as end position

var icon2 = new google.maps.MarkerImage(
      '/images/map-icons.png',
      new google.maps.Size(42,53),
      new google.maps.Point(0,sprite_offset(destinationStation.availableBikes,destinationStation.availableDocks)),
      new google.maps.Point(22,53)
      );

var marker2 = new google.maps.Marker({
  position: myRoute.steps[i - 1].end_point,
  map: map,
  icon: icon2
});

google.maps.event.addListener(marker2, 'click', function() {
  contentString = '<div class="station-window">' +
                  // Sets a temporary padding, this helps the station name stay on all one line. Google maps doesn't like the text-transform:uppercase without this
                    '<h2 class="temp-padding" style="margin: 0">' + destinationStation.stationName + '</h2>' +
                  // if the station is planned, put up a small message saying it is planned, if not, put the table up
                    (destinationStation.statusValue == 'Planned' ? "<i>(planned station)</i>" :
                      //if we have don't have sponsorship info:....
                      '<div class="station-data">' +
                        '<b>Available Bikes: </b>' + destinationStation.availableBikes + '<br>' +
                        '<b>Available Docks: </b>' + destinationStation.availableDocks + '<br>' +
                      '</div>'
                    ) +
                  '</div>';

  // This code helps prevent scroll-bars. Create an element, put the content in the element, then put the element in the window (below)
  var div = document.createElement('div');
  div.innerHTML = contentString;

  // Set the content in the infowindow
  stationInfoWindow.setContent(div);

  // Open the InfoWindow
  stationInfoWindow.open(map, marker2);

  });
}

function showFirstWalkMarkers(directionResult, startAddress) {

  var stationInfoWindow = new google.maps.InfoWindow({});

  var myRoute = directionResult.routes[0].legs[0];

  for (var i = 0; i < myRoute.steps.length; i++) {
    // var assetPath = "<%= asset_path 'stations/map-icons.png' %>";
    
    var icon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=A|FFFFFF|000000';

    if (i == 0) {
    // Icon as start position
    // icon = "https://chart.googleapis.com/chart?chst=d_map_xpin_icon&chld=pin_star|car-dealer|00FFFF|FF0000";
    var marker = new google.maps.Marker({
      position: myRoute.steps[i].start_point,
      map: map,
      icon: icon
    });

    // Create an Event Listener that pops up the infoWindow when a user clicks a station
    google.maps.event.addListener(marker, 'click', function() {
      contentString = '<div class="station-window"  style="width: 20%, margin: 0">' +
                        // Sets a temporary padding, this helps the station name stay on all one line. Google maps doesn't like the text-transform:uppercase without this
                        '<h2 class="temp-padding" style="padding-right: 1.5em">' + startAddress + '</h2>' +
                        // if the station is planned, put up a small message saying it is planned, if not, put the table up
                        
                        '<table id="station-table">' +
                        '</table>'  +
                      '</div>';

                // This code helps prevent scroll-bars. Create an element, put the content in the element, then put the element in the window (below)
                var div = document.createElement('div');
                div.innerHTML = contentString;

                // Set the content in the infowindow
                stationInfoWindow.setContent(div);

                // Open the InfoWindow
                stationInfoWindow.open(map, marker);


                // End of infowindow domready event listener
              });
    }
  // attachInstructionText(marker, myRoute.steps[i].instructions);
  // markerArray.push(marker);
  }

}

function showSecondWalkMarkers(directionResult, destination) {

  var stationInfoWindow = new google.maps.InfoWindow({});

  var myRoute = directionResult.routes[0].legs[0];

  for (var i = 0; i < myRoute.steps.length; i++) {
    var icon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=B|FFFFFF|000000';

    if (i == myRoute.steps.length-1) {
    // Icon as start position
    var marker = new google.maps.Marker({
      position: myRoute.steps[i].start_point,
      map: map,
      icon: icon
    });
      // Create an Event Listener that pops up the infoWindow when a user clicks a station
      google.maps.event.addListener(marker, 'click', function() {
        contentString = '<div class="station-window" style="width: 20%, margin: 0">' +
                          // Sets a temporary padding, this helps the station name stay on all one line. Google maps doesn't like the text-transform:uppercase without this
                          '<h2 class="temp-padding" style="padding-right: 1.5em">' + destination + '</h2>' +
                            // if the station is planned, put up a small message saying it is planned, if not, put the table up
                            
                          '<table id="station-table">' +
                          '</table>'  +
                        '</div>';

                // This code helps prevent scroll-bars. Create an element, put the content in the element, then put the element in the window (below)
                var div = document.createElement('div');
                div.innerHTML = contentString;

                // Set the content in the infowindow
                stationInfoWindow.setContent(div);

                // Open the InfoWindow
                stationInfoWindow.open(map, marker);

                // End of infowindow domready event listener
              });
    }

  }

}

function displaySecondWalkRoute(nextStation, destination, destinationAddress) {
  var directionsService = new google.maps.DirectionsService();

  var secondStationLatLng = new google.maps.LatLng(nextStation[0],nextStation[1]);
  var destinationLatLng = new google.maps.LatLng(destination[0],destination[1]);

  var directionsDisplay = new google.maps.DirectionsRenderer();


  directionsDisplay.setMap(map);

  var request = {
    origin : secondStationLatLng,
    destination : destinationLatLng,
    travelMode : google.maps.TravelMode.WALKING
  };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setOptions({ preserveViewport: true });
      directionsDisplay.setDirections(response);
      directionsDisplay.setOptions( {suppressMarkers: true});
      showSecondWalkMarkers(response, destinationAddress);
    }
  });
}

function sprite_offset(bikes,docks) {
  var index_offset;

  // Only if the station is not reporting 0 bikes and 0 docks
  if (!(bikes === 0 && docks === 0)) {
    var percent=Math.round(bikes/(bikes+docks)*100);

    // Use the empty icon only for empty stations, ditto for full. Anything in-between, show different icon
    if (percent === 0)
      index_offset = 0;
    else if (percent > 0 && percent <= 33)
      index_offset = 1;
    else if (percent > 33 && percent < 67)
      index_offset = 2;
    else if (percent >= 67 && percent < 100)
      index_offset = 3;
    else if (percent == 100)
      index_offset = 4;
  }

  var offset = index_offset * (53 + 50); // 53 the height of the pin portion of the image, 50 the whitespace b/t the pin portions
  return offset;
}


function renderMap(coords, addresses, startStation, destinationStation) {
  google.maps.event.addDomListener(window, 'load', initialize(coords, addresses, startStation, destinationStation));
}