Rails.application.routes.draw do
  root 'searches#index'

  get 'search/map' => 'searches#map_json'
end
