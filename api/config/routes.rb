Rails.application.routes.draw do

  namespace 'api' do
    namespace 'v1' do
      resource 'places', only: [:create] do
        get 'nearby', action: :nearby
      end
    end
  end

end
