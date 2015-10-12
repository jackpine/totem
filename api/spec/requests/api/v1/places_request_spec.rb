require 'rails_helper'

describe 'places requests' do

  before do
    Place.create(name: 'place1', is_authoritative: true, authoritative_boundary: "MULTIPOLYGON (((0 0, 0 1, 1 1, 1 0, 0 0)))")
  end

  describe 'GET /api/v1/places/nearby' do
    it 'returns a list of places' do
      get "/api/v1/places/nearby.json", nil, {}
      expect(response).to be_success
    end

  end

end
