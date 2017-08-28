require 'rgeo/geo_json'

class Api::V1::VisitsController < Api::V1::BaseController
  def create
    @place = Place.find(params.require(:place_id))
    @visit = Visit.visit_place(@place, visit_params)

    respond_to do |format|
      if @visit.persisted?
        format.json do
          visit_json = @visit.as_json
          visit_json["location"] = RGeo::GeoJSON.encode(@visit.location)
          visit_json["place"] = @visit.place.as_json
          render json: visit_json, status: :created #, location: api_v1_visit_path(@place)
        end
      else
        format.json do
          render json: { error: { message: @visit.errors.full_messages.join(',') }},
                 status: :unprocessable_entity
        end
      end
    end
  end

  def visit_params
    tmp_params = params.require(:visit).permit([{:location => [:type,{:coordinates => []}]},
                                                :place_id])
    tmp_params.merge!({location: RGeo::GeoJSON.decode(tmp_params['location'].as_json).as_text}) unless tmp_params[:location].blank?
    tmp_params
  end

end
