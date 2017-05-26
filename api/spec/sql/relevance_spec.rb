require 'rails_helper'

describe "totem relevance models" do

  describe "#distance_relevance" do

    let(:place_cat){ 3 }
    let(:diameter){ 10000 }
    let(:sql){"select * from distance_relevance(#{distance}, #{diameter})"}
    let(:query_response) { ActiveRecord::Base.connection.execute(sql)}
    subject { query_response[0]["distance_relevance"].to_f }

    context "You're within the diameter" do
      let(:distance){ 0 }
      it{ expect(subject).to eq(1.0) }
    end

    context "relevance varies as diameter/distance" do
      context "a large diameter place" do
        let(:diameter){ 10_000_000 } # like an ocean
        let(:distance){ 20_000 }
        it{ expect(subject).to be_within(0.01).of(0.75) }
      end
      context "a medium diamter place" do
        let(:diameter){ 1_000_000 } # like an ocean
        let(:distance){ 10000 }
        it{ expect(subject).to be_within(0.01).of(0.75) }
      end
      context "a medium diamter place" do
        let(:diameter){ 10_000 }
        let(:distance){ 1000 }
        it{ expect(subject).to be_within(0.01).of(0.75) }
      end
      context "a small diamter place" do
        let(:diameter){ 1_000 }
        let(:distance){ 100 }
        it{ expect(subject).to be_within(0.01).of(0.75) }
      end
      context "a extra small diameter place" do
        let(:diameter){ 100 }
        let(:distance){ 200 }
        it{ expect(subject).to be_within(0.01).of(0.75) }
      end
      context "a extra small diameter place" do
        let(:diameter){ 50 }
        let(:distance){ 150 }
        it{ expect(subject).to be_within(0.01).of(0.75) }
      end
    end
  end

  describe "#category_relevance" do
    let(:sql){"select * from category_relevance(#{category})"}
    let(:query_response) { ActiveRecord::Base.connection.execute(sql)}
    subject { query_response[0]["category_relevance"].to_f }
    context "a continent" do
      let(:category){ 1 } 
      it{ expect(subject).to be(0.25) }
    end

    context "country" do
      let(:category){ 2 } 
      it{ expect(subject).to be(0.35) }
    end

    context "region" do
      let(:category){ 3 } 
      it{ expect(subject).to be(0.35) }
    end

    context "county" do
      let(:category){ 4 } 
      it{ expect(subject).to be(0.4) }
    end

    context "locality" do
      let(:category){ 5 } 
      it{ expect(subject).to be(0.8) }
    end

    context "neighborhood" do
      let(:category){ 6 } 
      it{ expect(subject).to be(0.8) }
    end

    context "user defined" do
      let(:category){ 7 } 
      it{ expect(subject).to be(1.0) }
    end
  end
end
