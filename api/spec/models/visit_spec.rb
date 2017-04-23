require 'rails_helper'
describe Visit, type: :model do
  let(:place_params) { { name: 'place1', is_authoritative: false, category: :neighborhood }}
  let(:place){ FactoryGirl.create(:place, place_params) }
  let(:visit_params) { {location: RGeo::GeoJSON.decode({"type"=>"Point", "coordinates"=>[100.0, 0.0]}).as_text, place_id:place.id } }

  describe ".visit_place" do
    it "should set up a new boundary if non-authorititive" do
      expect_any_instance_of(Place).to receive(:update_boundary_by_visits)
      Visit.visit_place(place, visit_params)
    end
    it "should skip authorititive places" do
      place.update_attributes!(is_authoritative: true)
      expect_any_instance_of(Place).not_to receive(:update_boundary_by_visits)
      Visit.visit_place(place, visit_params)
    end
  end

end
