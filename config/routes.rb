Rails.application.routes.draw do

  root 'searches#index'

  get 'search' => 'searches#show', as: 'search'

end
