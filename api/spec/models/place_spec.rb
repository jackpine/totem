require 'rails_helper'

describe Place, type: :model do

 let(:place) { FactoryGirl.build(:place, name: "The Empire State Building", category: :neighborhood) }

 describe "#valid?" do
   subject { place.valid? }

   context "validating a regular place" do
     it { should be true }
   end
   context "missing the bounding polygon" do
     before { place.authoritative_boundary = nil }
     it { should be false }
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

   context "missing name attribute" do
     before { place.name = nil }
     it { should be false }
   end
 end

 describe "#category" do
   it {expect(place.category).to eq "neighborhood" }
 end
 describe "#category=" do
   before { place.category = :continent }
   it { expect(place.category_id).to eq 1 }
   it { expect(place.category).to eq "continent" }
 end
end
