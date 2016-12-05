module AcceptsLocationParams
  extend ActiveSupport::Concern

  def location_params(root_params)
    tmp_params = root_params.require(:location).permit([:type,{:coordinates => []}])
    {location: RGeo::GeoJSON.decode(tmp_params).as_text}
  end

end
