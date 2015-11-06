class Api::V1::PlacesController < Api::V1::BaseController

  def create
    @place = Place.new(place_params)
    @place.is_authoritative = false

    respond_to do |format|
      if @place.save
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

    location = sanitize_location_params(location_params)
    @places = Place.nearby(location[0], location[1], 0.125)


    respond_to do |format|
      format.json { render :index }
    end
  end

  private

  def location_params
    params.require(:location)
  end

  def place_params
    params.require(:place).permit([:name, :category_id])
  end


  def sanitize_location_params(param)
    if param.blank?
      location_params = []
    else
      location_params = param.split(',').map {|v| v.to_f }
    end

    if location_params.length != 2
      respond_to do |format|
        format.json { render json: { error: "location param is formatted incorrectly" }, status: :bad_request }
      end
    end
    location_params
  end


end

