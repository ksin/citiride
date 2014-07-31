class SearchesController < ApplicationController

  def show
    start_coords = find_coords(params[:s])
    destination_coords = find_coords(params[:d])

    @addresses = [params[:s], params[:d]]

    @start_station_data = find_closest(coords: start_coords, looking_for: "availableBikes")
    @destination_station_data = find_closest(coords: destination_coords, looking_for: "availableDocks")

    @map_points = map_points(start_coords, destination_coords, @start_station_data, @destination_station_data)
  end

end