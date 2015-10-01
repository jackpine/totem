class Api::V1::PlacesController < Api::BaseController

  def nearby

    # stub out the cities list
    cities_list = JSON.parse(File.read(Rails.root.join('public', 'citiesList.json')))
    cities_list.collect! do |city_obj|
      ActiveSupport::HashWithIndifferentAccess.new(city_obj)
    end

    @places = cities_list
    respond_to do |format|
      format.json { render :index }
    end
  end

  private

  def place_params
    params.require(:place).permit(:place_id, location: [ :type, coordinates: [] ])
  end

end

