class Api::V1::PlacesController < Api::V1::BaseController

  def nearby

    location = sanitize_location_params(location_params)

    my_loc = "ST_GeomFromText('POINT(#{location[0]} #{location[1]})', 4326)"
    distance_func = "ST_Distance(authoritative_boundary, #{my_loc}, true)"
    within_func = "ST_DWithin(#{my_loc}, authoritative_boundary, 0.125)"

    @places = Place
      .select('id', 'name', "#{distance_func} as distance")
      .where(within_func)
      .order("distance ASC, category DESC, name ASC").limit(20);

    respond_to do |format|
      format.json { render :index }
    end
  end

  private

  def location_params
    params.require(:location)
  end


  def sanitize_location_params(param)
    if param.blank?
      location_params = []
    else
      location_params = param.split(',').map {|v| v.to_f }
    end

    if location_params.length != 2
      respond_to do |format|
        format.json { render json: { error: "locate param is formatted incorrectly" }, status: :bad_request }
      end
    end
    location_params
  end


end

