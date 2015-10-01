Rails.application.routes.draw do

  namespace 'api' do
    namespace 'v1' do
      namespace 'places' do
        get 'nearby', action: :nearby
      end
    end
  end

end
