require 'rails_helper'
require 'json'

describe 'messages requests' do

  let(:place){ FactoryGirl.create(:place, name: 'place1', is_authoritative: false, category: :neighborhood) }
  let(:visit){ FactoryGirl.create(:visit) }
  let!(:user) { FactoryGirl.create(:user, public_token: "some-public-token", private_token: "some-private-token") }

  describe 'POST /api/v1/places/:place_id/messages' do
    context 'when valid' do
      let(:valid_params){ {jwt: jwt} }

      let(:jwt) { JWT.encode({message: {location: {"type": "Point", "coordinates": [100.0, 0.0]},
                                        body: "Foo",
                                        subject: "another fine subject",
                                        visit_id: visit.id,
                                        place_id: place.id}, public_token: 'some-public-token'}, "some-private-token") }

      it 'creates a new message' do

        post "/api/v1/places/#{place.id}/messages.json", valid_params

        expect(response).to be_success

        expected_response = JSON.parse({
            location: { "type": "Point", "coordinates": [100.0, 0.0] },
            place_id: place.id,
            user_id: user.id,
            body: 'Foo',
            place: {id: place.id, name: "place1", category_id: 6, category: "neighborhood"},
            id: Message.last.id
        }.to_json)

        expect(JSON.parse(response.body)).to eq(expected_response)
      end
    end
  end

  describe 'GET /api/v1/places/:place_id/messages' do
    context 'when valid' do
      let(:valid_params){ {jwt: jwt} }
      let!(:message1){ FactoryGirl.create(:message, place: place, user: user) }
      let!(:message2){ FactoryGirl.create(:message, place: place, user: user) }

      let(:jwt) { JWT.encode({place_id: place.id, public_token: 'some-public-token'}, "some-private-token") }

      it 'returns a list of messages for that place' do

        get "/api/v1/places/#{place.id}/messages.json", valid_params

        expect(response).to be_success

        expect(JSON.parse(response.body).map{|msg| msg['id'] }).to eq([message1.id, message2.id])
      end
    end
  end
end
