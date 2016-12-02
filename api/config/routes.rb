Rails.application.routes.draw do

  devise_for :users

  root to: "home#index"
  get 'privacy', to: 'home#privacy'
  get 'about', to: 'home#about'

  get "auth_token_pairs/me", to: "auth_token_pairs#me"

  namespace 'api' do
    namespace 'v1' do
      resources 'places', only: [:create] do
        collection do
          get 'nearby', action: :nearby
        end
        resources :visits, only: [:create]
        resources :messages, only: [:index, :create]
      end
    end
  end

end
