class SearchesController < ApplicationController

  def map_json
    map_data = create_map_data(params[:s], params[:d])
    
    render json: map_data.to_json
  end

end

