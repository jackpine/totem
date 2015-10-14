require 'rails_helper'
require 'json'

describe 'places requests' do

  let(:location_params) { "-122.408227,37.787359" }

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

  context "in a neighborhoodc examining authoritative places nearby" do


    let!(:union_square_bounds) { "MULTIPOLYGON(((-122.420753 37.781406,-122.420753 37.79961,-122.394539 37.79961,-122.394539 37.781406,-122.420753 37.781406)))"}
    let!(:union_square) { Place.create(name: "Union Square", category: :neighborhood,is_authoritative: true, authoritative_boundary:union_square_bounds) }

    let!(:noma_bounds) { "MULTIPOLYGON(((-122.417007 37.779583,-122.417007 37.792118,-122.401031 37.792118,-122.401031 37.779583,-122.417007 37.779583)))"}
    let!(:noma) { Place.create(name: "NOMA", category: :neighborhood, is_authoritative: true,  authoritative_boundary: noma_bounds) }

    let!(:civic_center_bounds) { "MULTIPOLYGON(((-122.423874 37.768665,-122.423874 37.78986,-122.402214 37.78986,-122.402214 37.768665,-122.423874 37.768665)))"}
    let!(:civic_center) { Place.create(name: "Civic Center", category: :neighborhood, is_authoritative: true,  authoritative_boundary: civic_center_bounds) }

    let!(:tenderloin_bounds) {"MULTIPOLYGON(((-122.423874 37.768665,-122.423874 37.78986,-122.402214 37.78986,-122.402214 37.768665,-122.423874 37.768665)))" }
    let!(:tenderloin) { Place.create(name: "Tenderloin", category: :neighborhood,is_authoritative: true,  authoritative_boundary: tenderloin_bounds) }

    let!(:san_francisco_bounds) { "MULTIPOLYGON(((-122.561417 37.685516,-122.561417 37.86977,-122.333107 37.86977,-122.333107 37.685516,-122.561417 37.685516)))"}
    let!(:san_francisco) { Place.create(name: "San Francisco", category: :locality, is_authoritative: true,  authoritative_boundary:san_francisco_bounds) }

    let!(:usa_bounds) { "MULTIPOLYGON(((-179.066162 20.808113,-179.066162 52.749592,-66.846313 52.749592,-66.846313 20.808113,-179.066162 20.808113)))"}
    let!(:usa) { Place.create(name: "United States", category: :country, is_authoritative: true, authoritative_boundary:usa_bounds) }

    let!(:north_america_bounds) { "MULTIPOLYGON(((-164.443359 18.91087,-164.443359 73.824821,-33.099499 73.824821,-33.099499 18.91087,-164.443359 18.91087)))"}
    let!(:north_america) { Place.create(name: "North America", category: :continent, is_authoritative: true, authoritative_boundary:north_america_bounds) }

    it "orders places based on location" do
      get "/api/v1/places/nearby.json", :location => location_params
      expect(JSON.parse(response.body)["places"].map {|r| r["name"] }).to eq(["Civic Center",
                                                                  "NOMA",
                                                                  "Tenderloin",
                                                                  "Union Square",
                                                                  "San Francisco",
                                                                  "United States",
                                                                  "North America"])

    end


  end

end
