Rails.application.routes.draw do

  namespace 'api' do
    namespace 'v1' do
      resources 'places', only: [:create] do
        collection do
          get 'nearby', action: :nearby
        end
        resources :visits, only: [:create]
      end
    end
  end

end
