require 'rails_helper'

describe 'places requests' do

  describe 'GET /api/v1/places/nearby' do
    it 'returns a list of places' do
      get "/api/v1/places/nearby.json", nil, {}
      expect(response).to be_success
    end

  end

end
