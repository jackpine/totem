class Api::V1::PlacesController < Api::BaseController

  def nearby

    location = sanitize_location_params(params[:location])

    distance_func = "ST_Distance(authoritative_boundary, ST_GeomFromText('POINT(#{location[0]} #{location[1]})', 4326))"
    @places = Place
      .select('id', 'name', "#{distance_func} as distance")
      .order("distance, name").limit(20);

    respond_to do |format|
      format.json { render :index }
    end
  end

  private

  def place_params
    params.require(:place).permit()
  end


  def sanitize_location_params(param)
    location_params = param.split(',').map {|v| v.to_f }
    if location_params.length != 2
      respond_to do |format|
        format.json { render json: { error: "locate param is formatted incorrectly" }, status: :bad_request }
      end
    end
    location_params
  end


end

