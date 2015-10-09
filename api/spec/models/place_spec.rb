require 'rails_helper'

describe Place, type: :model do

 let(:place) { Place.new(name: "The Empire State Building", authoritative: false) }

 describe "#valid?" do
   subject { place.valid? }

   context "validating a regular place" do
     it { should be true }
   end

   context "validating an 'authoritative' place" do
     before {place.authoritative = true }
     context "missing the bounding polygon" do
       it { should be false }
     end
     context "with bounding polygon" do
       before do
         place.authoritative_boundary = "POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10), (20 30, 35 35, 30 20, 20 30))"
       end
       it { should be true }
     end
   end

   context "imported data" do
     before { place.import_source = "open-geo-places.biz" }
     context "importated place missing metadata" do
       it { should be false }
     end
     context "importated place with metadata" do
       before { place.import_metadata = {'placename_key': 'yahoo WOE'}}
       it { should be true }
     end
   end
 end
end
