require 'rails_helper'
require 'json'

describe 'places requests' do

  let(:api_params) { {jwt: jwt} }
  let!(:user) { FactoryGirl.create(:user, public_token: "some-public-token", private_token: "some-private-token") }

  before do
    FactoryGirl.create(:place, name: 'place1', category: :neighborhood, is_authoritative: true, authoritative_boundary: "MULTIPOLYGON (((0 0, 0 1, 1 1, 1 0, 0 0)))")
  end

  describe 'POST /api/v1/places' do

    let(:jwt) { JWT.encode({ public_token: 'some-public-token', place: { name: "My New Place", category_id: 6}, location: {"type": "Point", "coordinates": [100.0, 0.0] }}, "some-private-token") }

    context 'when valid' do
      it 'creates a new place' do
        visit_count = Visit.count()
        post '/api/v1/places.json', api_params
        expect(response).to be_success

        expected_response = JSON.parse({
          name: "My New Place",
          category_id: 6,
          category: "neighborhood",
          id: Place.last.id,
        }.to_json)

        expect(JSON.parse(response.body)).to eq(expected_response)
        expect(Visit.count).to eq(visit_count + 1)
        expect(Visit.last.place_id).to eq(Place.last.id)

        location = RGeo::GeoJSON.decode({"type": "Point", "coordinates": [100.0, 0.0]}.deep_stringify_keys)
        expect(Place.last.boundary.contains?(location)).to be(true)
      end
    end
    context 'when missing required parameters' do

    end
  end

  context "#nearby" do

    let(:jwt) { JWT.encode({'lat': '37.787359', 'lon':'-122.408227', public_token: 'some-public-token'}, "some-private-token") }

    context "when valid" do
      describe 'GET /api/v1/places/nearby' do
        it 'returns a list of places' do
          get "/api/v1/places/nearby.json", api_params
          expect(response).to be_success
        end
      end
    end

    context "when not valid" do
      describe 'GET /api/v1/places/nearby' do
        it 'requires a jwt token' do
          error_message  = {"errors":[{"jwt":["parameter is required"]}]}.to_json
          get "/api/v1/places/nearby.json", {}
          expect(response).to have_http_status(400)
          expect(response.body).to eq(error_message)
        end
        it 'requires a location param' do
          error_message = {"errors":[{"lon":["parameter is required"]}]}.to_json
          jwt = JWT.encode({public_token: 'some-public-token'}, "some-private-token")
          get "/api/v1/places/nearby.json", {jwt: jwt}
          expect(response).to have_http_status(400)
          expect(response.body).to eq(error_message)
        end
        it 'requires a valid public-token param' do
          error_message = {"errors":["access denied"]}.to_json
          jwt = JWT.encode({'lat': '37.787359', 'lon':'-122.408227', public_token: 'invalid-token'}, "some-private-token")
          get "/api/v1/places/nearby.json", {jwt: jwt}
          expect(response).to have_http_status(403)
          expect(response.body).to eq(error_message)
        end
      end
    end

    context "in a neighborhoodc examining authoritative places nearby" do


      let!(:union_square_bounds) { "MULTIPOLYGON(((-122.420753 37.781406,-122.420753 37.79961,-122.394539 37.79961,-122.394539 37.781406,-122.420753 37.781406)))"}
      let!(:union_square) { FactoryGirl.create(:place, name: "Union Square", category: :neighborhood,is_authoritative: true, boundary:union_square_bounds) }

      let!(:noma_bounds) { "MULTIPOLYGON(((-122.417007 37.779583,-122.417007 37.792118,-122.401031 37.792118,-122.401031 37.779583,-122.417007 37.779583)))"}
      let!(:noma) { FactoryGirl.create(:place, name: "NOMA", category: :neighborhood, is_authoritative: true,  boundary: noma_bounds) }

      let!(:civic_center_bounds) { "MULTIPOLYGON(((-122.423874 37.768665,-122.423874 37.78986,-122.402214 37.78986,-122.402214 37.768665,-122.423874 37.768665)))"}
      let!(:civic_center) { FactoryGirl.create(:place, name: "Civic Center", category: :neighborhood, is_authoritative: true,  boundary: civic_center_bounds) }

      let!(:tenderloin_bounds) {"MULTIPOLYGON(((-122.423874 37.768665,-122.423874 37.78986,-122.402214 37.78986,-122.402214 37.768665,-122.423874 37.768665)))" }
      let!(:tenderloin) { FactoryGirl.create(:place, name: "Tenderloin", category: :neighborhood,is_authoritative: true,  boundary: tenderloin_bounds) }

      let!(:san_francisco_bounds) { "MULTIPOLYGON(((-122.561417 37.685516,-122.561417 37.86977,-122.333107 37.86977,-122.333107 37.685516,-122.561417 37.685516)))"}
      let!(:san_francisco) { FactoryGirl.create(:place, name: "San Francisco", category: :locality, is_authoritative: true,  boundary:san_francisco_bounds) }

      let!(:usa_bounds) { "MULTIPOLYGON(((-179.066162 20.808113,-179.066162 52.749592,-66.846313 52.749592,-66.846313 20.808113,-179.066162 20.808113)))"}
      let!(:usa) { FactoryGirl.create(:place, name: "United States", category: :country, is_authoritative: true, boundary:usa_bounds) }

      let!(:north_america_bounds) { "MULTIPOLYGON(((-164.443359 18.91087,-164.443359 73.824821,-33.099499 73.824821,-33.099499 18.91087,-164.443359 18.91087)))"}
      let!(:north_america) { FactoryGirl.create(:place, name: "North America", category: :continent, is_authoritative: true, boundary:north_america_bounds) }

      it "orders places based on location" do
        get "/api/v1/places/nearby.json", api_params
        expect(JSON.parse(response.body).map {|r| r["name"] }).to eq(["Civic Center",
                                                                      "NOMA",
                                                                      "Tenderloin",
                                                                      "Union Square",
                                                                      "San Francisco",
                                                                      "United States",
                                                                      "North America"])

      end


    end
  end

end
