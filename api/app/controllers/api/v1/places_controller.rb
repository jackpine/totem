class Api::V1::PlacesController < Api::V1::BaseController

  def create
    @place = Place.create_at_location(place_params, location_params)

    respond_to do |format|
      if @place.persisted?
        format.json do
          render json: @place.as_json, status: :created#, location: api_v1_place_path(@place)
        end
      else
        format.json do
          render json: { error: { message: @place.errors.full_messages.join(',') }},
                 status: :unprocessable_entity
        end
      end
    end
  end

  def nearby

    location = sanitize_nearby_params(nearby_params)
    @places = Place.nearby(location[0], location[1], 0.125)


    respond_to do |format|
      format.json { render :index }
    end
  end

  private

  def place_create_params
    tmp_params = params.require(:place).permit([{:location => [:type,{:coordinates => []}]},
                                                :name,
                                                :category_id])
    tmp_params
  end
  def location_params
    tmp_params = place_create_params.permit([{:location => [:type,{:coordinates => []}]}])
    tmp_params.merge!({location: RGeo::GeoJSON.decode(tmp_params['location']).as_text}) unless tmp_params[:location].blank?
    tmp_params
  end
  def place_params
    place_create_params.permit([:name,
                                :category_id])
  end

  def nearby_params
    params.require(:location)
  end

  def sanitize_nearby_params(param)
    if param.blank?
      nearby_params = []
    else
      nearby_params = param.split(',').map {|v| v.to_f }
    end

    if nearby_params.length != 2
      respond_to do |format|
        format.json { render json: { error: "location param is formatted incorrectly" }, status: :bad_request }
      end
    end
    nearby_params
  end


end

