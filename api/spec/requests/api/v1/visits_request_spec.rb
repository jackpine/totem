
require 'rails_helper'
require 'json'

describe 'places requests' do
  let(:place){ Place.create!(name: 'place1', is_authoritative: false, category: :neighborhood) }

  describe 'POST /api/v1/places/:id/visits' do
    context 'when valid' do
      let(:valid_params){ {location: {"type": "Point", "coordinates": [100.0, 0.0]},
                           place_id:place.id } }

      it 'creates a new visit' do

        post "/api/v1/places/#{place.id}/visits",{visit: valid_params, format: :json}

        expect(response).to be_success

        expected_response = JSON.parse({
            location: { "type": "Point", "coordinates": [100.0, 0.0] },
            place_id: place.id,
            id: Visit.last.id,
        }.to_json)

        expect(JSON.parse(response.body)).to eq(expected_response)
      end
    end
    context 'when missing required parameters' do
      let(:invalid_location_params){ { place_id:place.id } }
      it 'does not create a new visit' do
        post "/api/v1/places/#{place.id}/visits",{visit: invalid_location_params, format: :json}
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body)['error']['message']).to eq('Location can\'t be blank')
      end
    end
  end
end
