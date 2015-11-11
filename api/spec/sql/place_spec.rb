require 'rails_helper'
require 'RGeo'

describe "place boundary sql functions" do

  describe "#place_calculate_boundary" do

    let(:factory) { RGeo::Cartesian.preferred_factory() }
    let(:authoritative_boundary){ "MULTIPOLYGON (((0 0, 0 10, 10 10, 10 0, 0 0)),
                                                 ((15 0, 15 10, 25 10, 25 0, 15 0)))" }
    let(:visits){ "MULTIPOINT ((-1 0), (16 0))" }

    let(:sql){"select ST_AsText(place_calculate_boundary) as poly_wkt from place_calculate_boundary(ST_GeomFromText('#{authoritative_boundary}'), ST_GeomFromText('#{visits}')); "}
    let(:query_response) { ActiveRecord::Base.connection.execute(sql)}
    let(:boundary_result) {  factory.parse_wkt(query_response[0]["poly_wkt"]) }

    it "the convex hull expands because of the visit" do
      expect(boundary_result.distance(factory.parse_wkt('POINT(-1 0)'))).to be 0.0
      expect(boundary_result.distance(factory.parse_wkt('POINT(25 0)'))).to be 0.0
    end
    it "points outside the respective polygons have distance" do
      expect(boundary_result.distance(factory.parse_wkt('POINT(26 0)'))).to be 1.0
      expect(boundary_result.distance(factory.parse_wkt('POINT(-2 0)'))).to be 1.0
    end

  end
end
