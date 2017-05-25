class Api::V1::PlacesController < Api::V1::BaseController

  include AcceptsLocationParams

  def create
    @place = Place.create_at_location(place_params, location_params(params))

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

    @places = Place.relevant_nearby(nearby_params.fetch('lon'), nearby_params.fetch('lat'))

    respond_to do |format|
      format.json { render :index }
    end
  end

  private

  def place_params
    params.require(:place).permit([:name,
                                   :category_id])
  end

  def nearby_params
    params.permit([:lat, :lon])
  end

end

