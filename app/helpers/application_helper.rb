module ApplicationHelper

  def create_map_data(start, destination)
    start_coords = find_coords(start)
    destination_coords = find_coords(destination)

    # check that both addresses are in New York
    if (verify_new_york(start_coords) && verify_new_york(destination_coords))
      generate_map_json(start, destination, start_coords, destination_coords)
    else
      { inNewYork: false }
    end

  end

  def verify_new_york(coords)
    coords[0] <= 40.91757700 &&
    coords[0] >= 40.47739900 &&
    coords[1] >= -74.2590900 &&
    coords[1] <= -73.70027200
  end

  def generate_map_json(start, destination, start_coords, destination_coords)
    addresses = [start, destination]
    start_station_data = find_closest(coords: start_coords, looking_for: "availableBikes")
    destination_station_data = find_closest(coords: destination_coords, looking_for: "availableDocks")
    map_points = map_points(start_coords, destination_coords, start_station_data, destination_station_data)

    {
      addresses: addresses, 
      startStation: start_station_data, 
      destinationStation: destination_station_data, 
      mapPoints: map_points
    }
  end

  def map_points(start_coords, destination_coords, start_station, destination_station)
    [ start_coords, 
      [start_station["latitude"], start_station["longitude"]], 
      [destination_station["latitude"], destination_station["longitude"]], 
      destination_coords]
  end

  def find_coords(address)
    location = Geocoder.search(address)
    [location[0].latitude, location[0].longitude]
  end

  # INPUT: {coords: [latitude, longitude], looking_for: "availableBikes/availableDocks"}
  # For each station in the station list, calculate the distance from the station to the given coords
  # OUTPUT: Closest station to the given coordinates
  def find_closest(args)
    stations_list = get_station_list
    stations_list.map! do |station|
      distance = GeoDistance.distance(args[:coords][0], args[:coords][1], station["latitude"], station["longitude"])
                  .miles.number
      [station, distance]
    end
    get_closest_available_station(stations_list: stations_list, looking_for: args[:looking_for])
  end

  # INPUT: {stations_list: [[station, distance],[station,distance],...], looking_for: "availableBikes/availableDocks"}
  # Until we find a station that has at least 2 available bikes/docks, keep searching for a dock with minimal distance
  # OUTPUT: A station object
  def get_closest_available_station(args)
    stations_list = args[:stations_list]
    availability = 0
    until availability > 2
      closest_station = stations_list.min_by { |station| station[1] }
      station = stations_list.delete(closest_station)
      availability = station[0][args[:looking_for]]
    end
    station[0]
  end

  # Retrieves list of stations from CitiBike with realtime data
  def get_station_list
    uri = URI.parse("http://www.citibikenyc.com/stations/json")
    res = Net::HTTP.get_response(uri)
    json_response = JSON.parse(res.body)
    json_response["stationBeanList"]
  end

end
