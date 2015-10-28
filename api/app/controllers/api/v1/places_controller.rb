class Api::V1::PlacesController < Api::V1::BaseController

  def nearby

    location = sanitize_location_params(location_params)

    my_loca_sql = "ST_GeomFromText('POINT(#{location[0]} #{location[1]})', 4326)"
    distance_sql = "ST_Distance(authoritative_boundary, #{my_loca_sql}, true)"
    within_sql = "ST_DWithin(#{my_loca_sql}, authoritative_boundary, 0.125)"
    width_sql = "ST_Length(ST_LongestLine(authoritative_boundary, authoritative_boundary), true)"

    select_sql = <<EOL
    id, name, category, authoritative_boundary as poly,
    #{distance_sql} as distance,
    #{width_sql} as max_width,
    relevance(#{distance_sql}, category, #{width_sql}) as relevance
EOL

    @places = Place
      .select(select_sql)
      .where(within_sql)
      .order("relevance DESC, category DESC, name ASC");

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
        format.json { render json: { error: "location param is formatted incorrectly" }, status: :bad_request }
      end
    end
    location_params
  end


end

