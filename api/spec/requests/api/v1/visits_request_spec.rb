
require 'rails_helper'
require 'json'

describe 'places requests' do
  let(:place){ FactoryGirl.create(:place, name: 'place1', is_authoritative: false, category: :neighborhood) }
  let!(:user) { FactoryGirl.create(:user, public_token: "some-public-token", private_token: "some-private-token") }

  describe 'POST /api/v1/places/:place_id/visits' do
    context 'when valid' do
      let(:valid_params){ {jwt: jwt} }

      let(:jwt) { JWT.encode({visit: {location: {"type": "Point", "coordinates": [100.0, 0.0]},
                                      place_id:place.id}, public_token: 'some-public-token'}, "some-private-token") }

      it 'creates a new visit' do

        post "/api/v1/places/#{place.id}/visits.json", params: valid_params

        expect(response).to be_success

        expected_response = JSON.parse({
            location: { "type": "Point", "coordinates": [100.0, 0.0] },
            place_id: place.id,
            place: {id: place.id, name: "place1", category_id: 6, category: "neighborhood"},
            id: Visit.last.id,
        }.to_json)

        expect(JSON.parse(response.body)).to eq(expected_response)
      end
    end
    context 'when missing required parameters' do
      let(:invalid_location_params){ { jwt: JWT.encode({visit: {place_id:place.id}, public_token: 'some-public-token'}, 'some-private-token') } }
      it 'does not create a new visit' do
        post "/api/v1/places/#{place.id}/visits.json", params: invalid_location_params
        expect(JSON.parse(response.body)['error']['message']).to eq('Location can\'t be blank')
        expect(response).to have_http_status(422)
      end
    end
  end
end
