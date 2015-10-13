require 'rails_helper'

describe 'places requests' do

  let(:location_params) { "-122.4082270,37.7873590" }
  before do
    Place.create(name: 'place1', is_authoritative: true, authoritative_boundary: "MULTIPOLYGON (((0 0, 0 1, 1 1, 1 0, 0 0)))")
  end

  context "when valid" do
    describe 'GET /api/v1/places/nearby' do
      it 'returns a list of places' do
        get "/api/v1/places/nearby.json", :location => location_params
        expect(response).to be_success
      end
    end
  end

  context "when not valid" do
    describe 'GET /api/v1/places/nearby' do
      let(:error_message){ {"errors":[{"location":["parameter is required"]}]}.to_json }
      it 'returns a list of places' do
        get "/api/v1/places/nearby.json", {}
        expect(response).to have_http_status(400)
        expect(response.body).to eq(error_message) 
      end
    end
  end

end
