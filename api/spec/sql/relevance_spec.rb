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
      context "a large diamter place" do
        let(:diameter){ 100000 }
        let(:distance){ diameter / 100.0 }
        it{ expect(subject).to be_within(0.001).of(0.755) }
      end
      context "a small diameter place" do
        let(:diameter){ 50 }
        let(:distance){ diameter / 100.0 }
        it{ expect(subject).to be_within(0.001).of(0.755) }
      end
    end

    context "relevance drops off very sharply with distance" do
      context "it's basically zero" do
        let(:distance) {diameter / 4.0}
        it{ expect(subject).to be_within(0.00001).of(0.0) }
      end
      context "relevance is somewhat significant" do
        let(:distance) {diameter / 10.0}
        it{ expect(subject).to be_within(0.01).of(0.01) }
      end
    end
  end

  describe "#category_relevance" do
    let(:sql){"select * from category_relevance(#{category})"}
    let(:query_response) { ActiveRecord::Base.connection.execute(sql)}
    subject { query_response[0]["category_relevance"].to_f }
    context "a continent" do
      let(:category){ 1 } 
      it{ expect(subject).to be(0.35) }
    end

    context "country" do
      let(:category){ 2 } 
      it{ expect(subject).to be(0.45) }
    end

    context "region" do
      let(:category){ 3 } 
      it{ expect(subject).to be(0.45) }
    end

    context "county" do
      let(:category){ 4 } 
      it{ expect(subject).to be(0.5) }
    end

    context "locality" do
      let(:category){ 5 } 
      it{ expect(subject).to be(0.9) }
    end

    context "neighborhood" do
      let(:category){ 6 } 
      it{ expect(subject).to be(0.9) }
    end

    context "user defined" do
      let(:category){ 7 } 
      it{ expect(subject).to be(1.0) }
    end
  end
end
